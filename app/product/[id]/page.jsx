"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";
import ProductReviews from "@/components/reviews/ProductReviews";

/**
 * Product page with:
 * ✅ Color → image switching
 * ✅ Hover thumbnail preview (like Daraz/Nike)
 * ✅ Color name mapping for hex codes
 * ✅ TEMP out-of-stock per-color (Option B)
 *
 * Option B behaviour:
 * - If product has availableColors -> outOfStockColors applies per color.
 * - If product has NO availableColors -> attempt to auto-detect color from product name
 *   using keywords (Beige, Gray). If detected and present in outOfStockColors -> treat as out-of-stock.
 */

// whatsapp number for contact button
const WHATSAPP_NUMBER = "+923701114204"; // Pakistan number, no +


const colorMap = {
  black: "Black",
  white: "White",
  "#c8a2c8": "Lilac",
  "#36454f": "Charcoal",
  "#bd6a7c": "Pink",
  "#59251c": "Brown",
  "#a6072e": "Red",
  "#ebd3b2": "Beige",
  "#bebebe": "Gray",
  "#0e43ad": "Blue",
  "#800000": "Maroon",
  "#084C41": "Bottle Green",
};

// --- auto-detect color keywords (from your last message)
// We'll use the human-readable names (Beige, Gray) to detect in product names.
// You can expand this list later.
const AUTO_COLOR_KEYWORDS = ["Gray"];

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, getAdjustedPrice, setIsCartOpen } = useAppContext();

  // product data + display
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null); // 👈 new for preview hover

  // variants
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(null);

  // modals
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showColorGuide, setShowColorGuide] = useState(false);

  // util fns
  const normalizeColorKey = (c) =>
    String(c || "")
      .trim()
      .toLowerCase()
      .replace(/^#/, "");
  const sanitizeColorForSearch = (c) => normalizeColorKey(c);
  const isValidCssColor = (c) => {
    if (!c) return false;
    const s = new Option().style;
    s.color = "";
    s.color = c;
    return !!s.color;
  };

  const dedupe = (arr = []) => Array.from(new Set(arr.filter(Boolean)));

  // Map a color value (hex or name) to a readable color name for checking outOfStockColors
  const getColorName = (color) => {
    if (!color) return null;
    // if hex or starts with #
    const key = String(color).trim();
    // direct lookup in colorMap (keys normalized in colorMap include hex with # and plain names)
    // try exact key first
    if (colorMap[key]) return colorMap[key];
    // try normalized forms
    const lower = key.toLowerCase();
    if (colorMap[lower]) return colorMap[lower];
    // check hex normalized (without #)
    if (key.startsWith("#")) {
      const hexLower = key.toLowerCase();
      if (colorMap[hexLower]) return colorMap[hexLower];
    }
    // fallback: if input is a textual color, return title-cased version
    // e.g., "beige" -> "Beige"
    if (!key.startsWith("#")) {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
    return key;
  };

  // Build normalized imagesByColor for lookup
  const buildNormalizedImagesByColor = (product) => {
    if (!product?.imagesByColor || typeof product.imagesByColor !== "object")
      return null;
    const normalized = {};
    for (const rawKey of Object.keys(product.imagesByColor)) {
      const key = normalizeColorKey(rawKey);
      if (!key) continue;
      const urls = Array.isArray(product.imagesByColor[rawKey])
        ? product.imagesByColor[rawKey].slice()
        : [];
      if (urls.length) normalized[key] = urls;
    }
    return Object.keys(normalized).length ? normalized : null;
  };

  const findImagesForColor = (product, color) => {
    if (!product || !color) return null;
    const normColor = normalizeColorKey(color);
    const normalizedMap = buildNormalizedImagesByColor(product);
    if (normalizedMap?.[normColor]) return normalizedMap[normColor];

    const urlList = Array.isArray(product.image) ? product.image : [];
    const searchToken = sanitizeColorForSearch(color);
    const matches = urlList.filter((u) =>
      u.toLowerCase().includes(searchToken)
    );
    if (matches.length) return matches;
    const hexMatches = urlList.filter((u) =>
      u.toLowerCase().includes(normColor)
    );
    if (hexMatches.length) return hexMatches;
    return null;
  };

  // --- NEW: determine an auto-detected color from product name (for no-color products)
  const detectColorFromName = (product) => {
    if (!product?.name) return null;
    const nameLower = product.name.toLowerCase();
    for (const kw of AUTO_COLOR_KEYWORDS) {
      if (nameLower.includes(kw.toLowerCase())) {
        return kw; // return human-readable name (e.g., "Beige")
      }
    }
    return null;
  };

  // Determine if color (or detected color) is out of stock for this product
  const isColorOutOfStock = (product, color) => {
    // product.outOfStockColors expected to be array of strings (prefer lowercase saved in DB)
    if (!product) return false;
    const outList = (product.outOfStockColors || []).map((c) => String(c).toLowerCase());
    // if product has explicit isOutOfStock flag (whole product), consider that too
    if (product.isOutOfStock) return true;

    // if color is null and product has no colors, try detect from name
    let resolvedColor = color;
    const hasColors = Array.isArray(product.availableColors) && product.availableColors.length > 0;

    if ((!resolvedColor || resolvedColor === "default") && !hasColors) {
      const detected = detectColorFromName(product); // returns human name like "Beige"
      resolvedColor = detected;
    } 

    if (!resolvedColor) return false;

    // map hex to color name when necessary
    const colorName = getColorName(resolvedColor);
    if (!colorName) return false;

    return outList.includes(String(colorName).toLowerCase());
  };

  // Fetch product
  const fetchProductData = async () => {
    const product = products.find((p) => p._id === id);
    setProductData(product);
    if (!product) return console.warn("Product not found:", id);

    const initialSize = product.availableSizes?.[0] ?? "M";
    setSelectedSize(initialSize);

    // initial color: prefer the first availableColor, else fallback to imagesByColor, else detect from name, else null/default
    let initialColor = product.availableColors?.[0] ?? null;
    if (!initialColor) {
      const normalizedMap = buildNormalizedImagesByColor(product);
      if (normalizedMap) initialColor = Object.keys(normalizedMap)[0];
    }

    // If still no color, attempt auto-detect from product name (Option B)
    if (!initialColor) {
      const detected = detectColorFromName(product);
      if (detected) {
        initialColor = detected;
      }
    }

    // As a last fallback, if no color at all, set to "default" (earlier behaviour)
    if (!initialColor) initialColor = "default";

    setSelectedColor(initialColor);

    const colorImages = findImagesForColor(product, initialColor);
    setMainImage(colorImages?.[0] ?? product.image?.[0] ?? assets.box_icon);
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, products.length]);

  useEffect(() => {
    if (productData && (!productData.availableColors || productData.availableColors.length === 0)) {
      // try to retain detected color or set default
      const detected = detectColorFromName(productData);
      setSelectedColor(detected ?? "default");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);

  useEffect(() => {
    if (!productData) return;
    const colorImages = findImagesForColor(productData, selectedColor);
    if (colorImages?.length) setMainImage(colorImages[0]);
    else if (productData.image?.[0]) setMainImage(productData.image[0]);
  }, [selectedColor, productData]);

  if (!productData) return <Loading />;

  const thumbnailsForCurrentColor = () => {
    const colorImages = findImagesForColor(productData, selectedColor) || [];
    const fallback = productData.image || [];
    return dedupe(colorImages.length ? colorImages : fallback);
  };

  const adjustedPrice = getAdjustedPrice(
    productData,
    selectedSize,
    selectedColor
  );
  const adjustedBasePrice = getAdjustedPrice(
    { ...productData, offerPrice: productData.price },
    selectedSize,
    selectedColor
  );

  // determine resolved out-of-stock state for UI (button disabling etc)
  const colorOut = isColorOutOfStock(productData, selectedColor);

  // whatsapp chat option
  const openWhatsApp = () => {
  if (!productData) return;

  const productName = productData.name;
  const sizeText = selectedSize ? `Size: ${selectedSize}` : "Size: Not selected";
  const colorText =
    selectedColor && selectedColor !== "default"
      ? `Color: ${getColorName(selectedColor)}`
      : "Color: Not applicable";

  const message = `
Hello 👋
I want to customize this product:

Product: ${productName}
${sizeText}
${colorText}

Please guide me about customization options.
`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};


  return (
    <div className="min-h-screen bg-white">
      <div className="site-container py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Large Product Image with Thumbnails */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="relative overflow-hidden rounded-lg bg-gray-50">
              <div className="aspect-square">
                <Image
                  src={
                    hoverImage ||
                    mainImage ||
                    productData.image[0] ||
                    assets.box_icon
                  }
                  alt={productData.name || "product image"}
                  className="w-full h-full object-cover transition-all duration-500 ease-out"
                  width={800}
                  height={800}
                  priority
                />
              </div>
              
              {/* Badge for Sale */}
              {adjustedPrice < adjustedBasePrice && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 text-xs font-bold tracking-widest uppercase">
                  Sale
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnailsForCurrentColor().map((image, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoverImage(image)}
                  onMouseLeave={() => setHoverImage(null)}
                  onClick={() => setMainImage(image)}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer transition-all duration-300 ${
                    mainImage === image ? 'ring-2 ring-red-500 ring-offset-2' : 'hover:opacity-80'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productData.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-8">
            {/* Product Name */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-black leading-tight uppercase tracking-tight">
                {productData.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Image
                    key={i}
                    className="h-5 w-5"
                    src={assets.star_icon}
                    alt="star_icon"
                  />
                ))}
                <Image
                  className="h-5 w-5"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
                <span className="text-sm text-gray-600 ml-1">(4.5)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl lg:text-4xl font-black text-black">
                  {currency}{adjustedPrice}
                </span>
                {adjustedPrice < adjustedBasePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {currency}{adjustedBasePrice}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {productData.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold tracking-widest uppercase text-black">Size</label>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex gap-3">
                {(productData.availableSizes || ["M", "L"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-lg border-2 font-bold text-sm transition-all duration-300 ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-black hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-4">
              <label className="text-sm font-bold tracking-widest uppercase text-black">Color</label>

              <div className="flex gap-3 items-center">
                {(productData.availableColors || ["#000000", "#ffffff"]).map(
                  (color) => {
                    const valid = isValidCssColor(color);
                    const displayName = getColorName(color) || color;
                    const thisColorOut = isColorOutOfStock(productData, color);

                    return (
                      <button
                        key={color}
                        onClick={() => !thisColorOut && setSelectedColor(color)}
                        disabled={thisColorOut}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color ? "border-black ring-2 ring-red-500 ring-offset-2" : "border-gray-300"
                        } ${thisColorOut ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}`}
                        title={thisColorOut ? `${displayName} is Out of Stock` : displayName}
                        aria-label={`Select color ${displayName}`}
                        style={
                          valid
                            ? { background: color }
                            : { background: "#ffffff" }
                        }
                      >
                        {!valid && (
                          <span className="text-xs text-gray-700 font-bold">
                            {String(color).charAt(0).toUpperCase()}
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="text-sm text-gray-600 mt-2">
                Selected: <span className="font-medium text-black">
                  {selectedColor
                    ? getColorName(selectedColor) || selectedColor
                    : "—"}
                </span>
              </div>

              {/* Out of Stock Message */}
              {selectedColor && isColorOutOfStock(productData, selectedColor) && (
                <p className="text-red-500 text-sm font-medium">This color is Out of Stock</p>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              {productData.isCustomizable ? (
                <button
                  onClick={openWhatsApp}
                  className="w-full py-4 bg-green-600 text-white hover:bg-green-700 transition-all duration-300 font-bold tracking-widest uppercase rounded-lg"
                >
                  Customize on WhatsApp
                </button>
              ) : (
                <button
                  disabled={colorOut}
                  onClick={() => {
                    if (colorOut) return toast.error("This color is Out of Stock!");
                    if (!selectedSize) return toast.error("Please select a size");
                    if ((productData.availableColors?.length ?? 0) > 0 && !selectedColor) {
                      return toast.error("Please select a color");
                    }
                    addToCart(productData._id, selectedSize, selectedColor);
                    setIsCartOpen(true);
                  }}
                  className={`w-full py-4 font-bold tracking-widest uppercase transition-all duration-300 rounded-lg ${
                    colorOut
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-black text-white hover:bg-red-500 transform hover:scale-105"
                  }`}
                >
                  {colorOut ? "Out of Stock" : "Add to Cart"}
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-black">Free Shipping on Orders Over {currency}100</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-black">Easy Returns Within 30 Days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-black">100% Authentic Products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-black text-black mb-6 uppercase tracking-tight">Product Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Category</span>
                  <span className="text-sm font-bold text-black uppercase">{productData.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Material</span>
                  <span className="text-sm font-bold text-black">100% Premium Cotton</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Fit</span>
                  <span className="text-sm font-bold text-black">Regular Fit</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium text-gray-600">Care</span>
                  <span className="text-sm font-bold text-black">Machine Washable</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-black text-black mb-6 uppercase tracking-tight">Size Guide</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="w-full py-3 bg-black text-white hover:bg-red-500 transition-all duration-300 font-bold tracking-widest uppercase rounded-lg"
                >
                  View Size Chart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-black mb-4 uppercase tracking-tight">
              You May Also Like
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-4xl w-full p-8 rounded-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-black text-black mb-6 uppercase tracking-tight">Size Guide</h3>
              <Image
                src={assets.size_guie_image}
                alt="Size Guide"
                width={800}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Color Guide Modal */}
      {showColorGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-md w-full p-8 rounded-lg relative">
            <button
              onClick={() => setShowColorGuide(false)}
              className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h3 className="text-xl font-black text-black mb-4 uppercase tracking-tight">Color Guide</h3>
              <p className="text-gray-600 leading-relaxed">
                Colors may vary slightly based on your screen. For accuracy, refer to color name or hex in product details.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20">
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default Product;

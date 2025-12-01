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
};

// --- auto-detect color keywords (from your last message)
// We'll use the human-readable names (Beige, Gray) to detect in product names.
// You can expand this list later.
const AUTO_COLOR_KEYWORDS = ["Gray"];

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, getAdjustedPrice } = useAppContext();

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

  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 transition-all duration-300 ease-in-out">
              <Image
                src={
                  hoverImage ||
                  mainImage ||
                  productData.image[0] ||
                  assets.box_icon
                }
                alt={productData.name || "product image"}
                className="w-full h-auto object-cover mix-blend-multiply transition-all duration-300 ease-in-out"
                width={1280}
                height={720}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {thumbnailsForCurrentColor().map((image, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoverImage(image)} // 👈 preview on hover
                  onMouseLeave={() => setHoverImage(null)} // revert
                  onClick={() => setMainImage(image)} // permanently select
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 hover:opacity-80 transition"
                >
                  <Image
                    src={image}
                    alt={`${productData.name} thumbnail ${index + 1}`}
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={1280}
                    height={720}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>

            <div className="flex items-center gap-2">
              {[...Array(4)].map((_, i) => (
                <Image
                  key={i}
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
              ))}
              <Image
                className="h-4 w-4"
                src={assets.star_dull_icon}
                alt="star_dull_icon"
              />
              <p>(4.5)</p>
            </div>

            <p className="text-gray-600 mt-3">{productData.description}</p>

            <p className="text-3xl font-medium mt-6">
              Rs.{adjustedPrice}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                Rs.{adjustedBasePrice}
              </span>
            </p>

            <hr className="bg-gray-600 my-6" />

            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">{productData.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Size selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Size</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-gray-500"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex gap-3 mt-3">
                {(productData.availableSizes || ["M", "L"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-md border ${
                      selectedSize === size
                        ? "bg-gray-800 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Color</p>
              </div>

              <div className="flex gap-3 mt-3 items-center">
                {(productData.availableColors || ["#000000", "#ffffff"]).map(
                  (color) => {
                    const valid = isValidCssColor(color);
                    // For display/title we prefer the mapped name (if available)
                    const displayName = getColorName(color) || color;
                    const thisColorOut = isColorOutOfStock(productData, color);

                    return (
                      <button
                        key={color}
                        onClick={() => !thisColorOut && setSelectedColor(color)}
                        disabled={thisColorOut}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                          selectedColor === color ? "ring-2 ring-offset-2" : ""
                        } ${thisColorOut ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                        title={thisColorOut ? `${displayName} is Out of Stock` : displayName}
                        aria-label={`Select color ${displayName}`}
                        style={
                          valid
                            ? { background: color }
                            : { background: "#ffffff" }
                        }
                      >
                        {!valid && (
                          <span className="text-xs text-gray-700">
                            {String(color).charAt(0).toUpperCase()}
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Selected:{" "}
                <span className="font-medium">
                  {selectedColor
                    ? getColorName(selectedColor) || selectedColor
                    : "—"}
                </span>
              </div>

              {/* show out-of-stock when selected or detected */}
              {selectedColor && isColorOutOfStock(productData, selectedColor) && (
                <p className="text-red-500 text-sm mt-2">This color is Out of Stock</p>
              )}

              {/* if product has no colors but an auto-detected color exists and is out of stock */}
              {!productData.availableColors?.length && detectColorFromName(productData) && isColorOutOfStock(productData, detectColorFromName(productData)) && (
                <p className="text-red-500 text-sm mt-2">This product (detected color: {detectColorFromName(productData)}) is Out of Stock</p>
              )}
            </div>

            {/* Cart buttons */}
            <div className="flex items-center mt-10 gap-4">
              <button
                disabled={colorOut}
                onClick={() => {
                  if (colorOut) return toast.error("This color is Out of Stock!");
                  if (!selectedSize) return toast.error("Please select a size");
                  // If product has colors but user hasn't selected one, block
                  if ((productData.availableColors?.length ?? 0) > 0 && !selectedColor) {
                    return toast.error("Please select a color");
                  }
                  addToCart(productData._id, selectedSize, selectedColor);
                }}
                className={`w-full py-3.5 ${colorOut ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 text-gray-800 hover:bg-gray-200"} transition`}
              >
                {colorOut ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                disabled={colorOut}
                onClick={() => {
                  if (colorOut) return toast.error("This color is Out of Stock!");
                  if (!selectedSize) return toast.error("Please select a size");
                  if ((productData.availableColors?.length ?? 0) > 0 && !selectedColor) {
                    return toast.error("Please select a color");
                  }
                  addToCart(productData._id, selectedSize, selectedColor);
                  router.push("/cart");
                }}
                className={`w-full py-3.5 ${colorOut ? "bg-gray-300 cursor-not-allowed" : "bg-[#d6c4b6] text-gray-800 hover:bg-[#e2d3c7]"} transition`}
              >
                {colorOut ? "Out of Stock" : "Buy now"}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured <span className="text-[#d6c4b6]">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-[#d6c4b6] mt-2"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-lg w-full p-4 rounded-lg relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-3 right-3 text-gray-600"
            >
              Close
            </button>
            <div className="pt-6">
              <Image
                src={assets.size_guie_image}
                alt="Size Guide"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Color Guide Modal */}
      {showColorGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-md w-full p-4 rounded-lg relative">
            <button
              onClick={() => setShowColorGuide(false)}
              className="absolute top-3 right-3 text-gray-600"
            >
              Close
            </button>
            <div className="pt-6">
              <p className="text-lg font-medium">Color Guide</p>
              <p className="text-sm text-gray-600 mt-3">
                Colors may vary slightly based on your screen. For accuracy,
                refer to the color name or hex in product details.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 px-6 md:px-16 lg:px-32">
        <ProductReviews productId={id} />
      </div>
    </>
  );
};

export default Product;

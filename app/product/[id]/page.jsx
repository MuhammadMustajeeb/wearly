"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";

/**
 * Product page with color -> image switching (hardened).
 * - Normalizes imagesByColor keys (lowercase, hex without #).
 * - Picks initialColor from availableColors or imagesByColor keys.
 * - Deduplicates thumbnail lists.
 */
const colorMap = {
  black: "Black",
  white: "White",
  "#FF8559": "Pink",
  "#be000a": "Brown",
  "#ff0000": "Red",
  "#ffe497": "Beige",
  "#BEBEBE": "Gray",
  blue: "Blue",
};


const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, getAdjustedPrice } = useAppContext();

  // image + product data
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  // variant selection
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(null);

  // modal states
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showColorGuide, setShowColorGuide] = useState(false);

  // helpers
  const sanitizeColorForSearch = (c) => {
    if (!c) return "";
    return String(c).replace(/^#/, "").trim().toLowerCase();
  };

  const normalizeColorKey = (c) => {
    if (!c && c !== "") return "";
    return String(c).trim().toLowerCase().replace(/^#/, "");
  };

  const isValidCssColor = (c) => {
    if (!c) return false;
    try {
      const s = new Option().style;
      s.color = "";
      s.color = c;
      return !!s.color;
    } catch {
      return false;
    }
  };

  // Convert imagesByColor in product to a normalized map for reliable lookup.
  // Returns a new object mapping normalized keys -> array of urls.
  const buildNormalizedImagesByColor = (product) => {
    if (!product || !product.imagesByColor || typeof product.imagesByColor !== "object") return null;
    const normalized = {};
    for (const rawKey of Object.keys(product.imagesByColor)) {
      const key = normalizeColorKey(rawKey);
      if (!key) continue;
      const urls = Array.isArray(product.imagesByColor[rawKey])
        ? product.imagesByColor[rawKey].slice()
        : Array.isArray(product.imagesByColor[key])
        ? product.imagesByColor[key].slice()
        : [];
      if (urls.length) normalized[key] = urls;
    }
    return Object.keys(normalized).length ? normalized : null;
  };

  // Try to find images associated with a color. Returns array or null.
  const findImagesForColor = (product, color) => {
    if (!product || !color) return null;
    const normColor = normalizeColorKey(color);

    // 1) explicit mapping (normalized)
    const normalizedMap = buildNormalizedImagesByColor(product);
    if (normalizedMap) {
      if (normalizedMap[normColor]) return normalizedMap[normColor];
    }

    // 2) heuristic: check product.image URLs for token
    const urlList = Array.isArray(product.image) ? product.image : [];
    if (!urlList.length) return null;

    const searchToken = sanitizeColorForSearch(color);
    if (!searchToken) return null;

    // exact substring match
    const matches = urlList.filter((u) => {
      try {
        return u.toLowerCase().includes(searchToken);
      } catch {
        return false;
      }
    });
    if (matches.length) return matches;

    // 3) hex fragment match (if color was provided as hex)
    const hexCandidate = normalizeColorKey(color);
    if (hexCandidate && hexCandidate.length >= 3) {
      const hexMatches = urlList.filter((u) => {
        try {
          return u.toLowerCase().includes(hexCandidate);
        } catch {
          return false;
        }
      });
      if (hexMatches.length) return hexMatches;
    }

    return null;
  };

  // dedupe URL array preserving order
  const dedupe = (arr = []) => Array.from(new Set(arr.filter(Boolean)));

  // set product data and initial variants
  const fetchProductData = async () => {
    const product = products.find((p) => p._id === id);
    setProductData(product);

    if (!product) {
      console.warn("Product not found for id:", id);
      return;
    }

    // pick initial size
    const initialSize = product?.availableSizes?.[0] ?? "M";
    setSelectedSize(initialSize);

    // pick initial color: prefer availableColors[0], else imagesByColor key, else null
    let initialColor = null;
    if (Array.isArray(product.availableColors) && product.availableColors.length) {
      initialColor = product.availableColors[0];
    } else {
      const normalizedMap = buildNormalizedImagesByColor(product);
      if (normalizedMap) {
        const firstKey = Object.keys(normalizedMap)[0];
        initialColor = firstKey || null;
      }
    }

    setSelectedColor(initialColor);

    // initial main image preference
    const colorImages = findImagesForColor(product, initialColor);
    if (colorImages && colorImages.length) {
      setMainImage(colorImages[0]);
      return;
    }

    if (product?.image?.[0]) {
      setMainImage(product.image[0]);
      return;
    }

    setMainImage(assets.box_icon);
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, products.length]);

  // when selectedColor changes, update main image to color-specific image (if found)
  useEffect(() => {
    if (!productData) return;

    const colorImages = findImagesForColor(productData, selectedColor);
    if (colorImages && colorImages.length) {
      // avoid unnecessary state update if same URL (compare strings)
      if (!mainImage || String(mainImage) !== String(colorImages[0])) {
        setMainImage(colorImages[0]);
      }
      return;
    }

    // fallback: first generic image
    if (productData?.image?.[0]) {
      if (!mainImage || String(mainImage) !== String(productData.image[0])) {
        setMainImage(productData.image[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, productData]);

  if (!productData) return <Loading />;

  // thumbnails for current color or fallback, deduped
  const thumbnailsForCurrentColor = () => {
    const colorImages = findImagesForColor(productData, selectedColor) || [];
    const fallback = productData.image || [];
    return dedupe(colorImages.length ? colorImages : fallback);
  };

  // compute display prices (changes if category === 'graphic' and size is large)
const adjustedPrice = getAdjustedPrice(productData, selectedSize);
const adjustedBasePrice = getAdjustedPrice(
  { ...productData, offerPrice: productData.price }, // base price variant
  selectedSize
);


  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || productData.image[0] || assets.box_icon}
                alt={productData.name || "product image"}
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {thumbnailsForCurrentColor().map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
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

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                <Image className="h-4 w-4" src={assets.star_dull_icon} alt="star_dull_icon" />
              </div>
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
                  {/* <tr>
                    <td className="text-gray-600 font-medium">Brand</td>
                    <td className="text-gray-800/50 ">Generic</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 font-medium">Color</td>
                    <td className="text-gray-800/50 ">
                      {productData.availableColors && productData.availableColors.length
                        ? productData.availableColors.join(", ")
                        : "Multi"}
                    </td>
                  </tr> */}
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
                      selectedSize === size ? "bg-gray-800 text-white" : "bg-white text-gray-700"
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
                {(productData.availableColors || ["#000000", "#ffffff"]).map((color) => {
                  const valid = isValidCssColor(color);
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                        selectedColor === color ? "ring-2 ring-offset-2" : ""
                      }`}
                      title={color}
                      aria-label={`Select color ${color}`}
                      style={valid ? { background: color } : { background: "#ffffff" }}
                    >
                      {!valid && <span className="text-xs text-gray-700">{String(color).charAt(0).toUpperCase()}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-sm text-gray-600">
  Selected:{" "}
  <span className="font-medium">
    {selectedColor
      ? colorMap[selectedColor] || selectedColor
      : "—"}
  </span>
</div>

            </div>

            {/* Add to cart / Buy buttons */}
            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => {
                  if (!selectedSize) return toast.error("Please select a size");
                  if (!selectedColor) return toast.error("Please select a color");
                  addToCart(productData._id, selectedSize, selectedColor);
                }}
                className="w-full py-3.5 bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  if (!selectedSize) return toast.error("Please select a size");
                  if (!selectedColor) return toast.error("Please select a color");
                  addToCart(productData._id, selectedSize, selectedColor);
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-[#d6c4b6] text-gray-800 hover:bg-[#e2d3c7] transition"
              >
                Buy now
              </button>
            </div>
            {/* ====== end color selector ====== */}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured <span className="font-medium text-[#d6c4b6]">Products</span>
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
              <Image src={assets.size_guide_image} alt="Size Guide" width={800} height={400} className="w-full h-auto" />
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
                Colors display depending on your screen. If a swatch looks off, check the color name or hex in product settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;

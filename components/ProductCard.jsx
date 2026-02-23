'use client';
import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { BagIcon } from "@/assets/assets";

const ProductCard = ({ product, showAddToCart = true }) => {
  const { currency, router, addToCart, setIsCartOpen } = useAppContext();
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || null);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    const hasColors = product.availableColors?.length > 0;

    // If product has colors but no color selected → go to product page
    if (hasColors && !selectedColor) {
      router.push("/product/" + product._id);
      return;
    }

    // Add to cart
    addToCart(product._id, selectedSize, hasColors ? selectedColor : null, hasColors);

    // Open cart panel
    setIsCartOpen(true);
  };

  return (
    <div
      onClick={() => router.push("/product/" + product._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer flex flex-col mt-6"
    >
      {/* Product Image */}
      <div className="relative w-full h-[550px] bg-gray-100 overflow-hidden">
        <Image
          src={product.image?.[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* Add to Cart Bar on Hover */}
        {showAddToCart && hovered && (
          <div className="absolute bottom-0 left-0 w-full bg-black/90 text-white px-4 py-3 flex items-center gap-3 justify-between transition-all">
            
            {/* Size Selector */}
            {product.availableSizes?.length > 0 && (
              <select
                value={selectedSize}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-white text-black px-2 py-1 rounded text-sm"
              >
                {product.availableSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            )}

            {/* Color Selector */}
            {product.availableColors?.length > 0 && (
              <select
                value={selectedColor || ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="bg-white text-black px-2 py-1 rounded text-sm"
              >
                {product.availableColors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition"
            >
              <BagIcon className="w-4 h-4" /> Add
            </button>
          </div>
        )}
      </div>

      {/* Name & Price */}
      <div className="mt-4 flex flex-col gap-0.5">
        <p className="text-base font-medium text-gray-800 truncate">{product.name}</p>
        <p className="text-lg font-semibold text-gray-900">{currency}{product.offerPrice}</p>
      </div>
    </div>
  );
};

export default ProductCard;

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

    // Open cart panel with a small delay to ensure cart is updated first
    setTimeout(() => {
      setIsCartOpen(true);
    }, 100);
  };

  return (
    <div
      onClick={() => router.push("/product/" + product._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="aspect-square">
          <Image
            src={product.image?.[0]}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              hovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Quick Add Overlay - Appears on Hover */}
        {showAddToCart && (
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-white text-black px-6 py-3 flex items-center gap-3">
              {/* Quick Add Button */}
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase hover:text-red-500 transition-colors"
              >
                <BagIcon className="w-4 h-4" /> Quick Add
              </button>
            </div>
          </div>
        )}

        {/* Badge for New/Sale */}
        {product.offerPrice < product.price && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-xs font-bold tracking-widest uppercase">
            Sale
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-6 space-y-2">
        {/* Product Name */}
        <h3 className="text-lg font-bold text-black group-hover:text-red-500 transition-colors duration-300 leading-tight">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-black">
            {currency}{product.offerPrice}
          </span>
          {product.offerPrice < product.price && (
            <span className="text-sm text-gray-500 line-through">
              {currency}{product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

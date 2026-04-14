"use client";
import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const CartItemsDrawer = () => {
  const {
    products,
    cartItems,
    updateCartQuantity,
    getAdjustedPrice,
  } = useAppContext();

  return (
    <div className="space-y-6">
      {Object.keys(cartItems || {}).map((itemKey) => {
        const [productId, size, color] = itemKey.split(":");
        const product = products.find((p) => p._id === productId);
        const qty = (cartItems || {})[itemKey];

        if (!product || qty <= 0) return null;

        const itemPrice = getAdjustedPrice(product, size, color);
        const totalPrice = itemPrice * qty;

        return (
          <div key={itemKey} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
            
            {/* Product Image */}
            <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={product.image[0]}
                alt={product.name}
                width={80}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Top Section: Name, Remove Button */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-black leading-tight mb-1">
                    {product.name}
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Size: <span className="font-medium text-black">{size}</span></p>
                    {color && color !== "default" && (
                      <p>Color: <span className="font-medium text-black">{color}</span></p>
                    )}
                  </div>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => updateCartQuantity(itemKey, 0)}
                  className="ml-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Bottom Section: Quantity and Price */}
              <div className="flex justify-between items-end">
                
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateCartQuantity(itemKey, qty - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="w-12 text-center text-sm font-medium text-black">
                    {qty}
                  </span>
                  
                  <button
                    onClick={() => updateCartQuantity(itemKey, qty + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Item Total Price */}
                <div className="text-right">
                  <p className="text-sm text-gray-600 line-through">
                    ${product.price * qty}
                  </p>
                  <p className="text-lg font-bold text-black">
                    ${totalPrice}
                  </p>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemsDrawer;

"use client";

import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const OrderSummary = ({
  cartItems,
  products,
  subtotal,
  shippingFee,
  totalAmount,
}) => {
  const { getAdjustedPrice, currency } = useAppContext();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-black text-white px-6 py-4">
        <h3 className="text-lg font-bold tracking-widest uppercase">Order Summary</h3>
      </div>

      {/* Products */}
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {Object.keys(cartItems || {}).map((key) => {
          const [productId, size, color] = key.split(":");
          const qty = (cartItems || {})[key];
          const product = products.find((p) => p._id === productId);
          if (!product || qty <= 0) return null;

          const itemPrice = getAdjustedPrice(product, size, color);
          const totalPrice = itemPrice * qty;

          return (
            <div key={key} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
              {/* Product Thumbnail */}
              <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  width={64}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h4 className="text-sm font-bold text-black leading-tight mb-1">
                  {product.name}
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Size: <span className="font-medium text-black">{size}</span></p>
                  {color && color !== "default" && (
                    <p>Color: <span className="font-medium text-black">{color}</span></p>
                  )}
                  <p>Quantity: <span className="font-medium text-black">{qty}</span></p>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-sm text-gray-500 line-through">
                  {currency}{product.price * qty}
                </p>
                <p className="text-lg font-bold text-black">
                  {currency}{totalPrice}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-200 px-6 py-6 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Subtotal</span>
          <span className="text-sm font-bold text-black">Rs. {subtotal}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Shipping</span>
          <span className="text-sm font-bold text-black">Rs. {shippingFee}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4"></div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-black uppercase tracking-wide">Total</span>
          <span className="text-2xl font-black text-black">Rs. {totalAmount}</span>
        </div>

        {/* Tax Note */}
        <p className="text-xs text-gray-500 text-center pt-2">
          Including tax and shipping
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;

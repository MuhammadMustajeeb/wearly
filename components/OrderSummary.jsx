"use client";

import React from "react";

const OrderSummary = ({
  cartItems,
  products,
  currency,
  subtotal,
  shippingFee,
  totalAmount,
}) => {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">

  <div className="space-y-5">
    {Object.keys(cartItems).map((key) => {
      const [productId, size, color] = key.split(":");
      const qty = cartItems[key];
      const product = products.find((p) => p._id === productId);
      if (!product || qty <= 0) return null;

      return (
        <div key={key} className="flex items-center gap-4">
          <img
            src={product.image[0]}
            className="w-16 h-16 rounded-md object-cover"
          />

          <div className="flex-1 text-sm">
            <p className="font-medium">{product.name}</p>
            <p className="text-gray-500">{color} / {size}</p>
            <p className="text-gray-500">Qty {qty}</p>
          </div>

          <div className="font-medium">
            {currency}{product.price * qty}
          </div>
        </div>
      );
    })}
  </div>

  <div className="border-t pt-5 space-y-3 text-sm">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>{currency}{subtotal}</span>
    </div>

    <div className="flex justify-between">
      <span>Shipping</span>
      <span>{currency}{shippingFee}</span>
    </div>

    <div className="flex justify-between font-semibold text-lg pt-3">
      <span>Total</span>
      <span>{currency}{totalAmount}</span>
    </div>
  </div>
</div>

  );
};

export default OrderSummary;

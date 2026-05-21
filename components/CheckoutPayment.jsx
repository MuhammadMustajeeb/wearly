"use client";
import React from "react";

const CheckoutPayment = ({ paymentMethod, setPaymentMethod, onPlaceOrder, loading }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">
      <div>
        <h2 className="text-xl font-black text-black uppercase tracking-tight mb-6">Shipping Method</h2>

        <div className="space-y-4">
          <label className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-black transition-colors duration-300">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="shippingMethod"
                value="karachi"
                checked={paymentMethod === "karachi"}
                onChange={() => setPaymentMethod("karachi")}
                className="w-4 h-4 border-2 border-gray-300 text-black focus:ring-black"
              />
              <div>
                <p className="text-sm font-bold text-black">Standard Delivery — Karachi</p>
                <p className="text-xs text-gray-600">3-5 business days</p>
              </div>
            </div>
            <span className="text-sm font-bold text-black">Rs. 150</span>
          </label>

          <label className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-black transition-colors duration-300">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="shippingMethod"
                value="outside"
                checked={paymentMethod === "outside"}
                onChange={() => setPaymentMethod("outside")}
                className="w-4 h-4 border-2 border-gray-300 text-black focus:ring-black"
              />
              <div>
                <p className="text-sm font-bold text-black">Standard Delivery — Outside Karachi</p>
                <p className="text-xs text-gray-600">5-7 business days</p>
              </div>
            </div>
            <span className="text-sm font-bold text-black">Rs. 200</span>
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-black uppercase tracking-tight mb-6">Payment Method</h2>

        <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-bold text-black">Cash on Delivery (COD)</p>
          </div>
          <p className="text-xs text-gray-600">
            Pay when you receive your order. No additional charges.
          </p>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={loading}
        className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-red-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPayment;

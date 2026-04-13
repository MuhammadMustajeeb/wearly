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
                checked
                readOnly
                className="w-4 h-4 border-2 border-gray-300 text-black focus:ring-black"
              />
              <div>
                <p className="text-sm font-bold text-black">Standard Delivery + COD</p>
                <p className="text-xs text-gray-600">5-7 business days</p>
              </div>
            </div>
            <span className="text-sm font-bold text-black">$50</span>
          </label>

          <label className="flex justify-between items-center border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-black transition-colors duration-300">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                className="w-4 h-4 border-2 border-gray-300 text-black focus:ring-black"
              />
              <div>
                <p className="text-sm font-bold text-black">Free Delivery | Online Payment</p>
                <p className="text-xs text-gray-600">5-7 business days</p>
              </div>
            </div>
            <span className="text-sm font-bold text-black">FREE</span>
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
            Cash handling charges $50 applies on all COD orders. Pay when you receive your order.
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

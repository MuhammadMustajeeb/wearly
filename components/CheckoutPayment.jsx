"use client";
import React from "react";

const CheckoutPayment = ({ paymentMethod, setPaymentMethod, onPlaceOrder, loading }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
  <h2 className="text-xl font-semibold">Shipping method</h2>

  <div className="space-y-3">
    <label className="flex justify-between items-center border rounded-lg p-4 cursor-pointer hover:border-black">
      <div className="flex items-center gap-3">
        <input
          type="radio"
          checked
          readOnly
          className="accent-black"
        />
        <div>
          <p className="font-medium">Delivery + COD Fee</p>
          <p className="text-sm text-gray-500">5–7 business days</p>
        </div>
      </div>
      <span className="font-medium">Rs 50</span>
    </label>

    <label className="flex justify-between items-center border rounded-lg p-4 cursor-pointer hover:border-black">
      <div className="flex items-center gap-3">
        <input
          type="radio"
          className="accent-black"
        />
        <div>
          <p className="font-medium">Free Delivery | Online Payment</p>
          <p className="text-sm text-gray-500">5–7 business days</p>
        </div>
      </div>
      <span className="font-medium">FREE</span>
    </label>
  </div>

  <h2 className="text-xl font-semibold pt-6">Payment</h2>

  <div className="border rounded-lg p-4 bg-gray-50">
    <p className="font-medium">Cash on Delivery (COD)</p>
    <p className="text-sm text-gray-500">
      Cash handling charges Rs 50 applies on all COD orders
    </p>
  </div>

  <button
    onClick={onPlaceOrder}
    disabled={loading}
    className="w-full py-4 bg-[#16253d] text-white rounded-lg text-lg font-semibold hover:opacity-95 transition disabled:opacity-50"
  >
    {loading ? "Processing..." : "Complete order"}
  </button>
</div>

  );
};

export default CheckoutPayment;

"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

import CheckoutContact from "@/components/CheckoutContact";
import CheckoutAddress from "@/components/CheckoutAddress";
import CheckoutPayment from "@/components/CheckoutPayment";
import OrderSummary from "@/components/OrderSummary";

const Checkout = () => {
  const {
    user, 
    products,
    currency,
    router,
    getToken,
    cartItems,
    setCartItems,
    getAdjustedPrice,
  } = useAppContext();

  const [email, setEmail] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const getCartAmount = () => {
    let total = 0;
    Object.keys(cartItems || {}).forEach((key) => {
      const [productId, size, color] = key.split(":");
      const qty = (cartItems || {})[key];
      const product = products.find((p) => p._id === productId);
      if (!product || qty <= 0) return;
      total += getAdjustedPrice(product, size, color) * qty;
    });
    return total;
  };

  const shippingFee = 100;
  const subtotal = getCartAmount();
  const totalAmount = subtotal + shippingFee;

  const createOrder = async () => {
    try {
       if (!user?.email && !email) {
  return toast.error("Please provide your email or sign in to place the order");
}

      if (!selectedAddress) return toast.error("Please select shipping address");
      if (Object.keys(cartItems || {}).length === 0) return toast.error("Cart is empty");

      setLoading(true);

      const items = Object.keys(cartItems || {})
        .map((key) => {
          const [productId, size, color] = key.split(":");
          const qty = (cartItems || {})[key];
          const product = products.find((p) => p._id === productId);
          if (!product || qty <= 0) return null;

          return {
            product: productId,
            quantity: qty,
            size,
            color,
            price: getAdjustedPrice(product, size, color),
          };
        })
        .filter(Boolean);

      const token = await getToken();

      const { data } = await axios.post(
        "/api/order/create",
        {
          address: selectedAddress._id,
          items,
          paymentMethod,
          shippingFee,
          amount: totalAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Order placed successfully!");
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(data.message);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="site-container py-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="ml-3 text-sm font-medium text-black">Information</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="ml-3 text-sm font-medium text-gray-500">Shipping</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="ml-3 text-sm font-medium text-gray-500">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="bg-black text-white py-2">
        <div className="site-container">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Secure Checkout</span>
            <span className="text-gray-400">|</span>
            <span>SSL Encrypted</span>
            <span className="text-gray-400">|</span>
            <span>Safe Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="site-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT SIDE - Form Fields */}
          <div className="space-y-8">
            <CheckoutContact email={email} setEmail={setEmail} />

            <CheckoutAddress
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />

            <CheckoutPayment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onPlaceOrder={createOrder}
              loading={loading}
            />
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            <OrderSummary
              cartItems={cartItems}
              products={products}
              currency={currency}
              subtotal={subtotal}
              shippingFee={shippingFee}
              totalAmount={totalAmount}
            />
            
            {/* Place Order Button */}
            <button
              onClick={createOrder}
              disabled={loading}
              className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-red-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Checkout;

"use client";
import React, { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import CartItemsDrawer from "./CartItemsDrawer";
import { useRouter } from "next/navigation";

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, getCartAmount, currency } = useAppContext();
  const router = useRouter();

  // Disable background scroll when drawer open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-black text-white px-6 py-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-widest uppercase">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {Object.keys(cartItems || {}).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                {/* Empty Cart Icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Add items to get started</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/all-products");
                  }}
                  className="px-8 py-3 bg-black text-white font-bold tracking-widest uppercase hover:bg-red-500 transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <CartItemsDrawer />
            )}
          </div>

          {/* Footer - Only show when cart has items */}
          {Object.keys(cartItems || {}).length > 0 && (
            <div className="border-t border-gray-200 px-6 py-6 bg-white">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-black uppercase tracking-wide">Subtotal</span>
                <span className="text-2xl font-black text-black">{currency}{getCartAmount()}</span>
              </div>

              {/* Tax Note */}
              <p className="text-sm text-gray-600 mb-6">Tax calculated at checkout</p>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="w-full bg-black text-white py-4 font-bold tracking-widest uppercase hover:bg-red-500 transition-all duration-300 transform hover:scale-105"
              >
                Checkout
              </button>

              {/* Continue Shopping Link */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/all-products");
                }}
                className="w-full py-3 text-center text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300 mt-3"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;

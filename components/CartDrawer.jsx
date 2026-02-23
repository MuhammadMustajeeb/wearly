"use client";
import React, { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import OrderSummary from "./OrderSummary";
import CartItemsDrawer from "./CartItemsDrawer";
import { useRouter } from "next/navigation";

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, getCartAmount } = useAppContext();
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
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white z-50 shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-medium">ADDED TO YOUR BASKET</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-lg"
            >
              ✕
            </button>
          </div>

          {Object.keys(cartItems).length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
  <>
  <CartItemsDrawer />

  {/* Summary Section */}
  <div className="border-t mt-6 pt-6 space-y-4">

    <div className="flex justify-between text-sm">
      <p className="text-gray-600">Tax:</p>
      <p className="text-gray-500">Calculated At Checkout Page</p>
    </div>

    <div className="flex justify-between font-semibold text-base">
      <p>Order Total:</p>
      <p>Rs {getCartAmount()}</p>
    </div>

    {/* Checkout Button */}
    <button
      onClick={() => {
        setIsCartOpen(false);
        router.push("/checkout");
      }}
      className="w-full bg-[#14263F] text-white py-4 mt-4 font-medium"
    >
      CHECKOUT
    </button>

    {/* Trust Banner */}
<div className="bg-lime-400 text-center text-sm p-4 rounded mt-3">
  <p className="font-semibold">
    🔒 100% Quality Guarantee
  </p>
  <p className="text-xs mt-1">
    Loved by 5,000+ customers. Not satisfied? Easy exchanges within 30 days.
  </p>
</div>


  </div>
</>

)}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;

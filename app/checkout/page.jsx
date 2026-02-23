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
    Object.keys(cartItems).forEach((key) => {
      const [productId, size, color] = key.split(":");
      const qty = cartItems[key];
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
      if (Object.keys(cartItems).length === 0) return toast.error("Cart is empty");

      setLoading(true);

      const items = Object.keys(cartItems)
        .map((key) => {
          const [productId, size, color] = key.split(":");
          const qty = cartItems[key];
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
  <div className="min-h-screen bg-[#f6f7f9] py-12 px-6 lg:px-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">

      {/* LEFT SIDE */}
      <div className="space-y-12">
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

      {/* RIGHT SIDE */}
      <div className="lg:sticky lg:top-16 h-fit">
        <OrderSummary
          cartItems={cartItems}
          products={products}
          currency={currency}
          subtotal={subtotal}
          shippingFee={shippingFee}
          totalAmount={totalAmount}
        />
      </div>

    </div>
  </div>
);

};

export default Checkout;

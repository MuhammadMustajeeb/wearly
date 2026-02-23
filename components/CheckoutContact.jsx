"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import toast from "react-hot-toast";

const CheckoutContact = ({ email, setEmail }) => {
  const { user } = useAppContext();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [localEmail, setLocalEmail] = useState(email || "");

  const handleEmailChange = (e) => {
    setLocalEmail(e.target.value);
    setEmail?.(e.target.value); // update parent state if provided
  };

  const handleSignIn = () => {
    openSignIn(); // opens Clerk sign in modal
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 relative">
  <h2 className="text-xl font-semibold">Contact</h2>

  {!user && (
    <button
      onClick={handleSignIn}
      className="absolute top-6 right-6 text-sm text-blue-600 hover:underline"
    >
      Log in
    </button>
  )}

  <input
    type="email"
    placeholder="Email address"
    value={user?.email || localEmail}
    onChange={handleEmailChange}
    readOnly={!!user?.email}
    className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-black outline-none ${
      user?.email ? "bg-gray-100" : ""
    }`}
  />

  <label className="flex items-center gap-2 text-sm text-gray-600">
    <input type="checkbox" className="accent-black" />
    Email me with news and offers
  </label>
</div>

  );
};

export default CheckoutContact;

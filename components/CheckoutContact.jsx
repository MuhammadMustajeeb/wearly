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
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-black uppercase tracking-tight">Contact Information</h2>
        {!user && (
          <button
            onClick={handleSignIn}
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-bold text-black uppercase tracking-wide">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={user?.email || localEmail}
            onChange={handleEmailChange}
            readOnly={!!user?.email}
            className={`w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-colors duration-300 placeholder-gray-400 ${
              user?.email ? "text-gray-500 cursor-not-allowed" : "text-black"
            }`}
          />
        </div>
        {!user?.email && (
          <p className="text-xs text-gray-500">We'll use this to send you order updates</p>
        )}
      </div>

      {/* Marketing Checkbox */}
      <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer hover:text-black transition-colors">
        <input 
          type="checkbox" 
          className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black transition-colors"
        />
        <span>Email me with news and offers</span>
      </label>
    </div>
  );
};

export default CheckoutContact;

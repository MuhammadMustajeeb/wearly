"use client";
import { useEffect, useState } from "react";

const ExitIntentOffer = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY < 0) setShow(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={() => setShow(false)} // click outside to close
    >
      <div
        className="bg-white rounded-2xl p-6 text-center max-w-sm mx-auto shadow-lg relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // prevent click inside from closing
      >
        {/* ❌ Close Button */}
        <button
          onClick={() => setShow(false)}
          aria-label="Close offer popup"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold">Wait — before you go!</h2>
        <p className="text-sm text-gray-500 mt-2">
          Grab our{" "}
          <span className="font-bold text-[#d6c4b6]">🔥 Combo Offers</span> and
          save big on your favorite tees.
        </p>

        <a
          href="/offers"
          className="mt-4 inline-block bg-[#d6c4b6] text-white px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition"
        >
          View Offers
        </a>
      </div>
    </div>
  );
};

export default ExitIntentOffer;

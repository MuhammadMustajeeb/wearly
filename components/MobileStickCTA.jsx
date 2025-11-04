"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MobileStickyCTA = () => {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show only on mobile and not on offers page
    const handleResize = () => {
      setVisible(window.innerWidth < 768 && pathname !== "/category/offers");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => (window.location.href = "/category/offers")}
        className="flex items-center gap-2 px-6 py-3 bg-[#d6c4b6] text-white font-medium rounded-full shadow-md hover:scale-105 transition-transform"
      >
        🔥 Grab the Offer
      </button>
    </div>
  );
};

export default MobileStickyCTA;

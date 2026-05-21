"use client";

import React, { useState, useEffect } from "react";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused && isVisible) {
      const scrollContainer = document.getElementById('announcement-scroll');
      if (scrollContainer) {
        const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        const startScroll = () => {
          scrollContainer.scrollLeft += 1;
          if (scrollContainer.scrollLeft >= scrollWidth) {
            scrollContainer.scrollLeft = 0;
          }
        };

        const interval = setInterval(startScroll, 50);
        return () => clearInterval(interval);
      }
    }
  }, [isPaused, isVisible]);

  const text = "🔥 Big Launch Coming Soon | Cash on Delivery Available | Karachi & All Over Pakistan 🇵🇰";

  if (!isVisible) return null;

  return (
    <div className="bg-red-600 text-white text-sm py-2 relative overflow-hidden z-50">
      {/* Scrolling text container */}
      <div className="relative h-full flex items-center">
        <div 
          id="announcement-scroll"
          className="whitespace-nowrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <span className="inline-block px-4">
            {text}
          </span>
          {/* Duplicate text for seamless scrolling */}
          <span className="inline-block px-4">
            {text}
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors duration-200 z-10"
        aria-label="Close announcement"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default AnnouncementBar;

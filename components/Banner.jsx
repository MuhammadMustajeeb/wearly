import React from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

const Banner = () => {
  return (
    <section className="relative h-[90vh] lg:h-screen overflow-hidden bg-black">
      
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0">
        <Image
          src={assets.basic_shirts}
          alt="Season Collection"
          fill
          className="object-cover animate-heroZoom"
          priority
        />
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="site-container">
          <div className="max-w-2xl">
            {/* Season Badge */}
            <div className="mb-6">
              <span className="inline-block bg-red-500 text-white text-xs font-black tracking-widest uppercase px-6 py-3">
                New Season 2024
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="heading-xl text-white mb-8 leading-none">
              Refresh Your 
              <span className="block text-red-500">Style</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-12 max-w-lg leading-relaxed font-light">
              Premium cotton meets modern design. Crafted for those who demand excellence in every thread.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/offers"
                className="hero-primary-btn"
              >
                Shop Collection
              </Link>
              <Link
                href="/all-products"
                className="hero-secondary-btn text-white"
              >
                View All
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
              <div>
                <div className="text-3xl font-black text-white mb-2">100%</div>
                <div className="text-sm text-gray-400 tracking-widest uppercase">Premium Cotton</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">30+</div>
                <div className="text-sm text-gray-400 tracking-widest uppercase">New Styles</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-2">24/7</div>
                <div className="text-sm text-gray-400 tracking-widest uppercase">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 border-4 border-red-500/20 hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-20 h-20 border-4 border-white/10 hidden lg:block" />
      
    </section>
  );
};

export default Banner;

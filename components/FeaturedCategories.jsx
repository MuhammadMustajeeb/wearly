"use client";

import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import SectionHeading from "./ui/SectionHeading";

const categories = [
  {
    title: "Plain Tees",
    subtitle: "Minimal. Clean. Everyday.",
    image: assets.post_banner_one,
    href: "/category/plain",
    badge: "ESSENTIALS"
  },
  {
    title: "Graphic Tees",
    subtitle: "Bold statements. Street culture.",
    image: assets.post_banner_two,
    href: "/category/graphic",
    badge: "TRENDING"
  },
  {
    title: "Polo Shirts",
    subtitle: "Refined comfort.",
    image: assets.post_banner_three,
    href: "/category/polo",
    badge: "CLASSIC"
  },
];

const FeaturedCategories = () => {
  return (
    <section className="section-padding bg-black text-white">
      <div className="site-container">
        <div className="text-center mb-16">
          <span className="subtitle-label text-red-500">Categories</span>
          <h2 className="heading-xl text-white mb-6">Shop By Style</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our curated collections designed for every occasion and aesthetic
          </p>
        </div>
      </div>

      {/* EDGE TO EDGE CATEGORY STRIP */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group relative h-[70vh] lg:h-[85vh] overflow-hidden block"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-all duration-1000 ease-in-out group-hover:scale-110"
                  priority
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 group-hover:to-black/90 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
                {/* Top Badge */}
                <div className="flex justify-start">
                  <span className="bg-red-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-2">
                    {cat.badge}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="space-y-4">
                  <div>
                    <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-2">
                      Collection
                    </p>
                    <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                      {cat.title}
                    </h3>
                    <p className="text-white/80 text-lg lg:text-xl mt-3 max-w-sm">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Shop Now Button */}
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold text-sm tracking-widest uppercase border-b-2 border-red-500 pb-1 transition-all duration-300 group-hover:border-white group-hover:translate-x-1">
                      Shop Now
                    </span>
                    <svg 
                      className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="site-container mt-16">
        <div className="text-center">
          <Link 
            href="/all-products"
            className="btn-primary inline-block"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

const Banner = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      
      {/* Background Image */}
      <Image
        src={assets.basic_shirts}
        alt="Season Collection"
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="site-container text-white">
          
          <p className="uppercase tracking-widest text-sm opacity-80">
            New Season
          </p>

          <h2 className="text-4xl md:text-6xl font-semibold mt-4 max-w-xl leading-tight">
            Refresh Your Style This Season
          </h2>

          <p className="mt-4 max-w-md text-white/80">
            Premium cotton. Modern cuts. Designed for everyday confidence.
          </p>

          <Link
            href="/offers"
            className="inline-block mt-8 text-sm tracking-widest border-b border-white pb-1 hover:opacity-70 transition"
          >
            Shop Now
          </Link>

        </div>
      </div>
    </section>
  );
};

export default Banner;

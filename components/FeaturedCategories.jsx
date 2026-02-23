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
  },
  {
    title: "Graphic Tees",
    subtitle: "Bold statements. Street culture.",
    image: assets.post_banner_two,
    href: "/category/graphic",
  },
  {
    title: "Polo Shirts",
    subtitle: "Refined comfort.",
    image: assets.post_banner_three,
    href: "/category/polo",
  },
];

const FeaturedCategories = () => {
  return (
    <>
    {/* HEADING (CONTAINER WIDTH) */}
<div className="site-container">
  <SectionHeading
    title="Explore the Collection"
    subtitle="Premium T-Shirts & Polos"
    actionText="View All"
    onAction={() => router.push("/all-products")}
  />
</div>
    <section className="py-24">


      {/* ===== EDGE TO EDGE CATEGORY STRIP ===== */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[6px]">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group relative h-[85vh] overflow-hidden"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

              {/* Text */}
              <div className="absolute bottom-10 left-8 text-white">
                <p className="uppercase tracking-widest text-xs opacity-80">
                  Category
                </p>
                <h3 className="text-3xl font-semibold mt-2">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm opacity-90">
                  {cat.subtitle}
                </p>

                <span className="inline-block mt-6 text-sm tracking-wide border-b border-white pb-1">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
    </>
  );
};

export default FeaturedCategories;

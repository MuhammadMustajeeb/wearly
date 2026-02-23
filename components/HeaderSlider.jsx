'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/assets/assets";

const categorySlides = [
  { slug: "plain", image: assets.hero_polo },
  { slug: "bold", image: assets.post_two },
  { slug: "graphic", image: assets.hero_graphic },
  { slug: "polos", image: assets.post_one },
  { slug: "hoodies", image: assets.post_two },
  { slug: "customization", image: assets.post_three },
];

export default function HeaderSlider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const totalSlides = categorySlides.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    );
  }, [totalSlides]);

  // Mouse wheel
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nextSlide, prevSlide]);

  // Keyboard arrows
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowUp") prevSlide();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Slides Wrapper */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {categorySlides.map((slide, index) => (
          <div
            key={index}
            className="relative h-screen w-full cursor-pointer"
            onClick={() => router.push(`/category/${slide.slug}`)}
          >
            <Image
              src={slide.image}
              alt={slide.slug}
              fill
              priority
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
        {categorySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-white scale-125"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>

    </section>
  );
}

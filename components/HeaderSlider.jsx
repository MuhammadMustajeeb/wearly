'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/assets/assets";

const categorySlides = [
  { 
    slug: "polos", 
    image: assets.hero_plain,
    title: "ESSENTIALS",
    subtitle: "Premium basics redefined",
    cta: "Shop Now"
  },
  // { slug: "bold", image: assets.post_two, title: "BOLD", subtitle: "Make a statement", cta: "Explore" },
  // { slug: "graphic", image: assets.hero_graphic, title: "GRAPHIC", subtitle: "Art meets fashion", cta: "Discover" },
  // { slug: "polos", image: assets.hero_polo, title: "POLOS", subtitle: "Classic meets modern", cta: "Shop" },
  // { slug: "hoodies", image: assets.post_two, title: "HOODIES", subtitle: "Comfort elevated", cta: "View" },
  // { slug: "customization", image: assets.hero_customization, title: "CUSTOM", subtitle: "Your style, your way", cta: "Create" },
];

export default function HeaderSlider() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
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

  // Auto-play
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* Slides Wrapper */}
      <div
        className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {categorySlides.map((slide, index) => (
          <div
            key={index}
            className="relative h-screen w-full cursor-pointer group"
            onClick={() => router.push(`/category/${slide.slug}`)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.slug}
                fill
                priority
                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105 animate-heroZoom"
              />
            </div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-6 max-w-4xl mx-auto">
                <div className="space-y-8">
                  {/* Category Label */}
                  <div className={`hero-subtitle ${index === current ? 'animate-fadeUp' : 'opacity-0'}`}>
                    <span className="text-red-500 font-bold tracking-[0.3em] text-sm uppercase">
                      New Collection
                    </span>
                  </div>
                  
                  {/* Main Title */}
                  <h1 className={`hero-title ${index === current ? 'animate-fadeUp' : 'opacity-0'}`}>
                    {slide.title}
                  </h1>
                  
                  {/* Subtitle */}
                  <p className={`hero-subtitle ${index === current ? 'animate-fadeUp' : 'opacity-0'}`}>
                    {slide.subtitle}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${index === current ? 'animate-fadeUp' : 'opacity-0'}`}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/category/${slide.slug}`);
                      }}
                      className="hero-primary-btn"
                    >
                      {slide.cta}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle secondary action
                      }}
                      className="hero-secondary-btn"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
        {categorySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`group relative transition-all duration-500 ${
              current === index ? "scale-150" : "scale-100"
            }`}
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
              current === index
                ? "bg-red-500 shadow-lg shadow-red-500/50"
                : "bg-white/50 hover:bg-white/80"
            }`} />
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-0.5 bg-white/30 -translate-x-full transition-all duration-500 ${
              current === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
            }`} />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center text-white/60 animate-bounce">
          <span className="text-xs font-bold tracking-widest uppercase mb-2">Scroll</span>
          <div className="w-0.5 h-8 bg-white/30" />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-colors duration-300 group"
      >
        <div className="flex flex-col items-center">
          <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-colors duration-300 group"
      >
        <div className="flex flex-col items-center">
          <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

    </section>
  );
}

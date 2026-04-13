import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import { useRef } from "react";
import SectionHeading from "./ui/SectionHeading";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const sliderRef = useRef(null);

  // Pick only 6 products for homepage
  const p = products.slice(0, 6);

  return (
    <>
      {/* HERO EDITORIAL SECTION */}
      <section className="section-padding bg-black text-white">
        <div className="site-container">
          <div className="text-center mb-16">
            <span className="subtitle-label text-red-500">Featured</span>
            <h2 className="heading-xl text-white mb-6">Essentials</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Discover our curated collection of premium basics designed for the modern lifestyle
            </p>
          </div>
        </div>
        
        {/* FULL WIDTH EDITORIAL GRID */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {p[0] && (
              <div className="group cursor-pointer" onClick={() => router.push(`/product/${p[0]._id}`)}>
                <ProductCard product={p[0]} variant="editorial" />
              </div>
            )}
            {p[1] && (
              <div className="group cursor-pointer" onClick={() => router.push(`/product/${p[1]._id}`)}>
                <ProductCard product={p[1]} variant="editorial" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COLLECTION SHOWCASE */}
      <section className="section-padding bg-white">
        <div className="site-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="subtitle-label">Shop</span>
              <h2 className="heading-lg text-black">The Collection</h2>
              <p className="text-gray-600 mt-4 max-w-xl">
                Premium quality meets contemporary design in our latest arrivals
              </p>
            </div>
            <button 
              onClick={() => router.push("/all-products")}
              className="link-action text-black"
            >
              View All Products
            </button>
          </div>

          {/* HORIZONTAL PRODUCT RAIL */}
          <div 
            ref={sliderRef}
            className="
              flex gap-6 lg:gap-8
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              scrollbar-hide
              -mx-6 px-6 lg:-mx-8 lg:px-8
            "
          >
            {products.slice(2, 7).map((product, index) => (
              <div
                key={product._id}
                className="
                  snap-start
                  min-w-[70vw]
                  sm:min-w-[45vw]
                  md:min-w-[35vw]
                  lg:min-w-[28vw]
                  xl:min-w-[22vw]
                "
              >
                <div className="card-hover cursor-pointer" onClick={() => router.push(`/product/${product._id}`)}>
                  <ProductCard product={product} variant="rail" />
                </div>
              </div>
            ))}
          </div>

          {/* NAVIGATION ARROWS FOR MOBILE */}
          <div className="flex justify-center mt-8 gap-4 md:hidden">
            <button
              onClick={() => {
                if (sliderRef.current) {
                  sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (sliderRef.current) {
                  sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeProducts;

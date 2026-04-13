'use client';

import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import WhatsappButton from "@/components/WhatsappButton";
import Footer from "@/components/Footer";

const Home = () => {
  const { products, router } = useAppContext();

  // Sample categories
  const categories = [
    {
      title: "Plain Tees",
      image: assets.post_banner_one,
      href: "/category/plain"
    },
    {
      title: "Graphic Tees", 
      image: assets.post_banner_two,
      href: "/category/graphic"
    },
    {
      title: "Polo Shirts",
      image: assets.post_banner_three,
      href: "/category/polo"
    },
    {
      title: "Hoodies",
      image: assets.basic_shirts,
      href: "/category/hoodies"
    }
  ];

  // Best sellers (first 8 products)
  const bestSellers = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Full Screen Banner */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={assets.hero_plain}
            alt="Hero Banner"
            fill
            className="object-cover scale-110"
            priority
          />
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 uppercase tracking-tight">
              Premium
              <span className="block text-red-500">Essentials</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              Discover our curated collection of premium fashion essentials designed for the modern lifestyle
            </p>
            <button 
              onClick={() => router.push('/all-products')}
              className="bg-white text-black px-12 py-5 text-sm font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Shop Collection
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-white/60 animate-bounce">
            <span className="text-xs font-bold tracking-widest uppercase mb-2">Scroll</span>
            <div className="w-0.5 h-8 bg-white/30" />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="relative">
        
        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-20 bg-white">
          <div className="site-container">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
                Shop By Category
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto mb-6" />
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore our carefully curated collections designed for every style and occasion
              </p>
            </div>
            
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => router.push(category.href)}
                  className="group relative overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Category Image */}
                  <div className="relative h-80">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  
                  {/* Category Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">
                      {category.title}
                    </h3>
                    <div className="flex items-center text-sm font-medium">
                      <span>Shop Now</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEST SELLERS SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="site-container">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
                Best Sellers
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto mb-6" />
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our most popular pieces loved by thousands of customers worldwide
              </p>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <div key={product._id} className="group">
                  {/* Product Card */}
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Product Image */}
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Quick Add Button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="bg-white text-black px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all duration-300">
                          Quick Add
                        </button>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-black mb-2 group-hover:text-red-500 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-black text-black">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-12">
              <button 
                onClick={() => router.push('/all-products')}
                className="bg-black text-white px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-red-500 transition-all duration-300"
              >
                View All Products
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 1 - SHOP BY CATEGORY */}
        <section className="py-20 bg-white">
          <div className="site-container">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
                SHOP BY CATEGORY
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto" />
            </div>
            
            {/* Categories Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Oversized",
                  image: assets.post_banner_one,
                  href: "/category/oversized"
                },
                {
                  title: "Graphic Tees", 
                  image: assets.post_banner_two,
                  href: "/category/graphic"
                },
                {
                  title: "Basics",
                  image: assets.basic_shirts,
                  href: "/category/plain"
                },
                {
                  title: "Limited Edition",
                  image: assets.post_banner_three,
                  href: "/category/limited"
                }
              ].map((category, index) => (
                <div
                  key={index}
                  onClick={() => router.push(category.href)}
                  className="group relative overflow-hidden rounded-lg cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  {/* Category Image */}
                  <div className="relative h-64 lg:h-80">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                  </div>
                  
                  {/* Category Name */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl lg:text-2xl font-bold text-white uppercase tracking-wide text-center px-4">
                      {category.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2 - NEW ARRIVAL DROP BANNER */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
          {/* Textured Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
            }}></div>
          </div>
          
          <div className="site-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left">
                <div className="inline-block">
                  <h2 className="text-5xl lg:text-7xl font-black leading-tight mb-4 uppercase tracking-tight">
                    NEW
                    <span className="block text-red-500">DROP</span>
                  </h2>
                  <div className="w-16 h-1 bg-red-500 mb-6" />
                </div>
                <p className="text-xl lg:text-2xl text-gray-300 mb-8 font-light max-w-lg mx-auto lg:mx-0">
                  Fresh styles. Limited stock. Be the first to own the latest collection.
                </p>
                <button 
                  onClick={() => router.push('/all-products')}
                  className="bg-red-500 text-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-red-600 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  SHOP NOW
                </button>
              </div>
              
              {/* Right Side - Product Visual */}
              <div className="relative">
                <div className="relative h-64 lg:h-96 rounded-lg overflow-hidden">
                  <Image
                    src={assets.hero_plain}
                    alt="New Arrival"
                    fill
                    className="object-cover transform scale-110"
                  />
                  {/* Energy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent" />
                </div>
                
                {/* Floating Elements for Energy */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-red-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/10 rounded-lg transform rotate-12"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - CUSTOMER REVIEWS STRIP */}
        <section className="py-20 bg-gray-50">
          <div className="site-container">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-black mb-4 uppercase tracking-tight">
                WHAT PEOPLE ARE SAYING
              </h2>
              <div className="w-24 h-1 bg-red-500 mx-auto" />
            </div>
            
            {/* Reviews Strip */}
            <div className="relative">
              {/* Gradient Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
              
              {/* Scrollable Reviews */}
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-6 pb-4">
                  {[
                    {
                      rating: 5,
                      review: "Absolutely love the quality! The fabric is premium and the fit is perfect. Best purchase I've made this year.",
                      name: "Sarah Johnson",
                      city: "New York"
                    },
                    {
                      rating: 5,
                      review: "Fast shipping and amazing customer service. The tees exceeded my expectations. Will definitely order again!",
                      name: "Mike Chen",
                      city: "Los Angeles"
                    },
                    {
                      rating: 4,
                      review: "Great designs and comfortable material. Slightly smaller than expected but still happy with the purchase.",
                      name: "Emma Williams",
                      city: "London"
                    },
                    {
                      rating: 5,
                      review: "The limited edition drop was worth every penny! So many compliments whenever I wear it.",
                      name: "Alex Rivera",
                      city: "Miami"
                    },
                    {
                      rating: 5,
                      review: "Finally found a brand that gets it right. Perfect balance of style and comfort.",
                      name: "David Kim",
                      city: "Toronto"
                    },
                    {
                      rating: 4,
                      review: "Love the minimalist approach. Clean designs that actually look good in person.",
                      name: "Lisa Thompson",
                      city: "Sydney"
                    }
                  ].map((review, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                    >
                      {/* Star Rating */}
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l2.8-2.034a1 1 0 00.364-1.118L9.049 2.927z"/>
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({review.rating}.0)</span>
                      </div>
                      
                      {/* Review Quote */}
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        "{review.review}"
                      </p>
                      
                      {/* Customer Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-black">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.city}</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* WHATSAPP WIDGET - Fixed Position */}
      <WhatsappButton
        phone="923701114204"
        defaultMessage="Hi! I'm interested in your premium collection."
      /> 

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;

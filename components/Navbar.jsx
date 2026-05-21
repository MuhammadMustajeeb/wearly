"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import { assets, CartIcon } from "@/assets/assets";
import axios from "axios";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { router, user, isSeller, setIsCartOpen, cartItems } = useAppContext();
  const { openSignIn, signOut } = useClerk();

  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountDropdown, setIsAccountDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountDropdown && !event.target.closest('.account-dropdown')) {
        setIsAccountDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isAccountDropdown]);

  // Search functionality
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          setIsSearching(true);
          const { data } = await axios.get(`/api/product/search?q=${searchQuery}`);
          if (data.success) {
            setSearchResults(data.products);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);


  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav 
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${
          isScrolled 
            ? "bg-[#0a0a0a] border-b border-white/20" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* LEFT: BRAND LOGO */}
            <div className="flex items-center">
              <div 
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                <h1 className={`text-2xl lg:text-3xl font-bold tracking-widest uppercase transition-colors duration-300 ${
                  isScrolled ? "text-white" : "text-black"
                }`}>
                  FLEXTERS
                </h1>
              </div>
            </div>

            {/* CENTER: DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { href: "/all-products", text: "Shop" },
                { href: "/category/plain", text: "Plain Tees" },
                { href: "/category/graphic", text: "Graphic Tees" },
                { href: "/category/polo", text: "Polo Shirts" },
                { href: "/category/hoodies", text: "Hoodies" }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`relative text-xs font-medium tracking-widest uppercase transition-colors duration-300 group ${
                    isScrolled ? "text-white" : "text-black"
                  }`}
                >
                  {item.text}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    isScrolled ? "bg-white" : "bg-black"
                  }`}></span>
                </a>
              ))}
            </div>

            {/* RIGHT: ICONS */}
            <div className="flex items-center space-x-4">

              {/* SEARCH ICON */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isScrolled 
                    ? "hover:bg-white/10 text-white" 
                    : "hover:bg-black/10 text-black"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* CART ICON WITH BADGE */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-colors duration-300 ${
                  isScrolled 
                    ? "hover:bg-white/10 text-white" 
                    : "hover:bg-black/10 text-black"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* USER ICON */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsAccountDropdown(!isAccountDropdown)}
                      className={`p-2 rounded-full transition-colors duration-300 ${
                        isScrolled 
                          ? "hover:bg-white/10 text-white" 
                          : "hover:bg-black/10 text-black"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    
                    {/* Custom Dropdown Menu */}
                    {isAccountDropdown && (
                      <div className="account-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-2">
                          <button
                            onClick={() => {
                              router.push('/my-orders');
                              setIsAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          >
                            My Orders
                          </button>
                          {isSeller && (
                            <button
                              onClick={() => {
                                router.push('/seller');
                                setIsAccountDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                            >
                              Seller
                            </button>
                          )}
                          <button
                            onClick={() => {
                              router.push('/account');
                              setIsAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          >
                            Manage Account
                          </button>
                          <button
                            onClick={() => {
                              signOut();
                              setIsAccountDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={openSignIn}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isScrolled 
                        ? "hover:bg-white/10 text-white" 
                        : "hover:bg-white/10 text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav 
        className={`lg:hidden fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${
          isScrolled 
            ? "bg-[#0a0a0a] border-b border-white/20" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* LEFT: BRAND LOGO */}
            <div className="flex items-center">
              <div 
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                <h1 className={`text-xl font-bold tracking-widest uppercase transition-colors duration-300 ${
                  isScrolled ? "text-white" : "text-white"
                }`}>
                  FLEXTERS
                </h1>
              </div>
            </div>

            {/* RIGHT: CART + HAMBURGER */}
            <div className="flex items-center space-x-4">

              {/* CART ICON WITH BADGE */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-colors duration-300 ${
                  isScrolled 
                    ? "hover:bg-white/10 text-white" 
                    : "hover:bg-black/10 text-black"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItems && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* HAMBURGER MENU */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isScrolled 
                    ? "hover:bg-white/10 text-white" 
                    : "hover:bg-black/10 text-black"
                }`}
              >
                <div className="w-6 h-5 flex flex-col justify-center gap-1">
                  <div className={`h-0.5 w-full transition-all duration-300 ${
                    isScrolled ? "bg-white" : "bg-black"
                  }`}></div>
                  <div className={`h-0.5 w-full transition-all duration-300 ${
                    isScrolled ? "bg-white" : "bg-black"
                  }`}></div>
                  <div className={`h-0.5 w-full transition-all duration-300 ${
                    isScrolled ? "bg-white" : "bg-black"
                  }`}></div>
                </div>
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* FULL SCREEN MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[70]">
          {/* Black Background */}
          <div className="fixed inset-0 bg-black transition-opacity duration-300">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Menu Content */}
            <div className="h-full flex flex-col justify-center items-center px-8">
              {/* Navigation Links */}
              <div className="space-y-8 text-center">
                {[
                  { href: "/all-products", text: "Shop", delay: "delay-75" },
                  { href: "/category/plain", text: "Plain Tees", delay: "delay-100" },
                  { href: "/category/graphic", text: "Graphic Tees", delay: "delay-150" },
                  { href: "/category/polo", text: "Polo Shirts", delay: "delay-200" },
                  { href: "/category/hoodies", text: "Hoodies", delay: "delay-300" }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-4xl md:text-5xl font-black text-white uppercase tracking-tight hover:text-red-500 transition-all duration-300 transform hover:scale-110 ${item.delay}`}
                  >
                    {item.text}
                  </a>
                ))}
              </div>

              {/* Social Icons */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
                <a href="#" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.451 7.778c0-1.666-1.35-3.016-3.016-3.016S6.432 8.112 6.432 9.778s1.35 3.016 3.016 3.016 3.016-1.35 3.016-3.016zm-1.008-3.016a1.008 1.008 0 110 2.016 1.008 1.008 0 010-2.016z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <>
          {/* Blur Background */}
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/20 z-[65]"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          />

          {/* Expanded Search */}
          <div className="fixed top-0 left-0 w-full z-[70] flex justify-center pt-6 px-4">
            <div className="w-full max-w-2xl relative">
              {/* Search Input */}
              <div className="bg-white rounded-full shadow-xl flex items-center px-6 py-3">
                <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 ml-4 outline-none text-sm"
                />

                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-black text-lg ml-4"
                >
                  ✕
                </button>
              </div>

              {/* LIVE DROPDOWN */}
              {(searchQuery.length > 0 || isSearching) && (
                <div className="mt-3 bg-white rounded-2xl shadow-xl p-4 max-h-80 overflow-y-auto">
                  {/* Loading */}
                  {isSearching && (
                    <p className="text-sm text-gray-500">Searching...</p>
                  )}

                  {/* Results */}
                  {!isSearching && searchResults.length > 0 && (
                    <div className="space-y-3">
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => {
                            router.push(`/product/${product._id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                        >
                          <Image
                            src={product.image?.[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearching &&
                    searchQuery.length > 1 &&
                    searchResults.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No products found
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </>
  );
};

export default Navbar;

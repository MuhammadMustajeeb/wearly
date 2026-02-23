"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import { assets, CartIcon } from "@/assets/assets";
import { useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { router, user, isSeller, setIsCartOpen } = useAppContext();
  const { openSignIn, signOut } = useClerk();

  const pathname = usePathname();
const [isHeroActive, setIsHeroActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
  if (pathname !== "/") {
    setIsHeroActive(false);
    return;
  }

  const handleScroll = () => {
    const heroHeight = window.innerHeight;
    setIsHeroActive(window.scrollY < heroHeight - 100);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [pathname]);


  useEffect(() => {
  const delay = setTimeout(async () => {
    if (searchQuery.trim().length > 1) {
      try {
        setIsSearching(true);

        const { data } = await axios.get(
          `/api/product/search?q=${searchQuery}`
        );

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
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="flex items-center justify-between px-4 md:px-14 lg:px-20 py-6">

          {/* LEFT: MENU + LOGO */}
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)}>
              <Image src={assets.menu_icon} alt="menu" className={`w-5 h-5 ${isHeroActive ? "invert" : ""}`} />
            </button>

            <Image
              src={assets.logo}
              alt="Logo"
              className="w-28 cursor-pointer"
              width={120}
              height={30}
              onClick={() => router.push("/")}
            />
          </div>

          {/* RIGHT: SEARCH + USER + CART */}
          <div className="flex items-center gap-6">

            {/* SEARCH ICON */}
            {/* EXPANDING SEARCH */}
<div className="relative">

  {/* Small Search (default state) */}
  {!searchOpen && (
    <button
      onClick={() => setSearchOpen(true)}
      className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
    >
      <Image
        src={assets.search_icon}
        alt="search"
        className={`w-5 h-5 ${isHeroActive ? "invert" : ""}`}
      />
      <span className="text-sm text-gray-500 hidden sm:block">
        Search
      </span>
    </button>
  )}

</div>




            {/* USER */}
            {user ? (
              <div className="relative group">
                <Image
                  src={assets.user_icon}
                  alt="user"
                  className={`w-5 h-5 cursor-pointer ${isHeroActive ? "invert" : ""}`}
                />

                {/* DROPDOWN */}
                <div className="absolute right-0 mt-4 w-44 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => router.push("/my-orders")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </button>

                  {isSeller && (
                    <button
                      onClick={() => router.push("/seller")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Seller Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={openSignIn}>
                <Image
                  src={assets.user_icon}
                  alt="login"
                  className={`w-5 h-5 ${isHeroActive ? "invert" : ""}`}
                />
              </button>
            )}

            {/* CART */}
            <button onClick={() => setIsCartOpen(true)} className={`relative ${isHeroActive ? "invert" : ""}`}>
              <CartIcon />
            </button>

          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
  <>
    {/* Blur Background */}
    <div
      className="fixed inset-0 backdrop-blur-md bg-black/20 z-40"
      onClick={() => {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }}
    />

    {/* Expanded Search */}
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4">
      <div className="w-full max-w-2xl relative">

        {/* Search Input */}
        <div className="bg-white rounded-full shadow-xl flex items-center px-6 py-3">

          <Image
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5 opacity-60"
          />

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


{menuOpen && (
  <div className="fixed inset-0 z-50 flex">

    {/* DRAWER FIRST (LEFT SIDE) */}
    <div className="w-96 bg-white h-full shadow-2xl p-10 overflow-y-auto">

      {/* Close */}
      <button
        className="mb-10 text-sm text-gray-500 hover:text-black transition"
        onClick={() => setMenuOpen(false)}
      >
        ✕ Close
      </button>

      {/* ===== GENDER (INLINE) ===== */}
      {/* <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
          Shop By Gender
        </p>

        <div className="flex gap-10">
          <p
            onClick={() => router.push("/category/men")}
            className="text-lg font-semibold cursor-pointer hover:opacity-70 transition"
          >
            Men
          </p>

          <p
            onClick={() => router.push("/category/women")}
            className="text-lg font-semibold cursor-pointer hover:opacity-70 transition"
          >
            Women
          </p>

          <p
            onClick={() => router.push("/category/unisex")}
            className="text-lg font-semibold cursor-pointer hover:opacity-70 transition"
          >
            Unisex
          </p>
        </div>
      </div> */}

      {/* Divider */}
      <div className="border-t mb-12"></div>

      {/* ===== CATEGORY LIST (VERTICAL) ===== */}
      <div className="space-y-5 text-gray-700 text-base">

        <p
          onClick={() => router.push("/category/polos")}
          className="cursor-pointer hover:text-black transition"
        >
          Polos
        </p>

        <p
          onClick={() => router.push("/category/plain")}
          className="cursor-pointer hover:text-black transition"
        >
          Plain T-Shirts
        </p>

        <p
          onClick={() => router.push("/category/bold")}
          className="cursor-pointer hover:text-black transition"
        >
          Bold T-Shirts
        </p>

        <p
          onClick={() => router.push("/category/graphic")}
          className="cursor-pointer hover:text-black transition"
        >
          Graphic T-Shirts
        </p>

        <p
          onClick={() => router.push("/category/hoodies")}
          className="cursor-pointer hover:text-black transition"
        >
          Hoodies
        </p>

        <p
          onClick={() => router.push("/category/offers")}
          className="cursor-pointer hover:text-black transition"
        >
          Combo Offers
        </p>

        <p
          onClick={() => router.push("/category/customization")}
          className="cursor-pointer hover:text-black transition"
        >
          Customization
        </p>
      </div>

      {/* Seller Section */}
      {isSeller && (
        <>
          <div className="border-t my-12"></div>

          <p
            onClick={() => router.push("/seller")}
            className="cursor-pointer font-medium hover:text-black transition"
          >
            Seller Dashboard
          </p>
        </>
      )}
    </div>

    {/* OVERLAY AFTER (RIGHT SIDE) */}
    <div
      className="flex-1 bg-black/40 backdrop-blur-sm"
      onClick={() => setMenuOpen(false)}
    />

  </div>
)}



    </>
  );
};

export default Navbar;

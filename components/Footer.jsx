import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-30 bg-black text-white">
      {/* Main Footer Content */}
      <div className="site-container py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* BRAND SECTION */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Image className="w-32 brightness-0 invert" src={assets.logo} alt="Flexters" />
              <div className="space-y-4">
                <p className="text-gray-400 leading-relaxed">
                  Premium fashion essentials for the modern lifestyle. 
                  Crafted with excellence, designed for impact.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-black text-sm tracking-widest uppercase">Est. 2024</span>
                </div>
              </div>

              {/* SOCIAL ICONS */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61580407342439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <FaFacebookF size={16} className="group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://www.instagram.com/flexters_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <FaInstagram size={16} className="group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://www.tiktok.com/@flexters007?_t=ZS-904ZWTYFZKf&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <FaTiktok size={16} className="group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://wa.me/923701114204"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                >
                  <FaWhatsapp size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* SHOP SECTION */}
          <div>
            <div className="space-y-6">
              <h3 className="font-black text-white text-sm tracking-widest uppercase">Shop</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/all-products" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="/category/plain" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Plain Tees
                  </a>
                </li>
                <li>
                  <a href="/category/graphic" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Graphic Tees
                  </a>
                </li>
                <li>
                  <a href="/category/polo" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Polo Shirts
                  </a>
                </li>
                <li>
                  <a href="/offers" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Special Offers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* COMPANY SECTION */}
          <div>
            <div className="space-y-6">
              <h3 className="font-black text-white text-sm tracking-widest uppercase">Company</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/my-orders" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                    Track Order
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div>
            <div className="space-y-6">
              <h3 className="font-black text-white text-sm tracking-widest uppercase">Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <a href="tel:+923701114204" className="text-white font-medium hover:text-red-500 transition-colors duration-300">
                    +92 370 1114204
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <a href="mailto:flexters007@gmail.com" className="text-white font-medium hover:text-red-500 transition-colors duration-300">
                    flexters007@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Support Hours</p>
                  <p className="text-white font-medium">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="site-container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            © 2024 Flexters. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Terms
            </a>
            <a href="/shipping" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Shipping
            </a>
            <a href="/returns" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Returns
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
      <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
    </footer>
  );
};

export default Footer;

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        
        {/* LOGO + DESCRIPTION */}
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Bringing you fresh, trendy, and customizable t-shirts that let you express yourself. 
            Premium quality, designed with care, printed with passion.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 mt-6">
            <a
              href="https://www.facebook.com/profile.php?id=61580407342439"
              target="_blank"
              className="p-2 rounded-full border hover:bg-gray-900 hover:text-white transition"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="https://www.instagram.com/flexters_/"
              target="_blank"
              className="p-2 rounded-full border hover:bg-gray-900 hover:text-white transition"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              className="p-2 rounded-full border hover:bg-gray-900 hover:text-white transition"
            >
              <FaTiktok size={18} />
            </a>

            <a
              href="https://wa.me/923701114204"
              target="_blank"
              className="p-2 rounded-full border hover:bg-gray-900 hover:text-white transition"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

        {/* COMPANY LINKS */}
        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:underline" href="#">Home</a></li>
              <li><a className="hover:underline" href="/about">About us</a></li>
              <li><a className="hover:underline" href="/contact">Contact us</a></li>
              <li><a className="hover:underline" href="/privacy">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+92 370 1114204</p>
              <p>flexters007@gmail.com</p>
            </div>
          </div>
        </div>

      </div>

      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Flexters.com All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;

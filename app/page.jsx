'use client';

import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
// import HomeProducts from "@/components/HomeProducts";
// import FeaturedCategories from "@/components/FeaturedCategories";
// import Banner from "@/components/Banner";
// import WhatsappButton from "@/components/WhatsappButton";
// import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      {/* FIXED HERO */}
      <div className="fixed top-0 left-0 w-full h-screen z-10">
        <HeaderSlider />
      </div>

      {/* MAIN CONTENT */}
      {/* <div className="relative z-20 mt-screen px-6 md:px-16 lg:px-32 bg-white">
        {/* mt-screen is a custom class with margin-top: 100vh */}
        {/* <HomeProducts />
        <FeaturedCategories />
        <Banner />
        <WhatsappButton
          phone="923701114204"
          defaultMessage="Hi! I have a question about my order."
        /> */}
      
      {/* </div> */} 
    </>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderSlider = () => {
  const router = useRouter();

  const sliderData = [
    {
  id: 1,
  title: "Winter Starts Here.",
  offer: "Premium Hoodies Built for Warmth, Comfort & Style",
  buttonText1: "Shop Winter Hoodies",
  buttonText2: "Explore New Arrivals",
  buttonLink1: "/category/plain",
  buttonLink2: "/all-products",
  imgSrc: assets.post_one,
}
,
    {
  id: 2,
  title: "Warmth You Can Feel. Style You Can See.",
  offer: "Everyday Hoodies Designed for Cold Days & Cool Nights",
  buttonText1: "Shop Everyday Hoodies",
  buttonText2: "Find Your Perfect Fit",
  buttonLink1: "/category/graphic",
  buttonLink2: "/all-products",
  imgSrc: assets.post_two,
}
,

    {
  id: 3,
  title: "Layer Up. Stand Out.",
  offer: "Minimal Winter Essentials for Modern Living",
  buttonText1: "Discover Winter Collection",
  buttonText2: "About Our Craft",
  buttonLink1: "/all-products",
  buttonLink2: "/category/graphic",
  imgSrc: assets.post_three,
}
,
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleButtonClick = (link) => {
    router.push(link);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] md:px-16 px-6 py-12 mt-6 rounded-2xl min-w-full min-h-[70vh]"
          >
            {/* Text Section */}
            <div className="md:pl-8 mt-10 md:mt-0 flex-1">
              <p className="md:text-base text-[#d6c4b6] pb-2">
                {slide.offer}
              </p>
              <h1 className="max-w-lg md:text-[44px] md:leading-[54px] text-3xl font-semibold text-gray-800">
                {slide.title}
              </h1>
              <div className="flex items-center mt-5 md:mt-8 space-x-4">
                <button
                  onClick={() => handleButtonClick(slide.buttonLink1)}
                  className="md:px-10 px-7 md:py-3 py-2 bg-[#d6c4b6] hover:bg-[#c8b19e] transition rounded-full text-white font-medium"
                >
                  {slide.buttonText1}
                </button>
                <button
                  onClick={() => handleButtonClick(slide.buttonLink2)}
                  className="group flex items-center gap-2 px-6 py-2.5 font-medium text-gray-700 hover:text-[#d6c4b6]"
                >
                  {slide.buttonText2}
                  <Image
                    className="group-hover:translate-x-1 transition"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center flex-1">
              <Image
                className="md:w-96 w-60 object-contain"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6 mb-4">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-[#d6c4b6]" : "bg-gray-400/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;

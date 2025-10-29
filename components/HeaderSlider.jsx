import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderSlider = () => {
  const router = useRouter();

  const sliderData = [
    {
      id: 1,
      title: "Cozy Winter Tees – Stay Warm in Style",
      offer: "Flat 20% Off on All Winter Tees",
      buttonText1: "Shop Winter Collection",
      buttonText2: "View All Products",
      buttonLink1: "/category/plain",
      buttonLink2: "/all-products",
      imgSrc: assets.post_three,
    },
    {
      id: 2,
      title: "Bold Graphic Tees to Show Your Style",
      offer: "Buy 2 Get 1 Free",
      buttonText1: "Shop Graphic Tees",
      buttonText2: "Explore Bold Collection",
      buttonLink1: "/category/graphic",
      buttonLink2: "/category/bold",
      imgSrc: assets.post_two,
    },
    {
      id: 3,
      title: "Everyday Comfort, Premium Quality",
      offer: "Starting at just $9.99",
      buttonText1: "Shop All Tees",
      buttonText2: "Discover All Styles",
      buttonLink1: "/all-products",
      buttonLink2: "/all-products",
      imgSrc: assets.post_one,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
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
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-[#d6c4b6] pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button
                  onClick={() => handleButtonClick(slide.buttonLink1)}
                  className="md:px-10 px-7 md:py-2.5 py-2 bg-[#d6c4b6] rounded-full text-white font-medium"
                >
                  {slide.buttonText1}
                </button>
                <button
                  onClick={() => handleButtonClick(slide.buttonLink2)}
                  className="group flex items-center gap-2 px-6 py-2.5 font-medium"
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
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-[#d6c4b6]" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;

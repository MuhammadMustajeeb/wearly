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
    {/* FULL WIDTH EDITORIAL */}
<section className="pb-24 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

  <div className="grid grid-cols-2 gap-0">
    {p[0] && <ProductCard product={p[0]} variant="editorial" />}
    {p[1] && <ProductCard product={p[1]} variant="editorial" />}
  </div>
</section>

{/* HEADING (CONTAINER WIDTH) */}
<div className="site-container">
  <SectionHeading
    title="Explore the Collection"
    subtitle="Premium T-Shirts & Polos"
    actionText="View All"
    onAction={() => router.push("/all-products")}
  />
</div>

{/* HORIZONTAL PRODUCT RAIL */}
<section className="py-24 relative overflow-hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
  {/* EDITORIAL STRIP */}
  <div
  ref={sliderRef}
  className="
    flex
    - gap-0
+ gap-2 lg:gap-4

    overflow-x-auto
    scroll-smooth
    snap-x snap-mandatory
    scrollbar-hide
  "
>

  {products.slice(2, 7).map((product) => (
  <div
    key={product._id}
    className="
      snap-start
      min-w-[80vw]
      sm:min-w-[50vw]
      lg:min-w-[22vw]
    "
  >
    <ProductCard product={product} variant="rail" />
  </div>
))}

</div>

</section>

    </>
  );
};

export default HomeProducts;

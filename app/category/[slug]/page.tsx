

import connectDB from "@/config/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import React from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const titleMap = {
    plain: "Plain T-Shirts – Minimal & Timeless | Flexters",
    bold: "Bold Tees – Confidence Wear | Flexters",
    graphic: "Graphic Tees – Express Yourself | Flexters",
    polos: "Polos – Smart Casual Collection | Flexters",
    hoodies: "Hoodies – Premium Winter Wear | Flexters",
    offers: "Combo Offers – Best Deals | Flexters",
    customization: "Custom T-Shirts – Design Your Own | Flexters",
  };

  const descriptionMap = {
    plain: "Shop minimalist plain t-shirts in premium cotton. Perfect for everyday wear and effortless style.",
    bold: "Discover bold t-shirts that speak confidence. Made for modern streetwear lovers.",
    graphic: "Explore graphic tees with creative designs that define your personality.",
    offers: "Grab our best combo deals and pack-of-2 t-shirts. Double the comfort, double the style.",
  };

  return {
    title: titleMap[slug] || `Shop ${slug} - Flexters`,
    description: descriptionMap[slug] || "Explore our latest t-shirt collections at Flexters.",
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  const products = await (Product as any)
    .find({ category: slug })
    .sort({ date: -1 })
    .lean();

  const plainProducts = products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  const titleMap: Record<string, string> = {
    plain: "Plain T-Shirts",
    bold: "Bold Tees",
    graphic: "Graphic Tees",
    polos: "Polos",
    hoodies: "Hoodies",
    offers: "Combo Offers",
    customization: "Customization",
  };

  const title = titleMap[slug] || slug;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">

      {/* Clean Section Heading */}
      <SectionHeading
        title={title}
        subtitle={`Browse ${plainProducts.length} items`}
        align="left"
        theme="light" actionText={undefined} onAction={undefined}      />

      {/* Product Grid */}
      {plainProducts.length === 0 ? (
        <p className="text-gray-500 text-lg mt-6">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-2">
          {plainProducts.map((p) => (
            <ProductCard key={p._id} product={p} variant="tall" />
          ))}
        </div>
      )}

      {/* Optional Featured Section */}
      {plainProducts.length > 4 && (
        <div className="mt-20">
          <SectionHeading
            title="Featured Products"
            align="left"
            theme="light" subtitle={undefined} actionText={undefined} onAction={undefined}          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-2 mt-6">
            {plainProducts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} variant="tall" />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

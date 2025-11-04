import connectDB from "@/config/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import React from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const titleMap = {
    plain: "Plain T-Shirts – Minimal & Timeless Styles | Flexters",
    bold: "Bold Tees – Statement Designs for Confidence | Flexters",
    graphic: "Graphic T-Shirts – Express Yourself | Flexters",
    offers: "Combo Offers – Pack of 2 & 3 Deals | Flexters",
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
    offers: "Combo Offers",
  };
  const title = titleMap[slug] || slug;

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">Browse {plainProducts.length} items</p>
      </div>

      {plainProducts.length === 0 ? (
        <p className="text-gray-600">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plainProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

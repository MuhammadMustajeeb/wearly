import connectDB from "@/config/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import React from "react";

export async function generateMetadata({ params }) {
  const { slug } = params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} T-Shirts - Flexters`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  await connectDB();

const products = await (Product as any).find({ category: slug }).sort({ date: -1 }).exec();

  const plainProducts = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  const titleMap = { plain: "Plain T-Shirts", bold: "Bold Tees", graphic: "Graphic Tees" };
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

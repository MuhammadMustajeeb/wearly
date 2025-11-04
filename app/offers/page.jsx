import connectDB from "@/config/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import React from "react";

export const metadata = {
  title: "Combo Offers & 2-Pack T-Shirts - Flexters",
  description:
    "Grab exclusive combo offers on premium T-shirts. Soft fabrics, modern fits, and stylish prints — all in one deal.",
};

export default async function OffersPage() {
  await connectDB();

  // Fetch both 'offer' and 'offers' categories
  const products = await (Product)
    .find({ category: { $in: ["offer", "offers"] } })
    .sort({ date: -1 })
    .lean();

  const offers = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Combo Offers & 2-Pack Deals
        </h1>
        <p className="text-gray-600 mt-2">
          Save more with Flexters exclusive combo offers — 
          choose your favorite fits, colors, and styles.
        </p>
      </div>

      {offers.length === 0 ? (
        <p className="text-gray-600 text-center">No combo offers available right now.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offers.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

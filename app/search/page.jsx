import connectDB from "@/config/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || "";

  await connectDB();

  const products = await Product.find({
    name: { $regex: query, $options: "i" }
  }).lean();

  const plainProducts = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for "{query}"
      </h1>

      {plainProducts.length === 0 ? (
        <p>No products found.</p>
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

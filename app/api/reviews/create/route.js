import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { isVerifiedBuyer } from "@/utils/reviewHelpers";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, user } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { productId, rating, comment = "", images = [] } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // prevent reviewing non-existing product
    const product = await Product.findById(productId).lean();
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    // compute verified purchase
    const verifiedPurchase = await isVerifiedBuyer(userId, productId);

    // create review - unique index prevents duplicates (catch duplicate error)
    try {
      const review = await Review.create({
        product: productId,
        userId,
        userName: user?.fullName || user?.firstName || undefined,
        rating,
        comment,
        images,
        verifiedPurchase,
        approved: true,
      });

      // OPTIONAL: update product rating counters (denormalize)
      // you can update product.rating and product.numReviews here

      return NextResponse.json({ success: true, review });
    } catch (err) {
      if (err.code === 11000) {
        return NextResponse.json({ success: false, message: "You already reviewed this product" }, { status: 409 });
      }
      throw err;
    }
  } catch (err) {
    console.error("Create review error:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

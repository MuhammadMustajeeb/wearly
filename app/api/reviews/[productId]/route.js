import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";

export async function GET(req, context) {
  try {
    await connectDB();

    const { userId } = getAuth(req);

    const { params } = await context;    // ✅ FIX
    const { productId } = params;

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Number(url.searchParams.get("pageSize") || 10));
    const sort = url.searchParams.get("sort") || "newest";

    const filter = { product: productId, hidden: false, approved: true };

    let sortObj = { createdAt: -1 };
    if (sort === "highest") sortObj = { rating: -1, createdAt: -1 };
    if (sort === "lowest")  sortObj = { rating: 1, createdAt: -1 };
    if (sort === "helpful") sortObj = { helpfulCount: -1, createdAt: -1 };

    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .sort(sortObj)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // ⭐ Add isOwner so delete button works
    const finalReviews = reviews.map(r => ({
      ...r,
      isOwner: userId && String(r.userId) === String(userId)
    }));

    return NextResponse.json({
      success: true,
      reviews: finalReviews,
      meta: { total, page, pageSize },
    });

  } catch (error) {
    console.error("Review GET Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { reviewId } = await req.json();
    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    const already = review.helpfulBy?.includes(userId);
    if (already) {
      // remove
      review.helpfulBy = review.helpfulBy.filter((u) => u !== userId);
    } else {
      review.helpfulBy = [...(review.helpfulBy || []), userId];
    }
    review.helpfulCount = review.helpfulBy.length;
    await review.save();
    return NextResponse.json({ success: true, helpfulCount: review.helpfulCount, toggled: !already });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

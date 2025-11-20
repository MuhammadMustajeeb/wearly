import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";
import { isAdminByClerkId } from "@/utils/reviewHelpers";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (!await isAdminByClerkId(userId)) return NextResponse.json({ success: false, message: "Admin only" }, { status: 403 });

    const { action } = await req.json(); // e.g., { action: "hide" } or { action: "approve" }
    const review = await Review.findById(params.reviewId);
    if (!review) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (action === "hide") review.hidden = true;
    if (action === "show") review.hidden = false;
    if (action === "approve") review.approved = true;
    if (action === "reject") review.approved = false;

    await review.save();
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

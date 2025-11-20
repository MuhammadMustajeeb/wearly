import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Review from "@/models/Review";
import { isAdminByClerkId } from "@/utils/reviewHelpers";

export async function DELETE(req, context) {
  try {
    await connectDB();
    
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { params } = await context;  // ✅ FIX
    const { id } = params;             // safe

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    const isAdmin = await isAdminByClerkId(userId);
    if (String(review.userId) !== String(userId) && !isAdmin) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await Review.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Deleted" });

  } catch (error) {
    console.error("DELETE Review Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

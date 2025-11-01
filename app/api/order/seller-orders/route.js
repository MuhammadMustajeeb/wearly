import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

// Import models so Mongoose registers them
import Order from "@/models/Order";
import "@/models/Product";   // ✅ required for populate("items.product")
import "@/models/Address";   // ✅ required for populate("address")

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // check seller
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized! Access Denied" },
        { status: 401 }
      );
    }

    await connectDB();

    // fetch orders, populate address and product
    const orders = await Order.find({})
      .populate("address")
      .populate("items.product")
      .sort({ date: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("[SELLER ORDERS] ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

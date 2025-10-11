import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const raw = await request.text();
    console.log("🟢 [ORDER CREATE] Raw body:", raw);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
    }

    console.log("🟢 [ORDER CREATE] Parsed body:", body);

    const { userId } = getAuth(request);
    if (!userId) {
      console.log("🔴 No userId from Clerk auth");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Normalize cartData
    let cartData = body.cartData;
    if (!cartData && Array.isArray(body.items)) {
      cartData = {};
      for (const i of body.items) {
        if (!i || !i.product) continue;
        cartData[i.product] = i.quantity || 1;
      }
    }

    console.log("🟢 [ORDER CREATE] Normalized cartData:", cartData);

    if (!cartData || Object.keys(cartData).length === 0) {
      return NextResponse.json({ success: false, message: "Cart empty or invalid" }, { status: 400 });
    }

    const address = body.address;
    if (!address || typeof address !== "object") {
      return NextResponse.json({ success: false, message: "Address missing or invalid" }, { status: 400 });
    }

    const paymentMethod = body.paymentMethod || "unknown";
    const items = [];
    let total = 0;

    for (const key of Object.keys(cartData)) {
      const qty = cartData[key];
      const [pid, size] = key.split(":");

      if (!mongoose.isValidObjectId(pid)) {
        return NextResponse.json({ success: false, message: `Invalid productId: ${pid}` }, { status: 400 });
      }

      const product = await Product.findById(pid).lean();
      if (!product) {
        return NextResponse.json({ success: false, message: `Product not found: ${pid}` }, { status: 400 });
      }

      const price = product.offerPrice ?? product.price;
      items.push({ productId: pid, quantity: qty, size: size || null, price });
      total += price * qty;
    }

    const orderDoc = {
      userId,
      items,
      amount: Math.round(total * 100) / 100,
      address,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      date: Date.now(),
    };

    console.log("🟢 [ORDER CREATE] Final orderDoc:", orderDoc);

    const newOrder = await Order.create(orderDoc);
    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    console.error("🔥 [ORDER CREATE] Fatal error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

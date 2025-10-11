// app/api/order/create/route.js
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import mongoose from "mongoose";

const ALLOWED_PAYMENT_METHODS = ["COD", "EASYPAISA", "JAZZCASH"];

export async function POST(request) {
  try {
    // 1️⃣ Parse body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
    }

    // 2️⃣ Normalize cart
    let cartData = null;
    if (body.cartData && typeof body.cartData === "object" && !Array.isArray(body.cartData)) {
      cartData = body.cartData;
    } else if (Array.isArray(body.items)) {
      cartData = {};
      for (const it of body.items) {
        if (!it) continue;
        let key = null;
        if (typeof it.product === "string") key = it.product.trim();
        else if (it.product && it.product.id) {
          const sizePart = it.product.size ? `:${it.product.size}` : "";
          key = `${String(it.product.id)}${sizePart}`;
        }
        const qty = Number(it.quantity ?? it.qty ?? 0);
        if (key && qty > 0) cartData[key] = (cartData[key] || 0) + qty;
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "cartData missing. Send cartData object or items array.",
      }, { status: 400 });
    }

    if (!cartData || Object.keys(cartData).length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // 3️⃣ Auth (Clerk)
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 4️⃣ Connect DB
    await connectDB();

    // 5️⃣ Validate address
    const rawAddress = body.address;
    if (!rawAddress || typeof rawAddress !== "string" || !mongoose.isValidObjectId(rawAddress)) {
      return NextResponse.json({ success: false, message: "address must be a valid ObjectId" }, { status: 400 });
    }

    const addressId = new mongoose.Types.ObjectId(rawAddress);

    // 6️⃣ Validate payment method
    const paymentMethod = (body.paymentMethod || "").toUpperCase();
    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return NextResponse.json({
        success: false,
        message: `Invalid payment method. Allowed: ${ALLOWED_PAYMENT_METHODS.join(", ")}`,
      }, { status: 400 });
    }

    // 7️⃣ Prepare and validate product items
    const parsedKeys = Object.keys(cartData);
    const productIds = parsedKeys.map((k) => k.split(":")[0]);
    const uniqueProductIds = [...new Set(productIds)];

    for (const pid of uniqueProductIds) {
      if (!mongoose.isValidObjectId(pid)) {
        return NextResponse.json({ success: false, message: `Invalid product id: ${pid}` }, { status: 400 });
      }
    }

    const products = await Product.find({ _id: { $in: uniqueProductIds } }).lean();
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    // 8️⃣ Build items array + calculate total
    const itemsForOrder = [];
    let totalAmount = 0;

    for (const key of parsedKeys) {
      const qty = Number(cartData[key]);
      if (!qty || qty <= 0) continue;

      const [productId, size] = key.split(":");
      const product = productMap.get(productId);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product not found: ${productId}` }, { status: 400 });
      }

      const unitPrice = Number(product.offerPrice ?? product.price ?? 0);
      const linePrice = unitPrice * qty;

      itemsForOrder.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity: qty,
        size: size || "M", // default fallback
      });

      totalAmount += linePrice;
    }

    if (itemsForOrder.length === 0) {
      return NextResponse.json({ success: false, message: "No valid items to place order" }, { status: 400 });
    }

    // 9️⃣ Create Order document
    const newOrder = await Order.create({
      userId: String(userId),
      items: itemsForOrder,
      amount: Math.round(totalAmount * 100) / 100,
      address: addressId,
      paymentMethod,
      paymentStatus: "pending",
      date: Date.now(),
    });

    // 🔟 Optional: Clear user cart
    try {
      const updateByClerk = await User.findOneAndUpdate(
        { clerkId: userId },
        { $set: { cartItems: {} } }
      );
      if (!updateByClerk) {
        await User.findByIdAndUpdate(userId, { $set: { cartItems: {} } });
      }
    } catch (err) {
      console.warn("Failed to clear user cart (non-fatal):", err.message);
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("[ORDER CREATE] ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

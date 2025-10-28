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
    if (!body) return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });

    console.log("[ORDER CREATE] Request body:", body);

    // 2️⃣ Normalize cart items
    let cartItems = [];

    // Case A: cartData object { "productId:size:color": qty }
    if (body.cartData && typeof body.cartData === "object" && !Array.isArray(body.cartData)) {
      for (const key of Object.keys(body.cartData)) {
        const qty = Number(body.cartData[key]);
        if (!qty || qty <= 0) continue;

        const parts = key.split(":").map((p) => p.trim());
        const productId = parts[0];
        const size = parts[1] || "M";
        const color = parts[2] || "Default";

        cartItems.push({ productId, quantity: qty, size, color });
      }
    }

    // Case B: items array [{ product, quantity, size, color }]
    if (Array.isArray(body.items)) {
      const itemsFromArray = body.items
        .map((it) => {
          let productStr = it.product;
          if (!productStr) return null;

          // Split composite key: productId:size:color
          const parts = productStr.split(":").map(p => p.trim());
          const productId = parts[0];
          const size = it.size || parts[1] || "M";
          const color = it.color || parts[2] || "Default";

          const quantity = Number(it.quantity ?? it.qty ?? 0);
          if (!productId || quantity <= 0) return null;

          return { productId, quantity, size, color };
        })
        .filter(Boolean);

      cartItems = cartItems.concat(itemsFromArray);
    }

    if (!cartItems.length) return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });

    console.log("[ORDER CREATE] Normalized cartItems:", cartItems);

    // 3️⃣ Auth
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    console.log("[ORDER CREATE] userId:", userId);

    // 4️⃣ Connect DB
    await connectDB();

    // 5️⃣ Validate address
    const rawAddress = body.address;
    if (!rawAddress || typeof rawAddress !== "string" || !mongoose.isValidObjectId(rawAddress)) {
      return NextResponse.json({ success: false, message: "Address must be a valid ObjectId" }, { status: 400 });
    }
    const addressId = new mongoose.Types.ObjectId(rawAddress);
    console.log("[ORDER CREATE] rawAddress:", rawAddress);

    // 6️⃣ Validate payment method
    const paymentMethod = (body.paymentMethod || "").toUpperCase();
    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return NextResponse.json({
        success: false,
        message: `Invalid payment method. Allowed: ${ALLOWED_PAYMENT_METHODS.join(", ")}`,
      }, { status: 400 });
    }

    // 7️⃣ Validate product IDs
    const productIds = [...new Set(cartItems.map((i) => i.productId))];
    console.log("[ORDER CREATE] productIds:", productIds);

    for (const pid of productIds) {
      if (!mongoose.isValidObjectId(pid)) {
        console.log("[ORDER CREATE] Invalid productId:", pid, "cartItems:", cartItems);
        return NextResponse.json({ success: false, message: `Invalid productId: ${pid}` }, { status: 400 });
      }
    }

    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    // 8️⃣ Build order items + calculate total (respects frontend price + shipping)
const orderItems = [];
let totalAmount = 0;

for (const item of cartItems) {
  const product = productMap.get(item.productId);
  if (!product)
    return NextResponse.json(
      { success: false, message: `Product not found: ${item.productId}` },
      { status: 400 }
    );

  // Use frontend price if provided, otherwise fallback to DB price
  let unitPrice = Number(item.price ?? product.offerPrice ?? product.price ?? 0);

  // Apply size adjustment for graphic products
  if (product?.category?.toLowerCase() === "graphic" && item.size === "L") {
    unitPrice = Math.round(unitPrice * 1.2105); // +21% for L
  }

  const linePrice = unitPrice * item.quantity;

  orderItems.push({
    product: new mongoose.Types.ObjectId(item.productId),
    quantity: item.quantity,
    size: item.size || "M",
    color: item.color || "Default",
    price: unitPrice, // store adjusted price for order display
  });

  totalAmount += linePrice;
}

// ✅ Add fixed shipping fee
const shippingFee = Number(body.shippingFee ?? 100);
totalAmount += shippingFee;


console.log("[ORDER CREATE] orderItems:", orderItems, "totalAmount:", totalAmount);

    // 9️⃣ Create order
    const newOrder = await Order.create({
      userId: String(userId),
      items: orderItems,
      amount: Math.round(totalAmount * 100) / 100,
      shippingFee,
      address: addressId,
      paymentMethod,
      paymentStatus: "pending",
      date: Date.now(),
    });

    // 🔟 Clear user cart (non-fatal)
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

    return NextResponse.json({ success: true, message: "Order created successfully", orderId: newOrder._id });

  } catch (err) {
    console.error("[ORDER CREATE] ERROR:", err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

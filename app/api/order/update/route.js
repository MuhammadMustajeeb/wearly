import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    await connectDB();
    const { orderId, orderStatus, paymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ success: true, products: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    })
      .limit(6)
      .lean();

    return NextResponse.json({ success: true, products });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

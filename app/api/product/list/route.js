// api/product/list/page.tsx
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const category = url.searchParams.get("category"); // e.g. "plain"

    const query = {};
    if (category) query.category = category;

    const products = await Product.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

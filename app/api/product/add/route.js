import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const isSeller = await authSeller(userId);
    if (!isSeller) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = Number(formData.get("price"));
    const offerPrice = Number(formData.get("offerPrice"));

    // Colors
    const colors = formData.getAll("colors[]"); // array
    const altColors = formData.get("colors");   // CSV fallback
    const availableColors = colors.length
      ? colors
      : altColors
      ? altColors.split(",").map(c => c.trim())
      : [];

    console.log("[PRODUCT ADD] Colors to save:", availableColors);

    // Images
    const files = formData.getAll("images");
    if (!files.length) return NextResponse.json({ success: false, message: "Upload product images" }, { status: 400 });

    const image = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, res) =>
            err ? reject(err) : resolve(res.secure_url)
          );
          stream.end(buffer);
        });
      })
    );

    await connectDB();

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price,
      offerPrice,
      image,
      availableColors: availableColors.length ? availableColors : [], // save empty if none selected
      date: Date.now(),
    });

    console.log("[PRODUCT ADD] Saved Product:", newProduct);

    return NextResponse.json({ success: true, message: "Product added", newProduct });
  } catch (error) {
    console.error("[PRODUCT ADD]", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

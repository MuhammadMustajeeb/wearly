import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file"); // expects <input type="file" name="file">
    if (!file) return NextResponse.json({ success: false, message: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "reviews" }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(buffer);
    });

    return NextResponse.json({ success: true, url: upload.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, message: err.message || "Upload failed" }, { status: 500 });
  }
}

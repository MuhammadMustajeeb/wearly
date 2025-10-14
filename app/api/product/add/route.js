// app/api/product/add/route.js
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

async function uploadFileToCloudinary(file, uploadOpts = {}) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: "auto", ...uploadOpts }, (err, res) => {
      if (err) return reject(err);
      resolve(res.secure_url);
    });
    stream.end(buffer);
  });
}

// normalize color token for comparisons: remove #, lowercase
const normToken = (c) => (c ? String(c).replace(/^#/, "").toLowerCase() : "");

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

    // collect files: generic images and imagesByColor[*]
    const genericFiles = []; // files appended as 'images'
    const filesByColor = {}; // { color: [File,...] }

    // iterate formData entries so we can detect keys and debug
    for (const entry of formData.entries()) {
      const [key, value] = entry;
      // debug log small summary (don't log file binary)
      if (typeof value === "string") {
        // simple text field
        // console.log(`[PRODUCT ADD] field: ${key} = ${value}`);
      } else {
        // value is File
        // console.log(`[PRODUCT ADD] file entry key: ${key} name=${value?.name}`);
      }

      if (key === "images") {
        genericFiles.push(value);
      } else {
        const m = key.match(/^imagesByColor\[(.+)\]$/);
        if (m) {
          const colorKey = m[1];
          filesByColor[colorKey] = filesByColor[colorKey] || [];
          filesByColor[colorKey].push(value);
        }
      }
    }

    // SERVER DEBUG: show what arrived
    console.log("[PRODUCT ADD] availableColors:", availableColors);
    console.log("[PRODUCT ADD] genericFiles count:", genericFiles.length);
    console.log("[PRODUCT ADD] filesByColor keys:", Object.keys(filesByColor).map(k => `${k}(${filesByColor[k].length})`));

    // require at least one image (generic or per-color)
    if (!genericFiles.length && Object.keys(filesByColor).length === 0) {
      return NextResponse.json({ success: false, message: "Upload at least one image (generic or per-color)" }, { status: 400 });
    }

    // 1) Upload generic files first (so we have URLs to possibly map by filename)
    const uploadedGenericUrls = await Promise.all(
      genericFiles.map(async (file) => {
        try {
          return await uploadFileToCloudinary(file);
        } catch (err) {
          console.error("[PRODUCT ADD] generic file upload error:", err);
          throw err;
        }
      })
    );

    // 2) Upload per-color files
    const imagesByColor = {}; // { color: [url,...] }
    await Promise.all(
      Object.entries(filesByColor).flatMap(([color, farr]) =>
        farr.map(async (file) => {
          try {
            const url = await uploadFileToCloudinary(file);
            imagesByColor[color] = imagesByColor[color] || [];
            imagesByColor[color].push(url);
          } catch (err) {
            console.error(`[PRODUCT ADD] upload error for color ${color}:`, err);
            throw err;
          }
        })
      )
    );

    // 3) If we have no explicit imagesByColor but generic uploads exist, try to auto-map
    //    by filename tokens (best-effort). This helps when seller uploaded files but not per-color.
    if (Object.keys(imagesByColor).length === 0 && uploadedGenericUrls.length > 0 && availableColors.length > 0) {
      console.log("[PRODUCT ADD] trying fallback mapping from generic image URLs to availableColors");
      for (const color of availableColors) {
        const token = normToken(color);
        if (!token) continue;
        for (const url of uploadedGenericUrls) {
          const lower = String(url).toLowerCase();
          if (lower.includes(token)) {
            imagesByColor[color] = imagesByColor[color] || [];
            imagesByColor[color].push(url);
          }
        }
      }
      console.log("[PRODUCT ADD] fallback imagesByColor mapping:", Object.keys(imagesByColor).map(k => `${k}(${imagesByColor[k].length})`));
    }

    // genericUrls final (use uploadedGenericUrls)
    const image = uploadedGenericUrls;

    // 4) Save product: include imagesByColor only if it has keys
    await connectDB();

    const productPayload = {
      userId,
      name,
      description,
      category,
      price,
      offerPrice,
      image,
      availableColors: availableColors.length ? availableColors : [],
      date: Date.now(),
    };

    if (Object.keys(imagesByColor).length) {
      // normalize keys to stored format if you prefer: store as provided (raw keys)
      productPayload.imagesByColor = imagesByColor;
    }

    const newProduct = await Product.create(productPayload);

    console.log("[PRODUCT ADD] saved product id:", newProduct._id, "imagesByColor keys:", newProduct.imagesByColor ? Object.keys(newProduct.imagesByColor) : "none");

    return NextResponse.json({ success: true, message: "Product added", newProduct });
  } catch (error) {
    console.error("[PRODUCT ADD] ERROR:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}


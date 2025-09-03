import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";


export async function GET(request) {
    try { 

        // connect to database
        await connectDB();

        // get all products from database
        const products = await Product.find({});
        return NextResponse.json({ success: true, products });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    } 
}
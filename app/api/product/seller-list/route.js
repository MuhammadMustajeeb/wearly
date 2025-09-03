import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
    try { 

        // get user id
        const { userId } = getAuth(request);

        // check if it seller or not
        const isSeller = authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized! Access Denied" });
        }

        // connect to database
        await connectDB();

        // get all products from database
        const products = await Product.find({});
        return NextResponse.json({ success: true, products });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    } 
}
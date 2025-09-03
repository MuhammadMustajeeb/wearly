import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(request) {
    try { 

        // get user id
        const { userId } = getAuth(request);

        await connectDB();
        // get user model
        const user = await User.findById(userId);

        // send cartitems data from user data
        const { cartItems } = user;

        return NextResponse.json({ success: true, cartItems });


    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
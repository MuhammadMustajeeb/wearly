import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {

    try { 

        const { userId } = getAuth(request);

        await connectDB();
        //
        const mongooseConn = mongoose.connection;
console.log("Connected DB:", mongooseConn.name);
console.log("Collections:", await mongooseConn.db.listCollections().toArray());


        const user = await User.findById(userId);

        console.log("Mongoo user",user);
        console.log("Clerk user id",userId);

        const allUsers = await User.find({}, "_id email name");
console.log("All Mongo users:", allUsers);


        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({ success: true, user });

     } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
     }
}
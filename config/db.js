import mongoose from 'mongoose';

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/ecommercebrand`, opts).then((mongoose) => {
        return mongoose;
    })
    }

    cached.conn = await cached.promise;
    return cached.conn;

}

export default connectDB; // exporting the function to be used in other files and it's way to connect to the database
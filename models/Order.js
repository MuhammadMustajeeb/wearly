import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true },
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true, ref: 'address' },
    paymentMethod: { type: String, enum: ["COD", "EASYPAISA", "JAZZCASH"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["placed", "shipped", "delivered", "cancelled"], default: "placed" },
    date: { type: Number, required: true }
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;
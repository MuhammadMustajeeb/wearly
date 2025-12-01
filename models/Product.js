import mongoose from 'mongoose';

// creating a schema for the product
const productSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: 'user' },
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    availableSizes: { type: [String], default: ["M", "L"] },
    availableColors: { type: [String], default: [] },
    outOfStockColors: { type: [String], default: ["gray"] },

    date: {type: Number, required: true}
})

const Product = mongoose.models.product || mongoose.model('product', productSchema); // this the product model based on the schema created above

export default Product;
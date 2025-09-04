import mongoose from 'mongoose';

// creating a schema for the user
const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    imageUrl: {type: String, required: true},
    cartItems: {type: Object, default: {}},
}, { minimize: false });

const User = mongoose.models.user || mongoose.model('user', userSchema); // this the user model based on the schema created above

export default User;
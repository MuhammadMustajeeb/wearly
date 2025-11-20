import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  userId: { type: String, ref: "user", required: true }, // Clerk userId
  userName: { type: String }, // optional cache
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
  images: [{ type: String }],
  verifiedPurchase: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  helpfulBy: [{ type: String }], // list of userIds who marked helpful
  approved: { type: Boolean, default: true }, // set false for moderation flow
  hidden: { type: Boolean, default: false }, // admin hides review
}, { timestamps: true });

// prevent duplicate reviews per user/product (one review per user per product)
reviewSchema.index({ product: 1, userId: 1 }, { unique: true });

const Review = mongoose.models.review || mongoose.model("review", reviewSchema);
export default Review;

"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ReviewItem = ({ review, onDelete = ()=>{}, onHelpful = ()=>{} }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [toggled, setToggled] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete your review?")) return;

    try {
      await axios.delete(`/api/reviews/delete/${review._id}`);  // ✅ FIXED API PATH
      toast.success("Review deleted");
      onDelete();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete");
    }
  };

  const toggleHelpful = async () => {
    try {
      const res = await axios.post("/api/reviews/helpful", { reviewId: review._id });
      setHelpfulCount(res.data.helpfulCount);
      setToggled(res.data.toggled);
      onHelpful();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="border rounded p-4">
      <div className="flex items-center justify-between">
        {/* Rating + username */}
        <div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {review.userName || review.userId?.slice(-6)} • 
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Verified + Delete */}
        <div className="flex items-center gap-2">
          {review.verifiedPurchase && (
            <span className="text-green-600 text-sm">✔ Verified</span>
          )}

          {review.isOwner && (
            <button onClick={handleDelete} className="text-red-500 text-sm">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Comment */}
      <p className="mt-3">{review.comment}</p>

      {/* Images */}
      {review.images?.length > 0 && (
        <div className="flex gap-2 mt-3">
          {review.images.map((img, i) => (
            <img key={i} src={img} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      )}

      {/* Helpful */}
      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={toggleHelpful}
          className={`text-sm ${toggled ? "text-blue-600" : "text-gray-600"}`}
        >
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;

"use client";
import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews = [], onDelete = ()=>{}, onHelpful = ()=>{} }) => {
  if (!reviews.length) return <p className="text-gray-500">No reviews yet.</p>;
  return (
    <div className="space-y-4">
      {reviews.map(r => <ReviewItem key={r._id} review={r} onDelete={onDelete} onHelpful={onHelpful} />)}
    </div>
  );
};

export default ReviewList;

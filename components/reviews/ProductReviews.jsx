"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import RatingSummary from "./RatingSummary";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewFilters from "./ReviewFilters";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const fetchReviews = async (p = page, s = sort) => {
    try {
      const res = await axios.get(`/api/reviews/${productId}?page=${p}&pageSize=10&sort=${s}`);
      setReviews(res.data.reviews || []);
      setMeta(res.data.meta || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchReviews(1, sort); }, [productId, sort]);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

      <RatingSummary reviews={reviews} />

      <ReviewForm productId={productId} onReviewAdded={() => fetchReviews(1, sort)} />

      <ReviewFilters sort={sort} setSort={setSort} />

      <ReviewList reviews={reviews} onDelete={() => fetchReviews(1, sort)} onHelpful={() => fetchReviews(1, sort)} />
      {/* pagination (basic) */}
      {meta.total > meta.pageSize && (
        <div className="mt-4 flex gap-2">
          <button disabled={meta.page <= 1} onClick={() => { setPage((p)=>Math.max(1,p-1)); fetchReviews(page-1, sort); }} className="px-3 py-1 border rounded">Prev</button>
          <button onClick={() => { setPage((p)=>p+1); fetchReviews(page+1, sort); }} className="px-3 py-1 border rounded">Next</button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

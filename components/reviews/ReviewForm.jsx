"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const uploadOne = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await axios.post("/api/reviews/upload", form);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Write a comment");
    try {
      setUploading(true);
      const urls = [];
      for (let f of files) {
        const u = await uploadOne(f);
        urls.push(u);
      }
      await axios.post("/api/reviews/create", { productId, rating, comment, images: urls });
      setComment("");
      setFiles([]);
      toast.success("Review submitted");
      onReviewAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setUploading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-5 mb-8">
      <p className="font-semibold mb-2">Write a review</p>

      <div className="flex gap-2 mb-3">
        {[1,2,3,4,5].map(s => (
          <button key={s} type="button" className={`text-2xl ${s <= rating ? "text-yellow-500" : "text-gray-300"}`} onClick={() => setRating(s)}>★</button>
        ))}
      </div>

      <textarea className="w-full p-2 border rounded" rows={3} placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} />

      <div className="mt-2 flex items-center gap-3">
        <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))} />
        <div className="flex gap-2">
          {files.map((f, i) => <img key={i} src={URL.createObjectURL(f)} className="w-16 h-16 object-cover rounded" />)}
        </div>
      </div>

      <button type="submit" disabled={uploading} className="mt-3 px-4 py-2 bg-black text-white rounded">
        {uploading ? "Uploading..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;

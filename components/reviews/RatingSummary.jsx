const RatingSummary = ({ reviews }) => {
  if (!reviews) return null;
  const total = reviews.length;
  if (!total) return <p className="text-gray-500 mb-6">No reviews yet.</p>;
  const avg = (reviews.reduce((s,r) => s + r.rating, 0) / total).toFixed(1);

  const starCount = (n) => reviews.filter(r => r.rating === n).length;
  return (
    <div className="mb-8">
      <p className="text-3xl font-semibold">{avg} <span className="text-sm text-gray-500">/5</span></p>
      {[5,4,3,2,1].map(s => (
        <div key={s} className="flex items-center gap-3 mt-2">
          <span className="w-10">{s}★</span>
          <div className="flex-1 bg-gray-200 h-2 rounded">
            <div className="bg-yellow-500 h-2 rounded" style={{ width: `${(starCount(s)/total)*100}%` }} />
          </div>
          <span className="w-10 text-right">{starCount(s)}</span>
        </div>
      ))}
    </div>
  );
};
export default RatingSummary;

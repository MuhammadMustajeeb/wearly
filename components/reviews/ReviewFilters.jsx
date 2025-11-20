"use client";
const ReviewFilters = ({ sort, setSort }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <label className="text-sm text-gray-600">Sort:</label>
      <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border p-1 rounded">
        <option value="newest">Newest</option>
        <option value="highest">Highest rating</option>
        <option value="lowest">Lowest rating</option>
        <option value="helpful">Most helpful</option>
      </select>
    </div>
  );
};
export default ReviewFilters;

export default function MetricCard({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}

export default function TopProductsTable({ products }) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <h3 className="font-medium mb-4">Top Products</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Name</th>
            <th>Sold</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td>{p.name}</td>
              <td>{p.sold}</td>
              <td>₨ {p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// app/dashboard/page.jsx
import { auth } from "@clerk/nextjs/server";
import MetricCard from "@/components/dashboard/MetricCard";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProductsTable from "@/components/dashboard/TopProductsTable";
import {
  getDashboardStats,
  getLast7DaysSales,
  getTopProducts,
} from "@/lib/dashboardQueries";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) return <div>Please login first</div>; // Debug: if null, cookies missing

  const [stats, sales, products] = await Promise.all([
    getDashboardStats(),
    getLast7DaysSales(),
    getTopProducts(),
  ]);

  return (
    <section className="px-10 py-8">
      <h1 className="text-2xl font-semibold mb-6">Flexters Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <MetricCard title="Today Sales" value={`₨ ${stats.todaySales}`} />
        <MetricCard title="Profit" value={`₨ ${stats.todayProfit}`} />
        <MetricCard title="Conversion" value={`${stats.conversionRate}%`} />
        <MetricCard title="Top Product" value={stats.topProduct} />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-10">
        <div className="col-span-2">
          <SalesChart data={sales} />
        </div>
        <TopProductsTable products={products} />
      </div>
    </section>
  );
}

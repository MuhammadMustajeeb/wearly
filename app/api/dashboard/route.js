import { auth } from "@clerk/nextjs/server";
import {
  getDashboardStats,
  getLast7DaysSales,
  getTopProducts,
} from "@/lib/dashboardQueries";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [stats, sales, products] = await Promise.all([
    getDashboardStats(),
    getLast7DaysSales(),
    getTopProducts(),
  ]);

  return Response.json({ stats, sales, products });
}

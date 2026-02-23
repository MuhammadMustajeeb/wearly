import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

/* ---------------- DASHBOARD METRICS ---------------- */
export async function getDashboardStats() {
  await connectDB();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const ordersToday = await Order.find({
    createdAt: { $gte: todayStart },
    status: "paid",
  });

  const todaySales = ordersToday.reduce((sum, o) => sum + o.total, 0);
  const todayProfit = ordersToday.reduce((sum, o) => sum + (o.profit || 0), 0);

  // placeholder until analytics is wired
  const totalVisitors = 500;
  const conversionRate = totalVisitors
    ? ((ordersToday.length / totalVisitors) * 100).toFixed(2)
    : "0.00";

  const topProductAgg = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        qty: { $sum: "$items.quantity" },
      },
    },
    { $sort: { qty: -1 } },
    { $limit: 1 },
  ]);

  const topProduct = topProductAgg.length
    ? await Product.findById(topProductAgg[0]._id).select("name")
    : null;

  return {
    todaySales,
    todayProfit,
    conversionRate,
    topProduct: topProduct?.name || "—",
  };
}

/* ---------------- LAST 7 DAYS SALES ---------------- */
export async function getLast7DaysSales() {
  await connectDB();

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const sales = await Promise.all(
    days.map(async (day) => {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const orders = await Order.find({
        createdAt: { $gte: day, $lt: nextDay },
        // status: "paid",
      });

      return {
        date: day.toLocaleDateString("en-GB", { weekday: "short" }),
        sales: orders.reduce((sum, o) => sum + o.total, 0),
      };
    })
  );

  return sales.reverse();
}

/* ---------------- TOP PRODUCTS ---------------- */
export async function getTopProducts() {
  await connectDB();

  return await Product.find()
    .sort({ sold: -1 })
    .limit(5)
    .select("name price sold");
}

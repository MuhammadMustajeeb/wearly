import User from "@/models/User";

export const isVerifiedBuyer = async (clerkId, productId) => {
  if (!clerkId) return false;

  const user = await User.findOne({ clerkId });

  if (!user) return false;

  return user.orders?.some(order =>
    order.items.some(item => item.product.toString() === productId)
  );
};
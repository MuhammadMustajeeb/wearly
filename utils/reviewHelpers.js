import User from "@/models/User";

export const isAdminByClerkId = async (clerkId) => {
  if (!clerkId) return false;
  const user = await User.findOne({ clerkId });
  return user?.role === "admin"; // adjust according to your user model
};

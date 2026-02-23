// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return auth().redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

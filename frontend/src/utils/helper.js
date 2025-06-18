// whenever the react reloads the reducers and again comes to initial state were user = null , and isAuthenticated = false so this reason we have to make the route for backend to get current user 
import { redirect } from "@tanstack/react-router";
import { login } from "../store/slice/slice";
import { getCurrentUser } from "../api/user.api";

export const checkAuth = async ({ context }) => {
  try {
    const { queryClient, reduxStore } = context;
    
    const user = await queryClient.ensureQueryData({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // If no user, redirect immediately
    if (!user) return redirect({ to: "/auth" });

    // Update Redux state
    reduxStore.dispatch(login(user));
    
    return true;
    
  } catch (error) {
    console.error("Authentication check failed:", error);
    
    // Handle specific error cases
    if (error?.response?.status === 401) {
      return redirect({ to: "/auth" });
    }
    
    // For other errors, consider showing error page
    return redirect({ 
      to: "/error",
      search: { message: "Authentication service unavailable" }
    });
  }
};
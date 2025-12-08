import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetUserInfo } from "../hooks/useAuth";
import PageLoader from "../components/Loader/PageLoader";
import DashboardLayout from "../components/layout/DashboardLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { data: user, isLoading, error } = useGetUserInfo();

  // If no token, redirect immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Show loader while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // If error or no user, token is invalid - redirect to root
  if (error || !user) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // User is authenticated, render protected route
  return <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>;
};

export default ProtectedRoute;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetUserInfo } from "../hooks/useAuth";
import PageLoader from "../components/Loader/PageLoader";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { data: user, isLoading } = useGetUserInfo();

  // If no token, show public page immediately
  if (!token) {
    return <>{children ? children : <Outlet />}</>;
  }

  // If token exists, check if it's valid while loading
  if (isLoading) {
    return <PageLoader />;
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    const from =
      (location.state as { from?: Location })?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Token exists but invalid/no user - show public page
  return <>{children ? children : <Outlet />}</>;
};

export default PublicRoute;

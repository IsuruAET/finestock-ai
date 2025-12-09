import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import PageLoader from "../components/Loader/PageLoader";
import DashboardLayout from "../components/layout/DashboardLayout";

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated, error } = useAuthContext();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !user || error) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>;
};

export default ProtectedRoute;

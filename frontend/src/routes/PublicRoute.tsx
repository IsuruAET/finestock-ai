import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import PageLoader from "../components/Loader/PageLoader";

const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated && user) {
    const from =
      (location.state as { from?: Location })?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default PublicRoute;

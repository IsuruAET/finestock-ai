import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import PageLoader from "../components/Loader/PageLoader";

// Lazy load components to trigger Suspense
// Public routes
const LandingPage = lazy(() => import("../pages/Landing/LandingPage"));
const SignUpPage = lazy(() => import("../pages/Auth/SignUpPage"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
// Protected routes
const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const SupplyRequestPage = lazy(
  () => import("../pages/SupplyRequest/SupplyRequestPage")
);
const CreateSupplyRequest = lazy(
  () => import("../pages/SupplyRequest/CreateSupplyRequest")
);
const SupplyRequestDetail = lazy(
  () => import("../pages/SupplyRequest/SupplyRequestDetail")
);
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Supply request routes */}
          <Route path="/supply-request" element={<SupplyRequestPage />} />
          <Route path="/supply-request/new" element={<CreateSupplyRequest />} />
          <Route path="/supply-request/:id" element={<SupplyRequestDetail />} />

          {/* Profile routes */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

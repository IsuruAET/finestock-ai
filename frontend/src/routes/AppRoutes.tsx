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
const PurchaseOrderPage = lazy(
  () => import("../pages/PurchaseOrder/PurchaseOrderPage")
);
const CreatePurchaseOrder = lazy(
  () => import("../pages/PurchaseOrder/CreatePurchaseOrder")
);
const PurchaseOrderDetail = lazy(
  () => import("../pages/PurchaseOrder/PurchaseOrderDetail")
);
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Purchase order routes */}
          <Route path="/purchase-order" element={<PurchaseOrderPage />} />
          <Route path="/purchase-order/new" element={<CreatePurchaseOrder />} />
          <Route path="/purchase-order/:id" element={<PurchaseOrderDetail />} />

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

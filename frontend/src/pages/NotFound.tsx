import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, FileText } from "lucide-react";

import Button from "../components/ui/Button";
import FSLink from "../components/ui/FSLink";
import notFoundImage from "../assets/images/not-found.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-card">
        <div>
          <div className="page-logo" onClick={() => navigate("/")}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="page-title">
            404 — Page not found
          </h2>
          <p className="page-subtitle">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <img
            src={notFoundImage}
            alt="404 not found"
            className="w-full max-w-xs sm:max-w-sm"
            loading="lazy"
          />
        </div>

        <div className="space-y-3 sm:space-y-4 mt-8">
          <Button
            variant="primary"
            size="lg"
            className="btn-primary w-full"
            icon={Home}
            onClick={() => navigate("/")}
          >
            Back to home
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Or <FSLink to="/dashboard">jump to your dashboard</FSLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

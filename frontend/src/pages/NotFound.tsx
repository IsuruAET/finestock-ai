import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, FileText } from "lucide-react";

import Button from "../components/ui/Button";
import FSLink from "../components/ui/FSLink";
import notFoundImage from "../assets/images/not-found.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="w-12 h-12 bg-linear-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            404 — Page not found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src={notFoundImage}
            alt="404 not found"
            className="w-full max-w-xs"
            loading="lazy"
          />
        </div>

        <div className="space-y-4">
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

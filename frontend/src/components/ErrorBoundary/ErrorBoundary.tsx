import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import Button from "../ui/Button";
import FSLink from "../ui/FSLink";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div className="page-container">
        <div className="page-card">
          <div>
            <div className="page-logo">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="page-title">
              Something went wrong
            </h2>
            <p className="page-subtitle">
              {this.state.error?.message ||
                "We hit an unexpected error. You can try again or head back home."}
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 mt-8">
            <Button
              onClick={this.handleReset}
              variant="primary"
              size="lg"
              className="btn-primary w-full"
              icon={RotateCcw}
            >
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              size="lg"
              className="w-full"
              icon={Home}
            >
              Go home
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Debug details
            </p>
            <p className="text-xs text-gray-600 break-words">
              {this.state.error?.name || "Error"} —{" "}
              {this.state.error?.message || "Unexpected error"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

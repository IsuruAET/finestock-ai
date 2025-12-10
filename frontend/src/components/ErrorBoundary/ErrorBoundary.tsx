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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <div className="w-12 h-12 bg-linear-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {this.state.error?.message ||
                "We hit an unexpected error. You can try again or head back home."}
            </p>
          </div>

          <div className="space-y-4">
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

import { Component, type ErrorInfo, type ReactNode } from "react";

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
      <div className="fixed inset-0 bg-[#f7f7f8] text-gray-700 px-4 py-8">
        <div className="mx-auto flex h-full max-w-xl items-center">
          <div className="w-full rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_18px_45px_-18px_rgba(17,24,39,0.2)] p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#FF9324]">
                <span className="text-2xl" aria-hidden>
                  ⚠️
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-primary">
                  Finestock AI
                </p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Something went wrong
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-800 leading-relaxed">
              {this.state.error?.message ||
                "We hit an unexpected error. You can try again or head back home."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Go home
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-xs text-gray-700">
              <p className="font-semibold">Debug details</p>
              <p className="mt-1 wrap-break-word">
                {this.state.error?.name || "Error"} —{" "}
                {this.state.error?.message || "Unexpected error"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

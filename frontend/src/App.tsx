import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ToastContainer from "./components/ToastContainer/ToastContainer";

import { AuthProvider } from "./context/AuthProvider";
import { QueryProvider } from "./context/QueryProvider";
import { ThemeProvider } from "./context/ThemeProvider";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <AppRoutes />
              <ToastContainer />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;

import { Toaster } from "react-hot-toast";
import { useTheme } from "../../hooks/useTheme";

const ToastContainer = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      toastOptions={{
        className: "toast-notification",
        style: {
          fontSize: "13px",
          background: theme === "dark" ? "#0b1224" : "#fbfbfb",
          color: theme === "dark" ? "#e5e7eb" : "#1f2937",
          border: `1px solid ${theme === "dark" ? "#1f2937" : "#e5e7eb"}`,
          boxShadow:
            theme === "dark"
              ? "0 14px 35px rgba(0, 0, 0, 0.35)"
              : "0 14px 35px rgba(15, 23, 42, 0.08)",
        },
      }}
    />
  );
};

export default ToastContainer;

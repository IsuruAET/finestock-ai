import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  icon: Icon,
  className,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeClasses = {
    sm: "px-3 py-1 h-8 text-sm",
    md: "px-4 py-2 h-10 text-sm",
    lg: "px-6 py-3 h-12 text-base",
  };

  const variantClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 text-white",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    link: "bg-transparent hover:bg-transparent text-slate-700 hover:text-slate-900",
    outline:
      "bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-200",
  };

  const mergedClassName = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  );
  return (
    <button className={mergedClassName} {...props} disabled={isLoading}>
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default Button;

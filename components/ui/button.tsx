import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 inline-flex items-center justify-center",
          variants[variant],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";

// components/ui/Button.tsx
"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  type = "button",
}: ButtonProps) {
  const baseClasses = "font-bold transition-all flex items-center justify-center";
  
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    default: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    default: "bg-black text-white border-4 border-black hover:bg-white hover:text-black",
    outline: "bg-white text-black border-4 border-black hover:bg-gray-100",
    destructive: "bg-red-600 text-white border-4 border-black hover:bg-red-700",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? disabledClasses : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
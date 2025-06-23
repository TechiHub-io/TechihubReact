// src/components/ui/Button.jsx
import React from 'react';
import { cn } from '@/lib/utils';

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#0CCE68] text-white hover:bg-[#0BBE58] focus-visible:ring-[#0CCE68]",
    secondary: "bg-[#364187] text-white hover:bg-[#2F3875] focus-visible:ring-[#364187]",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 focus-visible:ring-[#0CCE68]",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 focus-visible:ring-[#0CCE68]",
    link: "text-[#0CCE68] underline-offset-4 hover:underline focus-visible:ring-[#0CCE68] bg-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  };
  
  const sizes = {
    sm: "h-8 px-3 py-1 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-3 text-base"
  };
  
  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
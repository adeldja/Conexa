import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const baseClasses = "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
    const errorClasses = error 
      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
      : "border-gray-200 focus:border-blue-500";
    
    return (
      <input
        type={type}
        className={[baseClasses, errorClasses, className].filter(Boolean).join(' ')}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

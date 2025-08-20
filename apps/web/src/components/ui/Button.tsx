import React from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base classes
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          
          // Variant classes
          {
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl": variant === 'primary',
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500": variant === 'secondary',
            "border-2 border-gray-200 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500": variant === 'outline',
            "text-gray-700 hover:bg-gray-100 focus:ring-gray-500": variant === 'ghost',
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl": variant === 'danger',
          },
          
          // Size classes
          {
            "h-9 px-3 text-sm": size === 'sm',
            "h-11 px-4 text-base": size === 'md',
            "h-13 px-6 text-lg": size === 'lg',
            "h-16 px-8 text-xl": size === 'xl',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

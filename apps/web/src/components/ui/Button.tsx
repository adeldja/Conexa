import React from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base classes
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          
          // Variant classes
          {
            "bg-gradient-to-r from-[#1D4FFF] to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-[#1D4FFF]/50 shadow-lg hover:shadow-xl": variant === 'primary',
            "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500": variant === 'secondary',
            "border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500": variant === 'outline',
            "text-slate-600 hover:bg-slate-100 focus:ring-slate-500": variant === 'ghost',
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
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

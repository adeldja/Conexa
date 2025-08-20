import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    const baseClasses = "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white";
    const errorClasses = error 
      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
      : "border-gray-200 focus:border-blue-500";
    
    return (
      <div className="relative">
        <select
          className={[baseClasses, errorClasses, className].filter(Boolean).join(' ')}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

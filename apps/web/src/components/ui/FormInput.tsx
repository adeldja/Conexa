import React from 'react';
import { Input, InputProps } from './Input';

interface FormInputProps extends Omit<InputProps, 'error'> {
  label?: string;
  error?: string;
  required?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Input ref={ref} error={!!error} className={className} {...props} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
export type { FormInputProps };

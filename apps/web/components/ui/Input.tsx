import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefixSymbol?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  prefixSymbol,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-xs w-full">
      <label className="font-label-bold text-label-bold text-on-surface" htmlFor={id}>
        {label}
      </label>
      <div className="relative w-full">
        {prefixSymbol && (
          <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">
            {prefixSymbol}
          </span>
        )}
        <input
          id={id}
          className={`w-full border border-outline-variant bg-surface-bright rounded px-sm py-sm text-body-md focus:border-2 focus:border-primary focus:outline-none transition-all ${
            prefixSymbol ? 'pl-lg' : ''
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
export default Input;

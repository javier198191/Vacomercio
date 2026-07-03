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
      <label className="font-sans font-bold text-vc-black" htmlFor={id}>
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
          className={`w-full border border-vc-gray-mid bg-vc-white text-vc-black rounded-lg px-4 py-2 font-sans focus:border-vc-black focus:outline-none transition-all ${
            prefixSymbol ? 'pl-lg' : ''
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
export default Input;

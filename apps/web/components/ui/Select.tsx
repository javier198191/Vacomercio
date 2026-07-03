import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-xs w-full">
      {label && (
        <label className="font-sans font-bold text-vc-black" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full border border-vc-gray-mid bg-vc-white text-vc-black rounded-lg px-4 py-2 font-sans focus:border-vc-black focus:outline-none transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default Select;

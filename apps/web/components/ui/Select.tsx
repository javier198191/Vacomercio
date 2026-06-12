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
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full border border-outline-variant bg-surface-bright rounded px-sm py-sm text-body-md focus:border-2 focus:border-primary focus:outline-none transition-all ${className}`}
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

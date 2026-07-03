import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-label-bold text-label-bold rounded-lg px-md py-sm min-h-[48px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-vc-black text-vc-white font-bold rounded-lg px-6 py-3 hover:bg-vc-gray-dark',
    secondary: 'bg-vc-white border border-vc-black text-vc-black font-bold rounded-lg hover:bg-vc-gray-light',
    ghost: 'bg-transparent text-vc-black font-bold hover:bg-vc-gray-light rounded-lg px-6 py-3',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;

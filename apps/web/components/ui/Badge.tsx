import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const baseStyle = 'inline-block px-sm py-xs rounded text-label-sm font-label-bold uppercase tracking-wide';
  
  const variants = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    error: 'bg-error-container text-on-error-container',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;

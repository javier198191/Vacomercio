import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col';
  const hoverStyle = hoverEffect ? 'hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-shadow duration-200' : '';

  return (
    <div className={`${baseStyle} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
export default Card;

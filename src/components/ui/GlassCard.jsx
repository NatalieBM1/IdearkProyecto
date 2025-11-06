import React from 'react';

const GlassCard = ({ 
  children, 
  className = '', 
  blur = 20, 
  opacity = 0.25,
  onClick,
  hover = true,
  ...props 
}) => {
  const baseClasses = `
    backdrop-blur-glass 
    border border-ideark-glass-border 
    rounded-modern 
    transition-all 
    duration-300
  `;
  
  const hoverClasses = hover ? 'hover:shadow-floating hover:-translate-y-1 hover:scale-[1.02]' : '';
  
  const backgroundStyle = {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  };

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={backgroundStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
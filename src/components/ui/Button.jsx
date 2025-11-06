import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-pill
    transition-all duration-300
    transform focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-ideark-slate-700 to-ideark-slate-800 
      hover:from-ideark-slate-600 hover:to-ideark-slate-700 
      text-white shadow-soft
      hover:shadow-floating hover:scale-105
      focus:ring-ideark-slate-500/30
    `,
    secondary: `
      bg-white hover:bg-ideark-slate-50 
      text-ideark-slate-700 border-2 border-ideark-slate-200 
      hover:border-ideark-slate-300 shadow-soft
      hover:shadow-floating hover:scale-105
      focus:ring-ideark-slate-200/50
    `,
    success: `
      bg-gradient-to-r from-ideark-primary to-ideark-secondary 
      hover:from-ideark-secondary hover:to-ideark-primary 
      text-white shadow-soft
      hover:shadow-floating hover:scale-105
      focus:ring-ideark-primary/30
    `,
    warning: `
      bg-gradient-to-r from-ideark-warning to-amber-400 
      hover:from-amber-400 hover:to-ideark-warning 
      text-white shadow-soft
      hover:shadow-floating hover:scale-105
      focus:ring-ideark-warning/30
    `,
    error: `
      bg-gradient-to-r from-ideark-error to-red-400 
      hover:from-red-400 hover:to-ideark-error 
      text-white shadow-soft
      hover:shadow-floating hover:scale-105
      focus:ring-ideark-error/30
    `,
    ghost: `
      bg-transparent hover:bg-ideark-slate-100/50 
      text-ideark-slate-600 hover:text-ideark-slate-700
      hover:scale-105
      focus:ring-ideark-slate-200/30
    `,
    outline: `
      bg-transparent border-2 border-ideark-slate-300 
      text-ideark-slate-600 hover:bg-ideark-slate-50 
      hover:border-ideark-slate-400 hover:text-ideark-slate-700 shadow-soft
      hover:shadow-floating hover:scale-105
      focus:ring-ideark-slate-200/50
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
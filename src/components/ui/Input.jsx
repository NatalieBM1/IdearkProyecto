import React, { forwardRef } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  containerClassName = '',
  icon: Icon,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseInputClasses = `
    w-full px-4 py-3 
    border-2 rounded-modern
    bg-white text-ideark-dark-gray
    placeholder-ideark-dark-gray
    transition-all duration-300
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
    : isFocused
    ? 'border-ideark-primary focus:border-ideark-primary focus:ring-ideark-primary/20'
    : 'border-ideark-light-gray hover:border-ideark-medium-gray';

  const iconPadding = Icon ? 'pl-12' : '';
  const passwordTogglePadding = showPasswordToggle ? 'pr-12' : '';

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-ideark-dark-gray">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-ideark-medium-gray" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={`
            ${baseInputClasses}
            ${stateClasses}
            ${iconPadding}
            ${passwordTogglePadding}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-ideark-medium-gray hover:text-ideark-dark-gray transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-ideark-medium-gray hover:text-ideark-dark-gray transition-colors" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
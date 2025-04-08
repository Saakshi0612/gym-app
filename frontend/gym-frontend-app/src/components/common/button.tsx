// src/components/common/Button.tsx
import { ButtonProps } from '../../types/components/common.types';

const variants = {
  primary: 'bg-lime-400 hover:bg-lime-500 text-black',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

// Define a type for the variant keys
type VariantKey = keyof typeof variants;

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold py-3 px-4 rounded-md transition-colors';
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Fix the type issue with variant lookup
  const variantClass = variants[variant as VariantKey] || variants.primary;
  
  const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${widthClass} ${variantClass} ${loadingClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <div className="flex items-center justify-center">
        {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
        {isLoading ? loadingText || 'Loading...' : children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </div>
    </button>
  );
}
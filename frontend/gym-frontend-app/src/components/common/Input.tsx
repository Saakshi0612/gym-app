// src/components/common/Input.tsx
import React from 'react';
import { InputProps } from '../../types/components/common.types';

const Input: React.FC<InputProps> = ({
  label,
  name,
  register,
  error,
  helpText,
  icon,
  rightElement,
  className = '',
  type = 'text',
  placeholder,
  ...rest
}) => {
  return (
    <div className="w-full mb-4">
      <div className="relative">
        {label && (
          <label
            htmlFor={name}
            className="absolute -top-2.5 left-3 px-1 bg-white text-sm font-lexend text-neutral-700"
          >
            {label}
          </label>
        )}
 
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          {...register}
          className={`w-full px-4 py-3.5 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg ${
            icon ? 'pl-11' : ''
          } ${
            rightElement ? 'pr-11' : ''
          } focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-gray-300
          placeholder:text-neutral-600 text-gray-700 bg-white ${className}`}
          {...rest}
        />
 
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center font-lexend text-neutral-600">
            {rightElement}
          </div>
        )}
      </div>
 
      {error ? (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-neutral-600 mt-1 font-lexend">{helpText}</p>
      ) : null}
    </div>
  );
};

export default Input;
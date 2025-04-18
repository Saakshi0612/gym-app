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
    <div className="w-full">
      <div className="relative">
        {label && (
          <label
            htmlFor={name}
            className="absolute -top-2 left-3 px-1 bg-white text-[13px] font-lexend text-neutral-700"
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
          className={`w-full px-4 py-3.5 border ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-lg ${icon ? 'pl-11' : ''} ${
            rightElement ? 'pr-11' : ''
          } focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-gray-300
          placeholder:text-neutral-550 text-gray-700 bg-white text-[14px] ${className}`}
          {...rest}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center font-lexend text-neutral-600">
            {rightElement}
          </div>
        )}
      </div>

      {/* ✅ Only one consistent spacing below input */}
      {(error || helpText) && (
        <div className="mt-1">
          {error ? (
            <p className="text-xs text-red-500 font-lexend whitespace-pre-line">
              {error}
            </p>
          ) : (
            <p className="text-xs text-neutral-600 font-lexend">{helpText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;

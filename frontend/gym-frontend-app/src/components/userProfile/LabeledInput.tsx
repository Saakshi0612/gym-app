import React, { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface LabeledInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  autoComplete?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = false,
  errorMessage,
  className = "",
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative space-y-2">
      <label
        htmlFor={name}
        className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#323A3A] z-10"
      >
        {label}
      </label>
      <div className="relative mt-4">
        <input
          id={name}
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full h-16 px-4 pr-14 text-base text-[#323A3A] placeholder:text-gray-400 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
            error 
              ? "border-red-500 focus:ring-red-500" 
              : "border-[#DADADA] focus:ring-[#9ef300]"
          } [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${className}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-10 flex items-center justify-center text-[#666] hover:text-[#000]"
            onClick={togglePasswordVisibility}
            aria-label={`Toggle ${label} visibility`}
          >
            {showPassword ? (
              <EyeOff size={24} strokeWidth={2.5} />
            ) : (
              <Eye size={24} strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
      {error && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default LabeledInput; 
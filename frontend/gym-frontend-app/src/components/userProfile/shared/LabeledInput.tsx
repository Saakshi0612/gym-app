import React, { useState, useCallback, memo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface LabeledInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "input" | "textarea" | "password";
  hint?: string;
  rows?: number;
  validation?: (value: string) => string | null;
  showStrengthIndicator?: boolean;
}

interface ErrorMessageProps {
  error: string;
  id: string;
}

// Memoized error message component to prevent unnecessary re-renders
const ErrorMessage = memo(({ error, id }: ErrorMessageProps) => {
  // Common validation messages
  const isRequired = error.includes("required");
  const isInvalidFormat = error.includes("invalid") || error.includes("format");
  const isTooShort = error.includes("too short");
  const isTooLong = error.includes("too long");

  // Field-specific messages
  const getFieldSpecificMessage = (): string => {
    switch (id) {
      case "firstName":
      case "lastName":
        if (error.includes("numbers")) {
          return "Name cannot contain numbers";
        }
        if (error.includes("special characters")) {
          return "Name cannot contain special characters";
        }
        if (error.includes("consecutive")) {
          return "Name cannot contain consecutive spaces or hyphens";
        }
        if (error.includes("start or end")) {
          return "Name cannot start or end with a space or hyphen";
        }
        if (error.includes("exceed")) {
          return "Name cannot exceed 50 characters";
        }
        if (error.includes("required")) {
          return "Name is required";
        }
        return error;
      
      case "email":
        if (isRequired) return "Email address is required";
        if (isInvalidFormat) return "Please enter a valid email address";
        return "Please enter a valid email address";
      
      case "phoneNumber":
        if (isRequired) return "Phone number is required";
        if (isInvalidFormat) return "Please enter a valid phone number";
        return "Please enter a valid phone number";
      
      case "title":
        if (isRequired) return "Professional title is required";
        if (isTooShort) return "Title must be at least 3 characters long";
        if (isTooLong) return "Title cannot exceed 50 characters";
        return "Please enter a valid title";
      
      case "about":
        if (isRequired) return "Description is required";
        if (isTooShort) return "Description must be at least 10 characters long";
        if (isTooLong) return "Description cannot exceed 500 characters";
        return "Please enter a valid description";
      
      case "preferableActivity":
        if (isRequired) return "Activity type is required";
        return "Please select a valid activity type";
      
      case "targets":
        if (isRequired) return "Fitness target is required";
        return "Please select a valid target";

      case "password":
      case "oldPassword":
      case "newPassword":
      case "confirmPassword":
        // Return the specific error message without additional context
        return error;
      
      default:
        if (isRequired) return "This field is required";
        if (isInvalidFormat) return "Please check the format and try again";
        return "Please enter a valid value";
    }
  };

  return (
    <div className="mt-1">
      <p className="text-red-600 text-xs">{getFieldSpecificMessage()}</p>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

const LabeledInput: React.FC<LabeledInputProps> = ({
  id,
  label,
  value,
  placeholder = "",
  onChange,
  type = "input",
  hint,
  rows = 5,
  validation,
  showStrengthIndicator = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = showStrengthIndicator ? getStrength(value) : 0;

  const sharedClassNames = "w-full px-3 py-2 text-sm md:text-base font-light transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green";
  
  const inputStyles = error
    ? `${sharedClassNames} border border-semantic-red focus:border-semantic-red focus:ring-semantic-red bg-white h-12 md:h-16`
    : `${sharedClassNames} border border-neutral-400 focus:border-primary-green focus:ring-primary-green bg-white h-12 md:h-16`;
  
  const textAreaStyles = error
    ? `${sharedClassNames} border border-semantic-red focus:border-semantic-red focus:ring-semantic-red bg-white min-h-[120px] resize-y`
    : `${sharedClassNames} border border-neutral-400 focus:border-primary-green focus:ring-primary-green bg-white min-h-[120px] resize-y`;

  // Memoize handlers to prevent unnecessary re-renders
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Perform validation if a validation function is provided
    if (validation) {
      const errorMessage = validation(newValue);
      setError(errorMessage);
    }
  }, [onChange, validation]);

  const handleBlur = useCallback(() => {
    // Perform validation on blur if a validation function is provided
    if (validation) {
      const errorMessage = validation(value);
      setError(errorMessage);
    }
  }, [validation, value]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="relative w-full mt-4">
      {/* Top floating label */}
      <label
        htmlFor={id}
        className="absolute -top-3 left-3 bg-white px-1 text-xs md:text-sm text-[#323A3A] z-10"
      >
        {label}
      </label>

      {/* Input / Textarea without placeholder */}
      <div className="relative mt-4">
        {type === "textarea" ? (
          <textarea
            id={id}
            rows={rows}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={textAreaStyles}
          />
        ) : (
          <input
            id={id}
            type={id === "phoneNumber" ? "tel" : type === "password" ? (showPassword ? "text" : "password") : "text"}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputStyles} [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden`}
            autoComplete={type === "password" ? "new-password" : undefined}
            required
            minLength={type === "password" ? 8 : undefined}
            pattern={id === "phoneNumber" ? "[0-9]*" : undefined}
            inputMode={id === "phoneNumber" ? "numeric" : undefined}
          />
        )}
        
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

      {/* Optional hint */}
      {hint && <p className="text-caption-2 mt-1">{hint}</p>}

      {/* Placeholder below input (slightly inside) */}
      {placeholder && (
        <p className="text-caption-2 mt-1 text-neutral-500 pl-3">{placeholder}</p>
      )}

      {/* Password strength indicator */}
      {showStrengthIndicator && type === "password" && (
        <div className="w-full h-2 rounded bg-gray-200 mt-2">
          <motion.div
            className={`h-2 rounded transition-all ${
              strength === 1
                ? "bg-red-500 w-1/4"
                : strength === 2
                ? "bg-yellow-500 w-2/4"
                : strength === 3
                ? "bg-[#C6F500] w-3/4"
                : strength >= 4
                ? "bg-[#9ef300] w-full"
                : "bg-gray-200 w-0"
            }`}
          />
        </div>
      )}

      {/* Password requirements hint - only show when no error */}
      {type === "password" && !error && (
        <p className="text-xs text-[#666] pt-1">
          {id === "oldPassword" 
            ? "Enter current password"
            : id === "newPassword"
              ? "Enter new password"
              : id === "confirmPassword"
                ? "Re-enter new password"
                : "Password must be 8-16 characters with uppercase, lowercase, numbers, and special characters (!@#$%^&*)"}
        </p>
      )}

      {/* Display error message if validation fails */}
      {error && <ErrorMessage error={error} id={id} />}
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(LabeledInput);
LabeledInput.displayName = 'LabeledInput';

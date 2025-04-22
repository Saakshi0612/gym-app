import React, { useState, useCallback, memo, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LabeledInputProps {
  id?: string;
  name?: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "input" | "textarea" | string;
  hint?: string;
  rows?: number;
  validation?: (value: string) => string | null;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  autoComplete?: string;
  showPlaceholderAsHint?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const labelVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1
    }
  }
};

const inputVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2
    }
  },
  focus: {
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const hintVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3
    }
  }
};

const errorVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Memoized error message component
const ErrorMessage = memo(({ error }: { error: string }) => {
  return (
    <motion.div 
      className="mt-1"
      variants={errorVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <p className="text-red-600 text-xs">{error}</p>
      {error === "Name cannot contain numbers" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Example: "John Smith" (not "John123")
        </p>
      )}
      {error === "Name cannot contain special characters" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Example: "John Smith" (not "John@Smith")
        </p>
      )}
      {error === "Name cannot contain consecutive spaces or hyphens" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Example: "John Smith" (not "John  Smith" or "Jean--Pierre")
        </p>
      )}
      {error === "Name cannot start or end with a space or hyphen" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Example: "John Smith" (not " John Smith" or "John Smith ")
        </p>
      )}
      {error === "Name must be at least 2 characters long" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Example: "John" (not "J")
        </p>
      )}
      {error === "Name cannot exceed 50 characters" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Please use a shorter name
        </p>
      )}
      {error === "Name is required" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Please enter your name
        </p>
      )}
    </motion.div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

const LabeledInput: React.FC<LabeledInputProps> = ({
  id,
  name,
  label,
  value,
  placeholder = "",
  onChange,
  type = "input",
  hint,
  rows = 5,
  validation,
  required = false,
  error = false,
  errorMessage,
  className = "",
  autoComplete,
  showPlaceholderAsHint = false,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const sharedInputClassNames = "w-full px-4 pr-14 text-base text-[#323A3A] placeholder:text-gray-400 border rounded-lg focus:outline-none focus:ring-2 bg-white";
  const inputHeightClass = "h-16";
  
  const inputStyles = error || validationError
    ? `${sharedInputClassNames} ${inputHeightClass} border-red-500 focus:ring-red-500`
    : `${sharedInputClassNames} ${inputHeightClass} border-[#DADADA] focus:ring-[#9ef300]`;
  
  const textAreaStyles = error || validationError
    ? `${sharedInputClassNames} border-red-500 focus:ring-red-500 min-h-[120px] py-3 resize-y`
    : `${sharedInputClassNames} border-[#DADADA] focus:ring-[#9ef300] min-h-[120px] py-3 resize-y`;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (validation) {
      const errorMessage = validation(newValue);
      setValidationError(errorMessage);
    }
  }, [onChange, validation]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (validation) {
      const errorMessage = validation(value);
      setValidationError(errorMessage);
    }
  }, [validation, value]);

  const handleFocus = () => setIsFocused(true);

  const inputId = id || name;

  return (
    <motion.div 
      className="relative space-y-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        <motion.label
          htmlFor={inputId}
          className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-[#323A3A] z-10"
          variants={labelVariants}
        >
          {label}
        </motion.label>

        <motion.div 
          className="mt-4"
          variants={inputVariants}
          animate={isFocused ? "focus" : "visible"}
        >
          {type === "textarea" ? (
            <motion.textarea
              id={inputId}
              name={name}
              rows={rows}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={textAreaStyles}
              placeholder={showPlaceholderAsHint ? "" : placeholder}
              required={required}
              autoComplete={autoComplete}
              whileFocus="focus"
            />
          ) : (
            <motion.input
              id={inputId}
              name={name}
              type={type}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={`${inputStyles} ${className}`}
              placeholder={showPlaceholderAsHint ? "" : placeholder}
              required={required}
              autoComplete={autoComplete}
              whileFocus="focus"
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {(showPlaceholderAsHint && placeholder) && (
          <motion.p 
            className="text-xs text-[#666] pl-4"
            variants={hintVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {placeholder}
          </motion.p>
        )}
        {!showPlaceholderAsHint && hint && (
          <motion.p 
            className="text-xs text-[#666] pl-4"
            variants={hintVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {hint}
          </motion.p>
        )}

        {(error && errorMessage) && (
          <motion.p 
            className="text-red-500 text-sm mt-1 pl-4"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {errorMessage}
          </motion.p>
        )}
        {validationError && <ErrorMessage error={validationError} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(LabeledInput);

import React, { useState, useCallback, memo } from "react";

interface LabeledInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "input" | "textarea";
  hint?: string;
  rows?: number;
  validation?: (value: string) => string | null;
}

// Memoized error message component to prevent unnecessary re-renders
const ErrorMessage = memo(({ error }: { error: string }) => {
  return (
    <div className="mt-1">
      <p className="text-red-600 text-xs">{error}</p>
      {error === "Name can only contain letters, spaces, and hyphens" && (
        <p className="text-xs text-neutral-500 mt-0.5">
          Example: "John Smith" or "Jean-Pierre"
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
}) => {
  const [error, setError] = useState<string | null>(null);

  // Pre-compute styles based on error state
  const inputStyles = `w-full border rounded-md px-3 text-body text-[0.875rem] focus:outline-none h-16 ${
    error 
      ? "border-red-500 focus:ring-2 focus:ring-red-500" 
      : "border-[var(--color-neutral-400)] focus:ring-2 focus:ring-[var(--color-semantic-blue)]"
  }`;

  const textAreaStyles = `w-full border rounded-md px-3 text-body text-[0.875rem] focus:outline-none h-16 resize-none pt-3 pb-2 ${
    error 
      ? "border-red-500 focus:ring-2 focus:ring-red-500" 
      : "border-[var(--color-neutral-400)] focus:ring-2 focus:ring-[var(--color-primary-green)]"
  }`;

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

  return (
    <div className="relative w-full mt-4">
      {/* Top floating label */}
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 bg-[var(--color-primary-white)] px-1 text-caption z-10"
      >
        {label}
      </label>

      {/* Input / Textarea without placeholder */}
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
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputStyles}
        />
      )}

      {/* Optional hint */}
      {hint && <p className="text-caption-2 mt-1">{hint}</p>}

      {/* Placeholder below input (slightly inside) */}
      {placeholder && (
        <p className="text-caption-2 mt-1 text-neutral-500 pl-3">{placeholder}</p>
      )}

      {/* Display error message if validation fails */}
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(LabeledInput);

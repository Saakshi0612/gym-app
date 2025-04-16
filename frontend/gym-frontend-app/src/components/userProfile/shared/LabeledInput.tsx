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

  const sharedClassNames = "w-full px-3 py-2 text-base font-light transition-all duration-200 ease-out rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green";
  
  const inputStyles = error
    ? `${sharedClassNames} border border-semantic-red focus:border-semantic-red focus:ring-semantic-red bg-white`
    : `${sharedClassNames} border border-neutral-400 focus:border-primary-green focus:ring-primary-green bg-white`;
  
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

  return (
    <div className="relative w-full mt-4">
      {/* Top floating label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700 mb-1"
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
      {error && (
        <p className="mt-1 text-sm text-semantic-red">{error}</p>
      )}
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(LabeledInput);

import React, { useState } from "react";

interface LabeledInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  type?: "input" | "textarea";
  hint?: string;
  rows?: number;
  validation?: (value: string) => string | null; // Add validation function
}

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

  const sharedClassNames =
    "w-full border border-[var(--color-neutral-400)] rounded-md px-3 py-2 text-body text-[0.875rem] focus:outline-none";

  const inputStyles =
    sharedClassNames + " focus:ring-2 focus:ring-[var(--color-semantic-blue)]";

  const textAreaStyles =
    sharedClassNames +
    " resize-none pt-3 pb-2 focus:ring-2 focus:ring-[var(--color-primary-green)]";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Perform validation if a validation function is provided
    if (validation) {
      const errorMessage = validation(newValue);
      setError(errorMessage); // Set error message
    }
  };

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
          className={textAreaStyles}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
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
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default LabeledInput;

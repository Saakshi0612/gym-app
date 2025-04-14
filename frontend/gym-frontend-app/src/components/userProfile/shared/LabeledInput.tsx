import React from "react";

interface LabeledInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string; 
  onChange: (value: string) => void;
  type?: "input" | "textarea";
  hint?: string;
  rows?: number;
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
}) => {
  const sharedClassNames =
    "w-full border border-[var(--color-neutral-400)] rounded-md px-3 py-2 text-body text-[0.875rem] focus:outline-none";

  const inputStyles =
    sharedClassNames + " focus:ring-2 focus:ring-[var(--color-semantic-blue)]";

  const textAreaStyles =
    sharedClassNames +
    " resize-none pt-3 pb-2 focus:ring-2 focus:ring-[var(--color-primary-green)]";

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
          onChange={(e) => onChange(e.target.value)}
          className={textAreaStyles}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputStyles}
        />
      )}

      {/* Optional hint */}
      {hint && <p className="text-caption-2 mt-1">{hint}</p>}

      {/* Placeholder below input (slightly inside) */}
      {placeholder && (
        <p className="text-caption-2 mt-1 text-neutral-500 pl-3">{placeholder}</p>
      )}
    </div>
  );
};

export default LabeledInput;

import React from "react";

interface FieldWrapperProps {
  children: React.ReactNode;
  error?: string;
  helpText?: string;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ children, error, helpText }) => {
  return (
    <div className="w-full mb-3 relative">
      {children}

      {error ? (
        <div
          className=" w-full   text-red-500 text-[12px] font-[lexend]   flex items-start gap-1"
          style={{
            animation: "fadeSlideDown 0.3s ease-out",
          }}
        >
          <svg
            className="w-3 h-3 mt-0.5 text-red-500 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-.01-10a9 9 0 110 18 9 9 0 010-18z"
            />
          </svg>
          <span className="whitespace-pre-line">{error}</span>
        </div>
      ) : helpText ? (
        <p
          className="text-xs text-neutral-600  font-lexend"
          style={{ animation: "fadeIn 0.3s ease-in" }}
        >
          {helpText}
        </p>
      ) : null}

      {/* Regular global style tag without jsx */}
      <style>
        {`
          @keyframes fadeSlideDown {
            0% {
              opacity: 0;
              transform: translateY(-5px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default FieldWrapper;

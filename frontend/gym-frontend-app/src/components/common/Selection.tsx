// components/common/DropdownField.tsx
import React, { useState, useRef, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import dropdownIcon from "../../assets/images/dropdown.svg";

interface DropdownFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register?: UseFormRegisterReturn;
  error?: string;
  onChange: (val: string) => void;
  value: string;
  containerClassName?: string;

  /** Optional: Enables dynamic dropdown max-height */
  useDynamicHeight?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  name,
  options,
  register,
  error,
  onChange,
  value,
  containerClassName,
  useDynamicHeight = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>(240); // default 15rem
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelection = (optionValue: string) => {
    onChange(optionValue);
    setIsDropdownOpen(false);
  };

  // 🔻 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧠 Optional: Set dynamic height based on screen space
  useEffect(() => {
    if (!useDynamicHeight) return;

    const updateHeight = () => {
      if (buttonRef.current) {
        const screenHeight = window.innerHeight;
        const bottom = buttonRef.current.getBoundingClientRect().bottom;
        setMaxHeight(screenHeight - bottom - 10); // 10px padding
      }
    };

    updateHeight(); // initial
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [useDynamicHeight]);

  return (
    <div className="relative" ref={dropdownRef}>
      <fieldset
        className={`border rounded-md border-[#DADADA] py-1 font-[lexend] text-[#323A3A] text-[14px] font-[300] leading-[20px] bg-white ${containerClassName || ""}`}
      >
        <legend className="block font-[lexend] text-[12px] font-[300] leading-[16px] ml-1 px-1 bg-white text-[#4B5563]">
          {label}
        </legend>

        <div className="relative h-full">
          <button
            ref={useDynamicHeight ? buttonRef : undefined}
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full p-2 pt-0 rounded bg-white flex justify-between items-center font-light"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            {value || `Select ${label}`}
            <img
              src={dropdownIcon}
              alt="Toggle Dropdown"
              className={`w-5 h-5 transition-transform duration-100 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <input type="hidden" name={name} value={value} {...register} />

          {isDropdownOpen && (
            <ul
              className={`absolute w-full font-lexend bg-white border border-gray-200 rounded shadow-lg mt-1 z-50 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-[#85878372] scrollbar-track-gray-100 scrollbar-rounded`}
              role="listbox"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {options.map(({ value: optionValue, label: optionLabel }) => (
                <li
                  key={optionValue}
                  className="p-2 cursor-pointer hover:bg-[#F6FFE5] transition flex justify-between items-center"
                  onClick={() => handleSelection(optionValue)}
                  role="option"
                  aria-selected={value === optionValue}
                >
                  <span className="text-sm font-light text-[#323A3A]">{optionLabel}</span>
                  {value === optionValue && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default DropdownField;

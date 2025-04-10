import React, { useState, useRef, useEffect } from "react";
import { UseFormRegister } from "react-hook-form";
import dropdownIcon from "../../assets/images/dropdown.svg";

interface DropdownFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register?: ReturnType<UseFormRegister<any>>;
  error?: string;
  onChange:(name:string)=>void;
  value:string;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  name,
  options,
  register,
  error,
  onChange,
  value
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelection = (optionValue: string, optionLabel: string) => {
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

  return (
    <div className="relative z-20" ref={dropdownRef}>
      <fieldset className="border rounded-md border-[#DADADA] py-1 font-[lexend] text-[#323A3A] text-[14px] font-[300] leading-[20px] bg-white">
        <legend className="block font-[lexend] text-[12px] font-[300] leading-[16px] ml-1 px-1 bg-white text-[#4B5563]">
          {label}
        </legend>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-2 pt-0 rounded bg-white flex justify-between items-center font-light"
          >
            {value || `Select ${label}`}
            <img
              src={dropdownIcon}
              alt="Dropdown Icon"
              className={`w-5 h-5 transition-transform duration-100 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <input
            type="hidden"
            name={name}
            value={selectedValue}
            {...(register && register)}
          />

          {isDropdownOpen && (
            <ul className="absolute w-full font-lexend bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
              {options.map(({ value, label: optionLabel }) => (
                <li
                  key={value}
                  className="p-2 cursor-pointer hover:bg-[#F6FFE5] transition flex justify-between items-center"
                  onClick={() => handleSelection(value, optionLabel)}
                >
                  <span>{optionLabel}</span>
                  {value === selectedValue && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
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

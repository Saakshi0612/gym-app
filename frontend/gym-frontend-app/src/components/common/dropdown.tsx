import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import dropdownIcon from "../../assets/images/dropdown.svg"; // Example dropdown arrow image
// Example checkmark image

interface DropdownFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  register?: ReturnType<UseFormRegister<any>>;
  error?: string;
  onChange: (name: string) => void;
  value: string;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  name,
  options,
  error,
  onChange,
  value,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const handleSelection = (optionValue: string) => {
    onChange(optionValue); // Update the selected value in state
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      {/* Fieldset wraps the dropdown */}
      <fieldset className="border rounded-md border-[#DADADA] py-1 font-[lexend]  text-[#323A3A] text-[14px] font-[300] leading-[20px] bg-white">
        <legend className="block font-[lexend] text-[12px] font-[300] leading-[16px]  ml-1 px-1  bg-white   text-[#4B5563]">
          {label}
        </legend>
        <div className="relative">
          {/* Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-2 pt-0 border-gray-200 rounded bg-white flex justify-between items-center font-light"
          >
            {value || `${label}`}
            <img
              src={dropdownIcon}
              alt="Dropdown Icon"
              className={`w-6 h- transition-transform duration-100 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <ul className="absolute w-full font-lexend bg-white border border-gray-200 rounded shadow-lg mt-1 z-10">
              {options.map(({ value, label }) => (
                <li
                  key={value}
                  className="p-2 cursor-pointer hover:bg-[#F6FFE5] transition flex justify-between items-center"
                  onClick={() => handleSelection(value)}
                >
                  <span>{label}</span>
                  {/* Show checkmark for the selected option */}
                  {value === value && (
                    <img
                      //   src={checkMarkIcon}
                      alt="Selected"
                      className="w-4 h-4"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      {/* Error Message */}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default DropdownField;

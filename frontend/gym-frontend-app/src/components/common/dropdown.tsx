import { useState, useRef, useEffect } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import dropdownIcon from "../../assets/dropdown.svg"
import checkMarkIcon from "../../assets/checkmark.svg"


interface Option {
  value: string;
  label: string;
}

interface DropdownFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  options: Option[];
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  error?: string;
  resetSignal?: boolean; 
}

function DropdownField<T extends FieldValues>({
  label,
  name,
  options,
  register,
  setValue,
  trigger,
  error,
  resetSignal,
}: DropdownFieldProps<T>) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<PathValue<T, Path<T>> | "">("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Register with validation on mount
  useEffect(() => {
    register(name, { required: `${label} is required` });
  }, [register, name, label]);

  // ✅ Reset the dropdown when resetSignal changes
  useEffect(() => {
    if (resetSignal) {
      setSelectedValue("");
      setValue(name, "" as PathValue<T, Path<T>>);
    }
  }, [resetSignal, setValue, name]);

  const handleSelection = (optionValue: PathValue<T, Path<T>>) => {
    setSelectedValue(optionValue);
    setValue(name, optionValue); // ✅ Set value in form state
    trigger(name); // ✅ Trigger validation manually
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="my-5 relative"
      ref={dropdownRef}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <fieldset
        className={`border rounded-md ${
          error ? "border-red-500" : "border-[#DADADA]"
        } py-1 font-[lexend] text-[#323A3A] text-[12px] md:text-[14px] font-[300] leading-[20px] bg-white`}
      >
        <legend className="block font-[lexend] text-[12px] font-[300] leading-[16px] ml-1 px-1 bg-white text-[#4B5563]">
          {label}
        </legend>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="w-full p-2 pt-0 border-gray-200 rounded bg-white flex justify-between items-center font-light"
          >
            {selectedValue
              ? options.find((opt) => opt.value === selectedValue)?.label
              : `Select your ${label.toLowerCase()}`}
            <img
              src={dropdownIcon}
              alt="Dropdown Icon"
              className={`w-6 h- transition-transform duration-100 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <ul className="absolute w-full font-lexend bg-white border border-gray-200 rounded shadow-lg mt-1 z-10">
              {options.map(({ value, label }) => (
                <li
                  key={value}
                  className="p-2 cursor-pointer hover:bg-[#F6FFE5] transition flex justify-between items-center"
                  onClick={() => handleSelection(value as PathValue<T, Path<T>>)}
                >
                  <span>{label}</span>
                  {value === selectedValue && (
                    <img src={checkMarkIcon} alt="Selected" className="w-4 h-4" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      {error && (
        <span className="text-xs text-red-500 block mt-1 ml-1">{error}</span>
      )}
    </div>
  );
}

export default DropdownField;

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DynamicSelectProps {
  id: string;
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({
  id,
  label,
  options,
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        onChange(options[highlightedIndex]);
        setIsOpen(false);
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full select-none"
    >
      {/* Label */}
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 z-10 bg-[var(--color-primary-white)] px-1 text-caption text-neutral-600 pointer-events-none"
      >
        {label}
      </label>

      {/* Trigger */}
      <div
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-3 text-body border border-[var(--color-neutral-400)] rounded-md cursor-pointer"
      >
        <span className={selected ? "text-[var(--color-neutral-900)]" : "text-[var(--color-neutral-400)]"}>
          {selected || "Select an option"}
        </span>
        <ChevronDown
          size={20}
          className={`text-[var(--color-neutral-600)] transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown */}
      <ul
        className={`absolute z-20 w-full mt-1 bg-white rounded-md border border-[var(--color-neutral-400)] shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-1 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {options.map((option, index) => (
          <li
            key={option}
            className={`px-4 py-3 text-sm md:text-base cursor-pointer transition-colors duration-150 ${
              index === highlightedIndex
                ? "bg-[var(--color-primary-green)] text-[var(--color-primary-black)]"
                : "text-[var(--color-neutral-700)] hover:bg-[var(--color-green-100)]"
            }`}
            onMouseDown={() => {
              onChange(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DynamicSelect;

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface DynamicSelectProps {
  id: string;
  label: string;
  options: Option[];
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [options]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev + 1 < options.length ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev - 1 >= 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        case 'Tab':
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  const selectedLabel = options.find((opt) => opt.value === selected)?.label || "";

  return (
    <div className="relative" ref={wrapperRef}>
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 z-10 bg-primary-white px-1 text-caption text-neutral-600 pointer-events-none"
      >
        {label}
      </label>

      {/* Trigger */}
      <div
        ref={triggerRef}
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-dropdown`}
        aria-label={label}
        tabIndex={0}
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) setHighlightedIndex(0);
        }}
        onKeyDown={(e) => {
          if (!isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
            e.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(0);
          }
        }}
        className="flex items-center justify-between w-full px-3 py-3 text-body border border-neutral-400 rounded-md cursor-pointer hover:border-primary-green focus:border-primary-green focus:ring-1 focus:ring-primary-green focus:outline-none"
      >
        <span className={selected ? "text-primary-black" : "text-neutral-400"}>
          {selectedLabel || "Select an option"}
        </span>
        <ChevronDown
          size={20}
          className={`text-neutral-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={dropdownRef}
          id={`${id}-dropdown`}
          role="listbox"
          aria-label={`${label} options`}
          className="absolute z-50 w-full mt-1 bg-primary-white rounded-md border border-neutral-400 shadow-lg overflow-y-auto max-h-40"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`px-4 py-3 text-sm md:text-base cursor-pointer transition-colors duration-150 ${
                index === highlightedIndex
                  ? "bg-primary-green text-primary-black"
                  : "text-neutral-700 hover:bg-green-100"
              }`}
              onMouseDown={() => {
                onChange(option.value);
                setIsOpen(false);
                setHighlightedIndex(-1);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DynamicSelect;

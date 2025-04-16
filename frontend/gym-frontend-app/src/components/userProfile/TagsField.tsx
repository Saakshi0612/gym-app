import React, { useState, useRef, useEffect } from "react";
import { Specialization, TagsFieldProps } from "../../types/components/UserProfileSettings.types";
import { ChevronDown } from "lucide-react";

const allOptions = Object.values(Specialization);

const TagsField: React.FC<TagsFieldProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const filteredOptions = allOptions.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !tags.includes(option)
  );

  const handleRemove = (index: number) => {
    onRemoveTag(index);
  };

  const handleAdd = (tag: string) => {
    if (!tags.includes(tag)) {
      onAddTag(tag);
    }
    setSearchTerm("");
    setShowDropdown(false);
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 < filteredOptions.length ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(filteredOptions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) {
      setHighlightedIndex(0);
    }
  }, [filteredOptions.length, highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showDropdown && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, showDropdown]);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {/* Floating label */}
      <label className="absolute -top-2.5 left-3 z-10 bg-primary-white px-1 text-caption text-neutral-600 pointer-events-none">
        Specialization
      </label>

      {/* Tag input container */}
      <div className="border border-neutral-400 rounded-md px-3 py-2.5 bg-primary-white min-h-[50px] flex items-center flex-wrap gap-2 relative mt-2 hover:border-primary-green focus-within:border-primary-green focus-within:ring-1 focus-within:ring-primary-green">
        {/* Tags */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-neutral-200 text-neutral-900 text-base px-3 py-1.5 rounded-md flex items-center gap-2 whitespace-nowrap max-w-full"
          >
            <span className="truncate max-w-[100px] sm:max-w-[80px]">{tag}</span>
            <button
              onClick={() => handleRemove(index)}
              className="text-neutral-600 hover:text-semantic-red font-bold text-base"
            >
              ×
            </button>
          </span>
        ))}

        {/* Inline Search */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            tags.length === 0 && searchTerm.length === 0
              ? "Add specialization"
              : ""
          }
          className="flex-1 min-w-[100px] sm:min-w-[80px] outline-none border-none text-sm py-1 text-neutral-900 placeholder-neutral-400"
        />

        {/* Dropdown Toggle */}
        <ChevronDown
          size={20}
          className={`text-neutral-600 transition-transform duration-300 cursor-pointer ${
            showDropdown ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {/* Dropdown */}
        {showDropdown && filteredOptions.length > 0 && (
          <ul 
            ref={dropdownRef}
            className="absolute z-20 w-full mt-1 bg-primary-white rounded-md border border-neutral-400 shadow-lg overflow-y-auto max-h-40 left-0 top-full"
          >
            {filteredOptions.map((option, idx) => (
              <li
                key={idx}
                onClick={() => handleAdd(option)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                  idx === highlightedIndex
                    ? "bg-primary-green text-primary-black"
                    : "text-neutral-700 hover:bg-green-100"
                }`}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagsField;

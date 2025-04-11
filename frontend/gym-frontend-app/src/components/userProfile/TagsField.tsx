import React, { useState, useRef, useEffect } from "react";
import { Specialization, TagsFieldProps } from "../../types/components/UserProfileSettings.types";


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

  return (
    <div className="w-full relative">
      {/* Floating label */}
      <label className="absolute -top-2 left-3 bg-[var(--color-primary-white)] text-sm text-[var(--color-neutral-900)] px-1 z-10">
        Specialization
      </label>

      {/* Tag input container */}
      <div className="border border-[var(--color-neutral-400)] rounded-md px-3 py-2 bg-[var(--color-primary-white)] min-h-[54px] flex items-center flex-wrap gap-2 relative mt-2 sm:px-2 sm:py-2">
        {/* Tags */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-[var(--color-neutral-200)] text-[var(--color-neutral-900)] text-sm px-3 py-1 rounded-md flex items-center gap-2 whitespace-nowrap max-w-full"
          >
            <span className="truncate max-w-[100px] sm:max-w-[80px]">{tag}</span>
            <button
              onClick={() => handleRemove(index)}
              className="text-[var(--color-neutral-600)] hover:text-[var(--color-semantic-red)] font-bold text-sm"
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
          className="flex-1 min-w-[100px] sm:min-w-[80px] outline-none border-none text-sm py-1 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-600)]"
        />

        {/* Dropdown */}
        {showDropdown && searchTerm && filteredOptions.length > 0 && (
          <ul className="absolute left-0 top-full mt-1 bg-[var(--color-primary-white)] border border-[var(--color-neutral-400)] rounded-md shadow-sm w-full max-h-40 overflow-y-auto z-10 text-sm sm:text-xs">
            {filteredOptions.map((option, idx) => (
              <li
                key={idx}
                onClick={() => handleAdd(option)}
                className={`px-4 py-2 cursor-pointer ${
                  idx === highlightedIndex
                    ? "bg-[var(--color-neutral-200)] text-[var(--color-neutral-900)]"
                    : "hover:bg-[var(--color-neutral-200)]"
                }`}
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

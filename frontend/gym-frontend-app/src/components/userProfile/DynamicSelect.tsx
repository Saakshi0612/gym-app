import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const labelVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, delay: 0.1, ease: "easeOut" }
  }
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scaleY: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scaleY: 1,
    transition: { 
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scaleY: 0.95,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const optionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
      ease: "easeOut"
    }
  })
};

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
  const dropdownRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = highlightedIndex < options.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(nextIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : options.length - 1;
      setHighlightedIndex(prevIndex);
    }
  };

  const selectedLabel = options.find((opt) => opt.value === selected)?.label || "";

  return (
    <motion.div 
      ref={wrapperRef}
      className="relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.label
        htmlFor={id}
        className="absolute -top-2 left-3 z-10 bg-primary-white px-1 text-caption text-neutral-600 pointer-events-none"
        variants={labelVariants}
      >
        {label}
      </motion.label>

      {/* Trigger */}
      <motion.div
        ref={triggerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-3 text-body border border-neutral-400 rounded-md cursor-pointer hover:border-primary-green focus:border-primary-green focus:ring-1 focus:ring-primary-green"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
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
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={dropdownRef}
            className="absolute z-20 w-full mt-1 bg-primary-white rounded-md border border-neutral-400 shadow-lg overflow-y-auto max-h-40"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {options.map((option, index) => (
              <motion.li
                key={option.value}
                className={`px-4 py-3 text-sm md:text-base cursor-pointer transition-colors duration-150 ${
                  index === highlightedIndex
                    ? "bg-primary-green text-primary-black"
                    : "text-neutral-700 hover:bg-green-100"
                }`}
                variants={optionVariants}
                custom={index}
                onMouseDown={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DynamicSelect;

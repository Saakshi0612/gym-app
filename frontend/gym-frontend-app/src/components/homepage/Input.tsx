import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface HugInputProps {
  label?: string;
}

const HugInput: React.FC<HugInputProps> = ({ label = "hug" }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="relative w-64 mt-4">
      {/* Border Box */}
      <div className="relative border border-gray-300 rounded-md px-3 pt-6 pb-2">
        {/* Label as part of the box */}
        <div className="absolute top-0 left-3 -translate-y-1/2 bg-white px-1 text-sm text-gray-500">
          {label}
        </div>

        {/* Input Field */}
        <input
          id={label}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border-none focus:outline-none"
        />

        {/* Dropdown Icon */}
        <IoIosArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default HugInput;


// import { InputProps } from '../../types/types';
 
// export default function Input({
//   label,
//   error,
//   helpText,
//   icon,
//   rightElement,
//   className = '',
//   ...props
// }: InputProps) {
//   return (
//     <div className="w-full mb-4">
//       <div className="relative">
//         {label && (
//           <label className="absolute -top-2.5 left-3 px-1 bg-white text-sm font-lexend text-neutral-700">
//             {label}
//           </label>
//         )}
       
       
//         <input
//           className={`w-full px-4 py-3.5 border border-gray-200 rounded-lg ${
//             icon ? 'pl-11' : ''
//           } ${
//             rightElement ? 'pr-11' : ''
//           } focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-gray-300
//           placeholder:text-neutral-600 text-gray-700 bg-white ${className}`}
//           {...props}
//         />
       
//         {rightElement && (
//           <div className="absolute inset-y-0 right-0 pr-4 flex items-center font-lexend text-neutral-600">
//             {rightElement}
//           </div>
//         )}
//       </div>
     
//       {error ? (
//         <p className="text-sm text-red-500 mt-1">{error}</p>
//       ) : helpText ? (
//         <p className="text-sm text-neutral-600 mt-1 font-lexend">{helpText}</p>
//       ) : null}
//     </div>
//   );
// }
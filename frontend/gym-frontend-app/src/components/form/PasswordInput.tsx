// src/components/form/PasswordInput.tsx
import { useState } from 'react';
import Input from '../common/Input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  helpText?: string;
  required?: boolean;
}

export default function PasswordInput({ value, onChange, error, helpText, required = true }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <Input
      type={showPassword ? "text" : "password"} 
      label="Password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your password"
      rightElement={
        <button 
          type="button"
          className="text-gray-400 focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      }
      error={error}
      helpText={helpText}
      required={required}
      // Add red border styling if there's an error
      className={error ? "border-red-500" : ""}
    />
  );
}
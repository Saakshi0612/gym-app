// src/components/form/EmailInput.tsx
import React from 'react';
import Input from '../common/Input';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string | null;
  required?: boolean;
}

export default function EmailInput({ value, onChange, helpText, error, required = true }: EmailInputProps) {
  return (
    <Input
      type="email"
      label="Email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your email"
      helpText={helpText}
      error={error}
      required={required}
    />
  );
}
// src/components/form/SubmitButton.tsx
import React from 'react';
import Button from '../common/button';


interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

export default function SubmitButton({ isLoading, text, loadingText }: SubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      variant="primary"
      isLoading={isLoading}
      loadingText={loadingText}
      fullWidth
    >
      {text}
    </Button>
  );
}
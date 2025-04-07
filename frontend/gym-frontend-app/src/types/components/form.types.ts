export interface EmailInputProps {
    value: string;
    onChange: (value: string) => void;
    helpText?: string;
    error?: string | null;
    required?: boolean;
  }
  
  export interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string | null;
    helpText?: string;
    required?: boolean;
  }
  
  export interface SubmitButtonProps {
    isLoading: boolean;
    text: string;
    loadingText: string;
  }
  
  export interface AuthFooterProps {
    message: string;
    linkText: string;
    linkUrl: string;
  }
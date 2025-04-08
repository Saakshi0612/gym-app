import { ButtonHTMLAttributes, InputHTMLAttributes, FormHTMLAttributes, ReactNode } from 'react';
 
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helpText?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}
 
export interface ButtonVariant {
  [key: string]: string;
}
 
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof ButtonVariant | string;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
 
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
}
 
export interface SystemErrorAlertProps {
  message: string;
  onDismiss: () => void;
}
 
export interface QuoteSidebarProps {
  quote?: string;
  author?: string;
  backgroundImage?: string;
}
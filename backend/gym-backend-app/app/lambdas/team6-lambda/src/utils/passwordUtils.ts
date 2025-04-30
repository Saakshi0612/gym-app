// src/utils/passwordUtils.ts
import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  const errors = [];

  // Check length
  if (password.length < 8 || password.length > 16) {
    errors.push("• Must be between 8 and 16 characters");
  }
  
  // Check for spaces
  if (/\s/.test(password)) {
    errors.push("• Must not contain spaces");
  }
  
  // Check if starts with capital letter
  if (!/^[A-Z]/.test(password)) {
    errors.push("• Must start with a capital letter");
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("• Must include at least one lowercase letter");
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    errors.push("• Must include at least one number");
  }
  
  // Check for special character
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("• Must include at least one special character (!@#$%^&*)");
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      message: "Password requirements:\n" + errors.join("\n") 
    };
  }
  
  return { isValid: true };
};
// src/utils/passwordUtils.ts
import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// src/utils/passwordUtils.ts
// Add this function to your existing passwordUtils.ts file

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  // Check for spaces
  if (/\s/.test(password)) {
    return {
      isValid: false,
      message: "Password must not contain spaces"
    };
  }
  
  // Check if starts with capital letter
  if (!/^[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must start with a capital letter"
    };
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter"
    };
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number"
    };
  }
  
  // Check for special character from the allowed set
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*)"
    };
  }
  
  // Check length (8-16 characters)
  if (password.length < 8 || password.length > 16) {
    return {
      isValid: false,
      message: "Password must be between 8 and 16 characters"
    };
  }
  
  return {
    isValid: true,
    message: "Password is valid"
  };
};
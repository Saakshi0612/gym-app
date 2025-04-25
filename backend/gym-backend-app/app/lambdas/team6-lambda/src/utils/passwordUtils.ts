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
  // Check length
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long"
    };
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter"
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
  
  // Check for special character
  if (!/[@$!%*?&]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (@$!%*?&)"
    };
  }
  
  return {
    isValid: true,
    message: "Password is valid"
  };
};
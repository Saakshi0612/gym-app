export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!name) {
    return { isValid: false, error: "Name is required." };
  }
  if (!nameRegex.test(name)) {
    return { 
      isValid: false, 
      error: "Please enter a valid name. Only alphabetic characters and spaces are allowed." 
    };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return { isValid: false, error: "Email address is required. Please enter your email to continue." };
  }
  if (!emailRegex.test(email)) {
    return { 
      isValid: false, 
      error: "Invalid email address. Please ensure it follows the format: username@domain.com" 
    };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required. Please enter your password to continue." };
  }
  
  const minLength = 8;
  const maxLength = 16;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasInvalidChar = /[~\\]/.test(password);
  const hasSpace = /\s/.test(password);

  if (password.length < minLength || password.length > maxLength || 
      !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar || 
      hasInvalidChar || hasSpace) {
    return { 
      isValid: false, 
      error: "Your password must be 8-16 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters." 
    };
  }

  return { isValid: true };
};

export const ACTIVITY_OPTIONS = [
  "Yoga",
  "Climbing",
  "Strength training",
  "Cross-fit",
  "Cardio Training",
  "Rehabilitation"
];

export const TARGET_OPTIONS = [
  "Lose weight",
  "Gain weight",
  "Improve flexibility",
  "General fitness",
  "Build Muscle",
  "Rehabilitation/Recovery"
];

export const FORM_ERROR_MESSAGES = {
  GENERAL: "An error occurred while updating your profile. Please check the details and try again. If the issue persists, contact support for assistance.",
  EMAIL_NOT_FOUND: "We could not find account matching the e-mail, please check your email or sign up if you don't have an account."
}; 
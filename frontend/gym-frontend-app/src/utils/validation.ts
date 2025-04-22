export const validateName = (value: string): string | null => {
  if (!value) {
    return "Name is required";
  }

  if (value.length > 50) {
    return "Name cannot exceed 50 characters";
  }
  
  // Check for numbers
  if (/\d/.test(value)) {
    return "Name cannot contain numbers";
  }

  // Check for special characters (excluding hyphens)
  if (/[^A-Za-z\s-]/.test(value)) {
    return "Name cannot contain special characters";
  }
  
  // Check for consecutive spaces or hyphens
  if (/\s{2,}|-{2,}/.test(value)) {
    return "Name cannot contain consecutive spaces or hyphens";
  }
  
  // Check if name starts or ends with space or hyphen
  if (/^[\s-]|[\s-]$/.test(value)) {
    return "Name cannot start or end with a space or hyphen";
  }
  
  return null;
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

export const validateFileSize = (file: File, maxSizeMB: number = 2): string | null => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  if (file.size > maxSizeBytes) {
    return `Profile photo must be less than ${maxSizeMB}MB. Please choose a smaller image.`;
  }
  
  return null;
};

export const validateFileType = (file: File): string | null => {
  // List of allowed image MIME types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  console.log('File type:', file.type); // Debug log
  
  // Check if file type is empty or not in allowed types
  if (!file.type || !allowedTypes.includes(file.type.toLowerCase())) {
    return "Only image files (JPG, PNG, GIF, WEBP, SVG) are allowed";
  }
  
  return null;
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
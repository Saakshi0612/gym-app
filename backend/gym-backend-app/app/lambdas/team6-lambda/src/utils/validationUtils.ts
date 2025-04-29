// src/utils/validationUtils.ts
/**
 * Validates a name field (first name or last name)
 * Format: Latin alphabetic characters, allowing spaces, minimum 2 letters, maximum 50 letters
 */
export const validateName = (name: string): { isValid: boolean; message?: string } => {
    if (!name) {
      return { isValid: false, message: "Name is required" };
    }
  
    // Trim the name to remove leading/trailing spaces
    const trimmedName = name.trim();
    
    // Check length
    if (trimmedName.length < 2) {
      return { isValid: false, message: "Name must be at least 2 characters" };
    }
    
    if (trimmedName.length > 50) {
      return { isValid: false, message: "Name must not exceed 50 characters" };
    }
    
    // Check format (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      return { isValid: false, message: "Name must only contain letters and spaces" };
    }
    
    return { isValid: true };
  };
  
  /**
   * Validates an email address
   * Format: username@domain.com, allowing alphanumeric characters, periods, hyphens, and underscores
   */
  export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
    if (!email) {
      return { isValid: false, message: "Email is required" };
    }
    
    // Email regex pattern
    // This allows for alphanumeric characters, periods, hyphens, and underscores in username and domain
    const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address (e.g. username@domain.com)" };
    }
    
    return { isValid: true };
  };
  
  /**
   * Validates a password
   * Format: Combination of uppercase letters, lowercase letters, numbers, and special characters
   * Length: Minimum 8 characters, maximum 16 characters
   * Special Characters: Allow characters like ! @ # $ % ^ & *, but avoid spaces and ambiguous characters
   */
  export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (!password) {
      return { isValid: false, message: "Password is required" };
    }
    
    // Check length
    if (password.length < 8 || password.length > 16) {
      return { isValid: false, message: "Password must be between 8 and 16 characters" };
    }
    
    // Check for spaces
    if (/\s/.test(password)) {
      return { isValid: false, message: "Password must not contain spaces" };
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Password must include at least one uppercase letter" };
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: "Password must include at least one lowercase letter" };
    }
    
    // Check for number
    if (!/\d/.test(password)) {
      return { isValid: false, message: "Password must include at least one number" };
    }
    
    // Check for special character
    if (!/[!@#$%^&*]/.test(password)) {
      return { isValid: false, message: "Password must include at least one special character (!@#$%^&*)" };
    }
    
    return { isValid: true };
  };
  
  /**
   * Validates target selection
   * Valid targets: "lose-weight", "gain-weight", "improve-flexibility", "general-fitness", "build-muscle", "rehab-recovery"
   */
// src/utils/validationUtils.ts
// Update the validateTarget function
export const validateTarget = (target: string): { isValid: boolean; message?: string } => {
    if (!target) {
      return { isValid: false, message: "Target is required" };
    }
    
    const validTargets = [
      "lose-weight", 
      "gain-weight", 
      "improve-flexibility", 
      "general-fitness", 
      "build-muscle", 
      "rehab-recovery",
      // Add these variations to support your actual data
      "losing_weight",
      "gaining_weight",
      "improving_flexibility",
      "general_fitness",
      "building_muscle",
      "rehabilitation_recovery"
    ];
    
    if (!validTargets.includes(target)) {
      return { isValid: false, message: "Please select a valid target" };
    }
    
    return { isValid: true };
  };
  
  // Update the validateActivity function
  export const validateActivity = (activity: string): { isValid: boolean; message?: string } => {
    if (!activity) {
      return { isValid: false, message: "Activity is required" };
    }
    
    const validActivities = [
      "yoga", 
      "climbing", 
      "strength-training", 
      "crossfit", 
      "cardio-training", 
      "rehabilitation",
      // Add these variations to support your actual data
      "Yoga",
      "Climbing",
      "Strength Training",
      "CrossFit",
      "Cardio Training",
      "Rehabilitation"
    ];
    
    if (!validActivities.includes(activity)) {
      return { isValid: false, message: "Please select a valid activity" };
    }
    
    return { isValid: true };
  };
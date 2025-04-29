/**
 * Validates a phone number to ensure it contains exactly 10 digits
 * @param phoneNumber The phone number to validate
 * @returns An object with isValid flag and error message if invalid
 */
export const validatePhoneNumber = (phoneNumber: string): { isValid: boolean; message: string } => {
  // Check if phone number is provided
  if (!phoneNumber) {
    return {
      isValid: false,
      message: "Phone number is required"
    };
  }

  // Check if the input contains only digits
  if (!/^\d+$/.test(phoneNumber)) {
    return {
      isValid: false,
      message: "Phone number must contain only digits (0-9)"
    };
  }
  
  // Check if the phone number has exactly 10 digits
  if (phoneNumber.length !== 10) {
    return {
      isValid: false,
      message: "Phone number must contain exactly 10 digits"
    };
  }

  return {
    isValid: true,
    message: "Phone number is valid"
  };
}; 
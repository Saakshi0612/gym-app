import React, { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updatePassword } from '../../services/authSlice';
import { FormDataType, VisibilityType } from "../../types/components/passwordFormTypes";
import { validatePassword } from "../../utils/validation";
import SuccessAlert from "./shared/SuccessAlert";

const UserPasswordForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  
  const [visibility, setVisibility] = useState<VisibilityType>({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState<FormDataType>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof VisibilityType) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateField = (name: string, value: string) => {
    if (name === "oldPassword" || name === "newPassword") {
      const validation = validatePassword(value);
      return !validation.isValid;
    }
    if (name === "confirmPassword") {
      return value !== formData.newPassword;
    }
    return false;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate field on change without showing alerts
    const hasError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: hasError }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const oldPasswordError = validateField("oldPassword", formData.oldPassword);
    const newPasswordError = validateField("newPassword", formData.newPassword);
    const confirmPasswordError = validateField("confirmPassword", formData.confirmPassword);

    if (oldPasswordError) {
      setErrorMessage("Invalid current password");
      setShowError(true);
      return;
    }

    if (newPasswordError) {
      setErrorMessage("New password does not meet requirements");
      setShowError(true);
      return;
    }

    if (confirmPasswordError) {
      setErrorMessage("Passwords do not match");
      setShowError(true);
      return;
    }

    // Check if new password is same as old password
    if (formData.newPassword === formData.oldPassword) {
      setErrorMessage("New password cannot be the same as current password");
      setShowError(true);
      return;
    }

    try {
      await dispatch(updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })).unwrap();
      
      setSuccessMessage("Password updated successfully!");
      setShowSuccess(true);
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      setErrorMessage(error as string);
      setShowError(true);
    }
  };

  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength(formData.newPassword);

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 w-full bg-primary-white rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessAlert
              message={successMessage}
              onClose={() => setShowSuccess(false)}
            />
          </motion.div>
        )}
        
        {showError && (
          <motion.div 
            className="mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessAlert
              message={errorMessage}
              onClose={() => setShowError(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        className="w-full max-w-lg mx-auto md:ml-16 space-y-8 flex flex-col justify-center px-0 md:px-4 mt-0 md:mt-8"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Password Fields Container */}
        <motion.div 
          className="px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Old Password", field: "oldPassword", vis: "old" },
            { label: "New Password", field: "newPassword", vis: "new" },
            { label: "Confirm New Password", field: "confirmPassword", vis: "confirm" },
          ].map(({ label, field, vis }, index) => {
            const isNew = field === "newPassword";
            const value = formData[field as keyof FormDataType];
            const hasError = fieldErrors[field];

            return (
              <motion.div 
                className="relative space-y-2" 
                key={field}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label
                  htmlFor={field}
                  className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#323A3A] z-10"
                >
                  {label}
                </label>
                <div className="relative mt-4">
                  <input
                    id={field}
                    name={field}
                    type={visibility[vis as keyof VisibilityType] ? "text" : "password"}
                    value={value}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`w-full h-16 px-4 pr-14 text-base text-[#323A3A] placeholder:text-gray-400 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                      hasError 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-[#DADADA] focus:ring-[#9ef300]"
                    } [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden`}
                    required
                    minLength={8}
                  />
                  <motion.button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-10 flex items-center justify-center text-[#666] hover:text-[#000]"
                    onClick={() => toggleVisibility(vis as keyof VisibilityType)}
                    aria-label={`Toggle ${label} visibility`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {visibility[vis as keyof VisibilityType] ? (
                      <EyeOff size={24} strokeWidth={2.5} />
                    ) : (
                      <Eye size={24} strokeWidth={2.5} />
                    )}
                  </motion.button>
                </div>

                {isNew && (
                  <>
                    <motion.div 
                      className="w-full h-2 rounded bg-gray-200 mt-2"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className={`h-2 rounded transition-all ${
                          strength === 1
                            ? "bg-red-500 w-1/4"
                            : strength === 2
                            ? "bg-yellow-500 w-2/4"
                            : strength === 3
                            ? "bg-[#C6F500] w-3/4"
                            : strength >= 4
                            ? "bg-[#9ef300] w-full"
                            : "bg-gray-200 w-0"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </motion.div>
                    <motion.div 
                      className="text-xs text-[#666] space-y-1 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {formData.newPassword.length > 0 && (
                        <>
                          {formData.newPassword.length < 8 || formData.newPassword.length > 16 ? (
                            <motion.p 
                              className="text-red-500"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              • Password must be 8-16 characters long
                            </motion.p>
                          ) : /[A-Z]/.test(formData.newPassword) ? (
                            /[a-z]/.test(formData.newPassword) ? (
                              /\d/.test(formData.newPassword) ? (
                                /[!@#$%^&*]/.test(formData.newPassword) ? (
                                  <motion.p 
                                    className="text-green-600"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    ✓ All requirements met
                                  </motion.p>
                                ) : (
                                  <motion.p 
                                    className="text-red-500"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    • Include a special character (!@#$%^&*)
                                  </motion.p>
                                )
                              ) : (
                                <motion.p 
                                  className="text-red-500"
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  • Include a number
                                </motion.p>
                              )
                            ) : (
                              <motion.p 
                                className="text-red-500"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                • Include a lowercase letter
                              </motion.p>
                            )
                          ) : (
                            <motion.p 
                              className="text-red-500"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              • Include an uppercase letter
                            </motion.p>
                          )}
                        </>
                      )}
                    </motion.div>
                  </>
                )}

                <motion.p 
                  className="text-xs text-[#666] pt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {field === "oldPassword" 
                    ? "Please enter your current password to verify your identity"
                    : field === "confirmPassword"
                      ? formData.confirmPassword.length === 0
                        ? "Please confirm your new password"
                        : ""
                      : formData.newPassword.length === 0 
                        ? "Password must be 8-16 characters long and include uppercase letters, lowercase letters, numbers, and special characters"
                        : ""
                  }
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="w-full text-center md:text-right px-4 md:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out bg-primary-green text-primary-black hover:bg-[#9ef300] hover:text-primary-white disabled:bg-neutral-200 disabled:text-neutral-600 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default UserPasswordForm;

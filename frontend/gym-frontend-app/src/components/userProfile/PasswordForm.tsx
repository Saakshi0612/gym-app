import React, { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updatePassword } from '../../services/authSlice';
import { FormDataType, VisibilityType } from "../../types/components/passwordFormTypes";
import { validatePassword } from "../../utils/validation";

const PasswordForm: React.FC = () => {
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
    
    // Validate field on change
    const hasError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: hasError }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;

    // Validate all fields
    const newFieldErrors = {
      oldPassword: validateField("oldPassword", oldPassword),
      newPassword: validateField("newPassword", newPassword),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };
    setFieldErrors(newFieldErrors);

    // Check if any field has errors
    if (Object.values(newFieldErrors).some(hasError => hasError)) {
      setErrorMessage("Please fix the errors in the form before submitting.");
      setSuccessMessage("");
      return;
    }

    try {
      const resultAction = await dispatch(updatePassword({ oldPassword, newPassword }));
      
      if (updatePassword.fulfilled.match(resultAction)) {
        setSuccessMessage("The password has been updated successfully.");
        setErrorMessage("");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setFieldErrors({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false,
        });
        setTimeout(() => setSuccessMessage(""), 4000);
      } else if (updatePassword.rejected.match(resultAction)) {
        setErrorMessage(resultAction.payload as string || "An error occurred.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("We couldn't process your request at this time. Please try again later.");
      setSuccessMessage("");
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
    <>
      <style>
        {`
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear {
            display: none;
          }
          input[type="password"]::-webkit-credentials-auto-fill-button,
          input[type="password"]::-webkit-contacts-auto-fill-button {
            visibility: hidden;
            display: none !important;
            pointer-events: none;
            position: absolute;
            right: 0;
          }
        `}
      </style>

      <form
        className="w-full max-w-lg mx-auto md:ml-16 space-y-8 flex flex-col justify-center px-0 md:px-4 mt-0 md:mt-8"
        onSubmit={handleSubmit}
      >
        {/* Toasts */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-[#E6FFE1] border-l-4 border-[#9ef300] p-4 rounded-md shadow flex items-start gap-4 z-50"
            >
              <div className="bg-[#9ef300] text-white rounded-full p-1">
                <Check size={16} strokeWidth={3} />
              </div>
              <div className="flex flex-col text-sm text-[#323A3A]">
                <strong>Success</strong>
                <span>{successMessage}</span>
              </div>
              <button type="button" onClick={() => setSuccessMessage("")}>
                <X size={16} strokeWidth={3} />
              </button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-[#FFF1F1] border-l-4 border-red-500 p-4 rounded-md shadow flex items-start gap-4 z-50"
            >
              <div className="bg-red-500 text-white rounded-full p-1">
                <X size={16} strokeWidth={3} />
              </div>
              <div className="flex flex-col text-sm text-[#323A3A]">
                <strong>Error</strong>
                <span>{errorMessage}</span>
              </div>
              <button type="button" onClick={() => setErrorMessage("")}>
                <X size={16} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Fields Container */}
        <div className="px-4 md:px-0">
          {[
            { label: "Old Password", field: "oldPassword", vis: "old" },
            { label: "New Password", field: "newPassword", vis: "new" },
            { label: "Confirm New Password", field: "confirmPassword", vis: "confirm" },
          ].map(({ label, field, vis }) => {
            const isNew = field === "newPassword";
            const value = formData[field as keyof FormDataType];
            const hasError = fieldErrors[field];

            return (
              <div className="relative space-y-2" key={field}>
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
                    }`}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-16 w-10 flex items-center justify-center text-[#666] hover:text-[#000]"
                    onClick={() => toggleVisibility(vis as keyof VisibilityType)}
                    aria-label={`Toggle ${label} visibility`}
                  >
                    {visibility[vis as keyof VisibilityType] ? (
                      <EyeOff size={24} strokeWidth={2.5} />
                    ) : (
                      <Eye size={24} strokeWidth={2.5} />
                    )}
                  </button>
                </div>

                {isNew && (
                  <div className="w-full h-2 rounded bg-gray-200 mt-2">
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
                    />
                  </div>
                )}

                <p className="text-xs text-[#666] pt-1">
                  Password must be 8-16 characters long and include uppercase letters, lowercase letters, numbers, and special characters
                </p>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="w-full text-center md:text-right px-4 md:px-0">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#9ef300] hover:bg-lime-500 text-[#323A3A] text-base px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default PasswordForm;

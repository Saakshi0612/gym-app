import React, { useState, ChangeEvent, FormEvent, useCallback, useMemo } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updatePassword } from '../../services/authSlice';
import { FormDataType, VisibilityType } from "../../types/components/passwordFormTypes";
import { validatePassword } from "../../utils/validation";
import SuccessAlert from "./shared/SuccessAlert";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = useCallback((field: keyof VisibilityType) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const validateField = useCallback((name: string, value: string) => {
    if (name === "oldPassword" || name === "newPassword") {
      const validation = validatePassword(value);
      return !validation.isValid;
    }
    if (name === "confirmPassword") {
      return value !== formData.newPassword;
    }
    return false;
  }, [formData.newPassword]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate field on change
    const hasError = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: hasError }));
  }, [validateField]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating password';
      setErrorMessage(errorMessage);
      setShowError(true);
    }
  }, [dispatch, formData]);

  const getStrength = useCallback((password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  }, []);

  const strength = useMemo(() => getStrength(formData.newPassword), [formData.newPassword, getStrength]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 w-full bg-primary-white rounded-lg">
      {showSuccess && (
        <div className="mb-4">
          <SuccessAlert
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}
      
      {showError && (
        <div className="mb-4">
          <SuccessAlert
            message={errorMessage}
            onClose={() => setShowError(false)}
          />
        </div>
      )}

      <form
        className="w-full max-w-lg mx-auto md:ml-16 space-y-8 flex flex-col justify-center px-0 md:px-4 mt-0 md:mt-8"
        onSubmit={handleSubmit}
      >
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
                    } [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden`}
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
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out bg-primary-green text-primary-black hover:bg-[#9ef300] hover:text-primary-white disabled:bg-neutral-200 disabled:text-neutral-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] mx-auto md:ml-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;

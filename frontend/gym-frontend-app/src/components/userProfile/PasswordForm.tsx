import React, { useState, FormEvent, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updatePassword } from '../../services/authSlice';
import { FormDataType } from "../../types/components/passwordFormTypes";
import { validatePassword } from "../../utils/validation";
import SuccessAlert from "./shared/SuccessAlert";
import LabeledInput from "./shared/LabeledInput";
import { Loader2 } from "lucide-react";

const validatePasswordField = (value: string): string | null => {
  const result = validatePassword(value);
  return result.isValid ? null : result.error || "Invalid password";
};

// Add validation for old password
const validateOldPassword = (value: string): string | null => {
  if (!value) return "Current password is required";
  return null;
};

const PasswordForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const [formData, setFormData] = useState<FormDataType>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    oldPassword: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
  }>({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null
  });

  const validateConfirmPassword = useCallback((value: string) => {
    if (!value) return "Confirm password is required";
    if (value !== formData.newPassword) return "Passwords do not match";
    return null;
  }, [formData.newPassword]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);
    
    // Validate form before submitting
    const errors = {
      oldPassword: validateOldPassword(formData.oldPassword),
      newPassword: validatePasswordField(formData.newPassword),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };

    setFormErrors(errors);

    // Check if old password and new password are the same
    if (formData.oldPassword === formData.newPassword) {
      setErrorMessage("New password must be different from current password");
      setShowError(true);
      return;
    }

    // Check if any field is empty
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setErrorMessage("All fields are required");
      setShowError(true);
      return;
    }

    // Check if there are any validation errors
    if (errors.oldPassword || errors.newPassword || errors.confirmPassword) {
      setErrorMessage("Please fix all validation errors before submitting");
      setShowError(true);
      return;
    }

    try {
      const result = await dispatch(updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })).unwrap();
      
      setSuccessMessage(result.message || "Password updated successfully!");
      setShowSuccess(true);
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Current password is incorrect';
      setErrorMessage(errorMsg);
      setShowError(true);
      
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  }, [dispatch, formData, validateConfirmPassword]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 w-full bg-primary-white rounded-lg">
      {showSuccess && (
        <div className="mb-4">
          <SuccessAlert
            message={successMessage}
            onClose={() => setShowSuccess(false)}
            type="success"
          />
        </div>
      )}
      
      {showError && (
        <div className="mb-4">
          <SuccessAlert
            message={errorMessage}
            onClose={() => setShowError(false)}
            type="error"
          />
        </div>
      )}

      <form
        className="w-full max-w-lg mx-auto md:ml-16 space-y-8 flex flex-col justify-center px-0 md:px-4 mt-0 md:mt-8"
        onSubmit={handleSubmit}
      >
        <div className="px-4 md:px-0 space-y-6">
          <LabeledInput
            id="oldPassword"
            label="Current Password"
            value={formData.oldPassword}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, oldPassword: val }));
              setFormErrors(prev => ({ ...prev, oldPassword: validateOldPassword(val) }));
            }}
            type="password"
            validation={validateOldPassword}
          />

          <LabeledInput
            id="newPassword"
            label="New Password"
            value={formData.newPassword}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, newPassword: val }));
              setFormErrors(prev => ({ ...prev, newPassword: validatePasswordField(val) }));
            }}
            type="password"
            validation={validatePasswordField}
            showStrengthIndicator
          />

          <LabeledInput
            id="confirmPassword"
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(val) => {
              setFormData(prev => ({ ...prev, confirmPassword: val }));
              setFormErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(val) }));
            }}
            type="password"
            validation={validateConfirmPassword}
          />
        </div>

        <div className="w-full text-center md:text-right px-4 md:px-0">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-primary-green text-primary-black rounded-lg font-medium hover:bg-primary-green/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading || Object.values(formErrors).some(error => error !== null)}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;

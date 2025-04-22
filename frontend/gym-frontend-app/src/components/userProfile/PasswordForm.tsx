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

  const validateConfirmPassword = useCallback((value: string) => {
    if (!value) return "Confirm password is required";
    if (value !== formData.newPassword) return "Passwords do not match";
    return null;
  }, [formData.newPassword]);

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
        <div className="px-4 md:px-0 space-y-6">
          <LabeledInput
            id="oldPassword"
            label="Old Password"
            value={formData.oldPassword}
            onChange={(val) => setFormData(prev => ({ ...prev, oldPassword: val }))}
            type="password"
            validation={validatePasswordField}
          />

          <LabeledInput
            id="newPassword"
            label="New Password"
            value={formData.newPassword}
            onChange={(val) => setFormData(prev => ({ ...prev, newPassword: val }))}
            type="password"
            validation={validatePasswordField}
            showStrengthIndicator
          />

          <LabeledInput
            id="confirmPassword"
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(val) => setFormData(prev => ({ ...prev, confirmPassword: val }))}
            type="password"
            validation={validateConfirmPassword}
          />
        </div>

        <div className="w-full text-center md:text-right px-4 md:px-0">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-primary-green text-white rounded-lg font-medium hover:bg-[#8CE300] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading}
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

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updatePassword } from '../../services/authSlice';
import { FormDataType, VisibilityType } from "../../types/components/passwordFormTypes";

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

  const toggleVisibility = (field: keyof VisibilityType) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      setSuccessMessage("");
      return;
    }

    try {
      const resultAction = await dispatch(updatePassword({ oldPassword, newPassword }));
      
      if (updatePassword.fulfilled.match(resultAction)) {
        setSuccessMessage("The password has been updated successfully.");
        setErrorMessage("");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
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
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={visibility.old ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("old")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {visibility.old ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={visibility.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {visibility.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={visibility.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {visibility.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < strength
                        ? strength === 1
                          ? "bg-red-500"
                          : strength === 2
                          ? "bg-yellow-500"
                          : strength === 3
                          ? "bg-blue-500"
                          : "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {strength === 0 && "Very weak"}
                {strength === 1 && "Weak"}
                {strength === 2 && "Medium"}
                {strength === 3 && "Strong"}
                {strength === 4 && "Very strong"}
              </p>
            </div>
          )}

          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md"
              >
                <Check size={20} />
                <p>{successMessage}</p>
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md"
              >
                <X size={20} />
                <p>{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </>
  );
};

export default PasswordForm;

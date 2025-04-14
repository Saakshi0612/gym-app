import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FormDataType, PasswordFormProps, TouchedType, VisibilityType } from "../../types/components/passwordFormTypes";
import { useAppDispatch } from "../../store/store"; // Import useAppDispatch
import { updatePassword } from "../../services/authSlice";

// const PasswordForm: React.FC<PasswordFormProps> = ({ user }) => {
//   const [visibility, setVisibility] = useState<VisibilityType>({
//     old: false,
//     new: false,
//     confirm: false,
//   });

// const PasswordForm: React.FC<PasswordFormProps> = ({ user }) => {
//   const dispatch = useAppDispatch(); // Add this line
  
//   const [visibility, setVisibility] = useState<VisibilityType>({
//     old: false,
//     new: false,
//     confirm: false,
//   });


//   const [formData, setFormData] = useState<FormDataType>({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [isTouched, setIsTouched] = useState<TouchedType>({
//     old: false,
//     new: false,
//     confirm: false,
//   });

//   const [currentPassword, setCurrentPassword] = useState<string>("");

//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   useEffect(() => {
//     setCurrentPassword(user.currentPassword || "");
//   }, [user.currentPassword]);

//   const toggleVisibility = (field: keyof VisibilityType) => {
//     setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleBlur = (field: keyof TouchedType) => {
//     setIsTouched((prev) => ({ ...prev, [field]: true }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const { oldPassword, newPassword, confirmPassword } = formData;

//     if (oldPassword !== currentPassword) {
//       setErrorMessage("Old password is incorrect.");
//       setSuccessMessage("");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setErrorMessage("New passwords do not match.");
//       setSuccessMessage("");
//       return;
//     }

//     try {
//       const response = await fetch("/api/update-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ oldPassword, newPassword }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccessMessage("The password has been updated successfully.");
//         setErrorMessage("");
//         setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

//         setTimeout(() => setSuccessMessage(""), 4000);
//       } else {
//         setErrorMessage(data.message || "An error occurred.");
//         setSuccessMessage("");
//       }
//     } catch (error) {
//       console.error("Error updating password:", error);
//       setErrorMessage("We couldn’t process your request at this time. Please try again later.");
//       setSuccessMessage("");
//     }
//   };

//   const getStrength = (password: string) => {
//     let strength = 0;
//     if (password.length >= 8) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
//     return strength;
//   };


const PasswordForm: React.FC<PasswordFormProps> = ({ user }) => {
  const dispatch = useAppDispatch(); // Add this line
  
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

  const [isTouched, setIsTouched] = useState<TouchedType>({
    old: false,
    new: false,
    confirm: false,
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

  const handleBlur = (field: keyof TouchedType) => {
    setIsTouched((prev) => ({ ...prev, [field]: true }));
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
      // Use the Redux thunk instead of fetch
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

      <form
        className="w-full max-w-lg mx-auto md:ml-16 space-y-8 flex flex-col justify-center px-4"
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

        {/* Password Fields */}
        {[
          { label: "Old Password", field: "oldPassword", vis: "old" },
          { label: "New Password", field: "newPassword", vis: "new" },
          { label: "Confirm New Password", field: "confirmPassword", vis: "confirm" },
        ].map(({ label, field, vis }) => {
          const isNew = field === "newPassword";
          const value = formData[field as keyof FormDataType];

          return (
            <div className="relative space-y-2" key={field}>
              <label
                htmlFor={field}
                className="absolute -top-3 left-3 bg-white px-1 text-sm text-[#323A3A] z-10"
              >
                {label}
              </label>
              <div className="relative">
                <input
                  id={field}
                  name={field}
                  type={visibility[vis as keyof VisibilityType] ? "text" : "password"}
                  value={value}
                  onChange={handleChange}
                  onBlur={() => handleBlur(vis as keyof TouchedType)}
                  autoComplete="new-password"
                  className="w-full h-16 px-4 pr-14 text-base text-[#323A3A] placeholder:text-gray-400 border border-[#DADADA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9ef300] bg-white"
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
                At least one capital letter required
              </p>
            </div>
          );
        })}

        {/* Submit */}
        <div className="w-full text-center md:text-right">
          <button
            type="submit"
            className="bg-[#9ef300] hover:bg-lime-500 text-[#323A3A] text-base px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};

export default PasswordForm;

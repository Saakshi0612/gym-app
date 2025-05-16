import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/store';
import { registerUser, clearError } from '../services/authSlice';
import { QuoteSidebar } from "./common/QuoteBanner";
import Input from "./common/Input";
import { RegistrationFormData } from "../types";
import Dropdown from "./common/Selection";
import SystemAlert from './SystemAlert';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from "./auth/authLayout";
import AuthFooter from "./auth/AuthFooter";
import FieldWrapper from "./common/FieldWrapper";

const TARGET_OPTIONS = [
  { value: "lose-weight", label: "Lose Weight" },
  { value: "gain-weight", label: "Gain Weight" },
  { value: "improve-flexibility", label: "Improve Flexibility" },
  { value: "general-fitness", label: "General Fitness" },
  { value: "build-muscle", label: "Build Muscle" },
  { value: "rehab-recovery", label: "Rehabilitation/Recovery" },
];

const ACTIVITY_OPTIONS = [
  { value: "yoga", label: "Yoga" },
  { value: "climbing", label: "Climbing" },
  { value: "strength-training", label: "Strength Training" },
  { value: "crossfit", label: "CrossFit" },
  { value: "cardio-training", label: "Cardio Training" },
  { value: "rehabilitation", label: "Rehabilitation" },
];

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
    reset,
    getValues,
  } = useForm<RegistrationFormData>({
    mode: "onTouched",
    defaultValues: {
      targets: "lose-weight",
      preferableActivity: "yoga",
    }
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const targets = watch("targets");
  const preferableActivity = watch("preferableActivity");

  // Ensure default values are set
  useEffect(() => {
    if (!targets) {
      setValue("targets", "lose-weight");
    }
    if (!preferableActivity) {
      setValue("preferableActivity", "yoga");
    }
  }, [setValue, targets, preferableActivity]);

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const isTargetValid = await trigger("targets");
    const isActivityValid = await trigger("preferableActivity");

    if (!isTargetValid || !isActivityValid) return;

    // Log the form data to see what we're working with
    console.log("Form data before submission:", {
      ...data,
      password: "***REDACTED***",
      confirmPassword: "***REDACTED***"
    });

    // Make sure we have the latest values
    const currentTargets = getValues("targets") || "lose-weight";
    const currentActivity = getValues("preferableActivity") || "yoga";

    // Create the payload with the correct values
    const payload = {
      ...data,
      targets: currentTargets,
      preferableActivity: currentActivity,
    };

    console.log("Payload for registration:", {
      ...payload,
      password: "***REDACTED***",
      confirmPassword: "***REDACTED***"
    });

    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
      setShowSuccessAlert(true);
      reset();
    } else {
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    if (error && showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
        dispatch(clearError());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, showErrorAlert, dispatch]);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/login');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, navigate]);
 
  const passwordToggleIcon = (
    <div
      onClick={() => setShowPassword(prev => !prev)}
      className="cursor-pointer text-lg"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </div>
  );
  const confirmPasswordToggleIcon = (
    <div
      onClick={() => setshowConfirmPassword(prev => !prev)}
      className="cursor-pointer text-lg"
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </div>
  );

  return (
    <AuthLayout
      sidebar={<QuoteSidebar />}
      systemError={
        <>
          {error && showErrorAlert && (
            <SystemAlert
              type="error"
              message={error}
              onDismiss={() => {
                setShowErrorAlert(false);
                dispatch(clearError());
              }}
            />
          )}
          {showSuccessAlert && (
            <SystemAlert
              type="success"
              message="Registration successful!"
              onDismiss={() => setShowSuccessAlert(false)}
            />
          )}
        </>
      }
    >
   <div className="max-w-md mx-auto  w-full py-4">
   <div className="relative h-[550px] ">
  <h2 className="text-gray-700 mb-1 uppercase text-xs font-lexend">Let&apos;s Get You Started</h2>
  <h1 className="text-2xl font-lexend mb-6">Create an Account</h1>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
     
 
       <FieldWrapper
          error={errors.firstName?.message}
          helpText={!errors.firstName?.message ? "e.g. Jonson" : undefined}
    >
   <Input
      label="First Name"
      name="firstName"
  placeholder="Enter your first name"
  register={register("firstName", {
    required: "First Name is required",
    minLength: {
      value: 2,
      message: "must be at least 2 characters.",
    },
    maxLength: {
      value: 50,
      message: "must not exceed 50 characters.",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "must only contain letters/spaces.",
    },
    validate: (value) => {
      // Custom validation for additional checks, if needed
      const trimmedValue = value.trim();
      // Check if the length is less than 2
      if (trimmedValue.length < 2) {
        return "First name must be at least 2 characters.";
      }
      // Check if it matches the pattern for letters and spaces only
      if (!/^[A-Za-z\s]+$/.test(trimmedValue)) {
        return "First name must only contain letters and spaces.";
      }
      return true;  // If everything passes, return true
      }
      })}
      
      />

       </FieldWrapper>

       <FieldWrapper
  error={errors.lastName?.message}
  helpText={!errors.lastName?.message ? "e.g. Doe" : undefined}
>
<Input
  label="Last Name"
  name="lastName"
  placeholder="Enter your Last Name"
  register={register("lastName", {
    required: "Last Name is required",
    minLength: {
      value: 2,
      message: "must be at least 2 characters.",
    },
    maxLength: {
      value: 50,
      message: "must not exceed 50 characters.",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "must only contain letters/spaces.",
    },
    validate: (value) => {
      const trimmedValue = value.trim();

      // Check if the length is less than 2
      if (trimmedValue.length < 2) {
        return "Last name must be at least 2 characters.";
      }
      
      // Check if it matches the pattern for letters and spaces only
      if (!/^[A-Za-z\s]+$/.test(trimmedValue)) {
        return "Last name must only contain letters and spaces.";
      }
      
      return true;  // If everything passes, return true
    }
  })}
/>

       </FieldWrapper>
   </div>

   <FieldWrapper
  error={errors.email?.message}
  helpText={!errors.email?.message ? "e.g. username@domain.com" : undefined}
>
  <Input
    label="Email"
    name="email"
    type="email"
    placeholder="e.g. username@domain.com"
    register={register("email", {
      required: "Email is required",
      pattern: {
        value: /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email format",
      },
    })}
  />
</FieldWrapper>



<FieldWrapper
  error={errors.password?.message}
  helpText={
    !errors.password?.message
      ? "At least one capital letter, one number, and one special character required"
      : undefined
  }
>
  <Input
    label="Password"
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    register={register("password", {
      validate: (value) => {
        const errors = [];

        if (!value) return "Password is required";
        if (/\s/.test(value)) errors.push("• Must not contain spaces");
        if (!/[A-Z]/.test(value)) errors.push("• Include a  capital letter");
        if (!/[a-z]/.test(value)) errors.push("• Include a lowercase letter");
        if (!/\d/.test(value)) errors.push("• Include a number");
        if (!/[!@#$%^&*]/.test(value)) errors.push("• Include a special character");
        if (value.length < 8 || value.length > 16) errors.push("• Must be 8–16 characters");

        return errors.length > 0 ? errors.join("\n") : true;
      },
    })}
    rightElement={passwordToggleIcon}
  />
</FieldWrapper>

<FieldWrapper
  error={errors.confirmPassword?.message}
>
  <Input
    label="Confirm Password"
    name="confirmPassword"
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Re-enter your password"
    register={register("confirmPassword", {
      validate: (value) => {
        if (!value) return "Confirm Password is required";
        return value === watch("password") || "Passwords do not match";
      },
    })}
    
    rightElement={confirmPasswordToggleIcon}
  />
</FieldWrapper>



    <div className="z-20">
      <Dropdown
        label="Your Target"
        name="targets"
        options={TARGET_OPTIONS}
        value={targets || "lose-weight"} // Ensure a default value
        onChange={(val) => {
          console.log('Target changed to:', val);
          setValue("targets", val, { shouldValidate: true });
          trigger("targets");
        }}
        error={errors.targets?.message}
      />
    </div>

    <div className="z-10">
      <Dropdown
        label="Preferable Activity"
        name="preferableActivity"
        options={ACTIVITY_OPTIONS}
        value={preferableActivity || "yoga"} // Ensure a default value
        onChange={(val) => {
          console.log('Activity changed to:', val);
          setValue("preferableActivity", val, { shouldValidate: true });
          trigger("preferableActivity");
        }}
        error={errors.preferableActivity?.message}
      />
    </div>

    <button
      type="submit"
      className="w-full bg-[#9EF300] hover:bg-lime-500 text-black font-medium py-3 rounded-md focus:outline-none"
      disabled={isLoading}
    >
      {isLoading ? "Creating Account..." : "Create An Account"}
    </button>
  </form>

  <AuthFooter
    message="Already have an account?"
    linkText="LOGIN HERE"
    linkUrl="/login"
  />
</div> </div>


  </AuthLayout>
);
};

export default RegistrationForm;
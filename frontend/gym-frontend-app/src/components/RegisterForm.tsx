import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/store';
import { registerUser, clearError } from '../services/authSlice';
import { QuoteSidebar } from "./common/QuoteBanner";
import Input from "./common/Input";
import { RegistrationFormData } from "../types";
import Dropdown from "./DropdownWrapper";
import SystemAlert from './SystemAlert';

import AuthLayout from "./layout/authLayout";
import AuthFooter from "./auth/AuthFooter";

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
  { value: "rehabilitation", label: "Rehabilitation" }, // Fixed capitalization
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
 
  const targets = watch("targets");
  const preferableActivity = watch("preferableActivity");

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const isTargetValid = await trigger("targets");
    const isActivityValid = await trigger("preferableActivity");

    if (!isTargetValid || !isActivityValid) return;

    const { targets, preferableActivity, ...rest } = data;
    const payload = {
      ...rest,
      target: targets,
      activity: preferableActivity,
    };

    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
      setShowSuccessAlert(true);
      reset();

      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate("/login");
      }, 2500);
    } else {
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    if (error && showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
        dispatch(clearError());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error, showErrorAlert, dispatch]);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, navigate]);
 
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
      <div className="max-w-md mx-auto w-full py-4">
        <h2 className="text-gray-700 mb-1 uppercase text-xs font-lexend">Let&apos;s Get You Started</h2>
        <h1 className="text-2xl font-lexend mb-6">Create an Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
  label="First Name"
  name="firstName"
  placeholder="Enter your first name"
  register={register("firstName", {
    required: "First Name is required",
    minLength: {
      value: 2,
      message: "must be at least 2 characters."
    },
    maxLength: {
      value: 50,
      message: "not exceed 50 characters."
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "must only contain letters/spaces."
    }
  })}
  error={errors.firstName?.message}
  helpText="e.g. Jonson"
/>


            <Input
              label="Last Name"
              name="lastName"
              placeholder="Enter your Last Name"
              register={register("lastName", {
                required: "Last Name is required",
                minLength: {
                  value: 2,
                  message: "must be at least 2 characters."
                },
                maxLength: {
                  value: 50,
                  message: " must not exceed 50 characters."
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "must only contain letters/spaces."
                }
              })}
              error={errors.lastName?.message}
              helpText="e.g. Doe"
            />
          </div>

          <Input
  label="Email"
  name="email"
  type="email"
  placeholder="e.g. username@domain.com"
  register={register("email", {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email format",
    },
  })}
  error={errors.email?.message}
  helpText="e.g. username@domain.com"
/>



<Input
  label="Password"
  name="password"
  type="password"
  placeholder="Enter your password"
  register={register("password", {
    validate: (value) => {
      if (!value) return "Password is required";
      if (value.length < 8 || value.length > 16) return "Password must be 8-16 character long";
      
      if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value) || !/[!@#$%^&*]/.test(value) ) return "include mix of uppercase/lowercase/numbers/special characters";
      
      return true;
    },
  })}
  error={errors.password?.message}
  helpText="At least one capital letter, one number, and one special character required"
/>


  
<div className="z-20">
<Dropdown
  label="Your Target"
  name="targets"
  options={TARGET_OPTIONS}
  value={targets}
  onChange={(val) => {
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
  value={preferableActivity}
  onChange={(val) => {
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
    </div>
  </AuthLayout>
);
};

export default RegistrationForm;

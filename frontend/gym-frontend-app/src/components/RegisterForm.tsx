import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/store';
import { registerUser, clearError } from '../services/authSlice';
import { QuoteSidebar } from "./common/QuoteBanner";
import Input from "./common/Input";

import AuthFooter from './auth/AuthFooter';
import { RegistrationFormData } from "../types";
import DropdownField from "./common/Selection";
import AuthLayout from "./layout/authLayout";
import SystemAlert from './SystemAlert';

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
  { value: "weight-training", label: "Weight Training" },
  { value: "cardio", label: "Cardio" },
  { value: "pilates", label: "Pilates" },
  { value: "crossfit", label: "CrossFit" },
  { value: "swimming", label: "Swimming" },
  { value: "cycling", label: "Cycling" },
];

const TickSVG = () => (
  <svg
    className="inline absolute right-4 w-4 h-4 text-grey-500 float-right"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
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

    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      setShowSuccessAlert(true);
      reset(); // clear form fields
    
      // 👇 Navigate to login after short delay
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate("/login");
      }, 2500); // Wait 2s before redirect
    } else {
      setShowErrorAlert(true);
    }
  };
   // Auto-dismiss error alert
  useEffect(() => {
    if (error && showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, showErrorAlert, dispatch]);

  // Auto-dismiss success alert
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/login')
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
              placeholder="Enter your First Name"
              register={register("firstName", { required: "First Name is required" })}
              error={errors.firstName?.message}
              helpText="e.g. Jonson"
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="Enter your Last Name"
              register={register("lastName", { required: "Last Name is required" })}
              error={errors.lastName?.message}
              helpText="e.g. Doe"
            />
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              pattern: {
                value: /^(?=.*[A-Z]).*$/,
                message: "Password must contain at least one capital letter",
              },
            })}
            error={errors.password?.message}
            helpText="At least one capital letter required"
          />

          <div className="relative z-20">
            <DropdownField
              label="Your Target"
              name="targets"
              options={TARGET_OPTIONS.map(opt => ({
                ...opt,
                label: (
                  <span className="flex justify-between items-center">
                    {opt.label}
                    {opt.value === targets && <TickSVG />}
                  </span>
                )
              }))}
              value={targets}
              onChange={(val) => {
                setValue("targets", val, { shouldValidate: true });
                trigger("targets");
              }}
              error={errors.targets?.message}
            />
          </div>

          <div className="relative z-10">
            <DropdownField
              label="Preferable Activity"
              name="preferableActivity"
              options={ACTIVITY_OPTIONS.map(opt => ({
                ...opt,
                label: (
                  <span className="flex justify-between items-center">
                    {opt.label}
                    {opt.value === preferableActivity && <TickSVG />}
                  </span>
                )
              }))}
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

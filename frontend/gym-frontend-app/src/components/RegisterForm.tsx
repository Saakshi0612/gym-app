import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/store';
import { registerUser, clearError } from '../services/authSlice';
import { QuoteSidebar } from "./common/QuoteBanner";
import Input from "./common/Input";
import { RegistrationFormData } from "../types";
import DropdownField from "./common/Selection";
import SystemAlert from './SystemAlert';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthLayout from "./layout/authLayout";

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

// const TickSVG = () => (
//   <svg
//     className="inline absolute right-4 w-4 h-4 text-grey-500 float-right"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="3"
//     viewBox="0 0 24 24"
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//   </svg>
// );

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
  const [showPassword, setShowPassword] = useState(false);
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
 const passwordToggleIcon = (
    <div
      onClick={() => setShowPassword(prev => !prev)}
      className="cursor-pointer text-lg"
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
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
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">LET'S GET YOU STARTED</h3>
          <h1 className="text-2xl font-bold text-neutral-900">Create an Account</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Enter your First Name"
              register={register("firstName", { required: "First name is required" })}
              error={errors.firstName?.message}
              helpText="e.g. Jonson"
            />

            <Input
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Enter your Last Name"
              register={register("lastName", { required: "Last name is required" })}
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
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
            helpText="e.g. username@domain.com"
          />

          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
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
            rightElement={passwordToggleIcon}
          />

          <div className="space-y-4">
            <DropdownField
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

            <DropdownField
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
            disabled={isLoading}
            className="w-full bg-[#9ef300] text-neutral-900 font-semibold py-4 rounded-lg hover:bg-[#8edc00] transition-colors duration-200"
          >
            {isLoading ? "Creating Account..." : "Create An Account"}
          </button>

          <div className="text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-neutral-900 font-semibold hover:text-[#9ef300] transition-colors duration-200"
            >
              LOGIN HERE
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegistrationForm;

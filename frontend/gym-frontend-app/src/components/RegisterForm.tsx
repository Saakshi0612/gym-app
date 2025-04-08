// // src/components/RegistrationForm.tsx
// import React, { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from '../store/store';
// import { registerUser } from '../services/authSlice';
// import DropdownField from "./common/Dropdown";
// import { QuoteSidebar } from "./common/QuoteBanner";
// import Input from "./common/Input";

// interface RegistrationFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   targets: string;
//   preferableActivity: string;
// }

// const TARGET_OPTIONS = [
//   { value: "lose-weight", label: "Lose Weight" },
//   { value: "gain-weight", label: "Gain Weight" },
//   { value: "improve-flexibility", label: "Improve Flexibility" },
//   { value: "general-fitness", label: "General Fitness" },
//   { value: "build-muscle", label: "Build Muscle" },
//   { value: "rehab-recovery", label: "Rehabilitation/Recovery" },
// ];

// const ACTIVITY_OPTIONS = [
//   { value: "yoga", label: "Yoga" },
//   { value: "weight-training", label: "Weight Training" },
//   { value: "cardio", label: "Cardio" },
//   { value: "pilates", label: "Pilates" },
//   { value: "crossfit", label: "CrossFit" },
//   { value: "swimming", label: "Swimming" },
//   { value: "cycling", label: "Cycling" },
// ];

// const RegistrationForm: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     trigger,
//     reset,
//   } = useForm<RegistrationFormData>();

//   const [resetDropdownSignal, setResetDropdownSignal] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { isLoading, error } = useAppSelector(state => state.auth);

//   const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
//     const resultAction = await dispatch(registerUser(data));
    
//     if (registerUser.fulfilled.match(resultAction)) {
//       alert("Registration Successful!");
//       navigate('/dashboard');
//     } else {
//       alert(error || "Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row w-full lg:w-[90%] mx-0 lg:mx-auto">
//       <div className="flex flex-col w-full lg:w-[60%] sm:max-h-[90%] lg:h-[40vh] py-12 px-25 bg-white">
//         <h2 className="text-[15px] md:text-[17px] font-[5px] text-[#323A3A]">
//           Let's Get You Started
//         </h2>
//         <h1 className="text-[19px] md:text-2xl font-bold text-gray-900 mb-10">
//           Create an Account
//         </h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <Input
//               label="First Name"
//               name="firstName"
//               placeholder="Enter your First Name"
//               register={register("firstName", { required: "First Name is required" })}
//               error={errors.firstName?.message}
//               helpText="e.g. Jonson"
//             />
//             <Input
//               label="Last Name"
//               name="lastName"
//               placeholder="Enter your Last Name"
//               register={register("lastName", { required: "Last Name is required" })}
//               error={errors.lastName?.message}
//               helpText="e.g. Doe"
//             />
//           </div>

//           <Input
//             label="Email"
//             name="email"
//             type="email"
//             placeholder="Enter your email"
//             register={register("email", {
//               required: "Email is required",
//               pattern: {
//                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                 message: "Invalid email format",
//               },
//             })}
//             error={errors.email?.message}
//             helpText="e.g. username@domain.com"
//           />

//           <Input
//             label="Password"
//             name="password"
//             type="password"
//             placeholder="Enter your password"
//             register={register("password", {
//               required: "Password is required",
//               minLength: { value: 8, message: "Password must be at least 8 characters" },
//               pattern: {
//                 value: /^(?=.*[A-Z]).*$/,
//                 message: "Password must contain at least one capital letter",
//               },
//             })}
//             error={errors.password?.message}
//             helpText="At least one capital letter required"
//           />

//           <DropdownField<RegistrationFormData>
//             label="Your Target"
//             name="targets"
//             options={TARGET_OPTIONS}
//             register={register}
//             setValue={setValue}
//             trigger={trigger}
//             error={errors.targets?.message}
//             resetSignal={resetDropdownSignal}
//           />

//           <DropdownField<RegistrationFormData>
//             label="Preferable Activity"
//             name="preferableActivity"
//             options={ACTIVITY_OPTIONS}
//             register={register}
//             setValue={setValue}
//             trigger={trigger}
//             error={errors.preferableActivity?.message}
//             resetSignal={resetDropdownSignal}
//           />

//           <button
//             type="submit"
//             className="w-full bg-[#9EF300] hover:bg-lime-500 text-black font-medium py-3 rounded-md focus:outline-none"
//             disabled={isLoading}
//           >
//             {isLoading ? "Creating Account..." : "Create An Account"}
//           </button>
//         </form>

//         <p className="text-center text-[12px] font-[lexend] leading-[100%] font-[300] text-[#212121] mt-4">
//           Already have an account?{" "}
//           <span
//             className="text-[#000000] font-[lexend] font-[600] cursor-pointer underline"
//             onClick={() => navigate("/login")}
//           >
//             Login Here
//           </span>
//         </p>
//       </div>

//       <QuoteSidebar />
//     </div>
//   );
// };

// export default RegistrationForm;

// src/components/RegistrationForm.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../store/store';
import { registerUser } from '../services/authSlice';
import DropdownField from "./common/Dropdown";
import { QuoteSidebar } from "./common/QuoteBanner";
import Input from "./common/Input";
import AuthLayout from './layout/authLayout';
import SystemErrorAlert from './SystemErrorAlert';
import AuthFooter from './auth/AuthFooter';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  targets: string;
  preferableActivity: string;
}

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

const RegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    reset,
  } = useForm<RegistrationFormData>();

  const [resetDropdownSignal, setResetDropdownSignal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const resultAction = await dispatch(registerUser(data));
    
    if (registerUser.fulfilled.match(resultAction)) {
      alert("Registration Successful!");
      navigate('/dashboard');
    } else {
      alert(error || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout
      sidebar={<QuoteSidebar />}
      systemError={error ? 
        <SystemErrorAlert message={error} onDismiss={() => {}} /> 
        : null
      }
    >
      <div className="max-w-md mx-auto w-full py-4">
        <h2 className="text-gray-700 mb-1 uppercase text-xs font-lexend">Let's Get You Started</h2>
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

          <DropdownField<RegistrationFormData>
            label="Your Target"
            name="targets"
            options={TARGET_OPTIONS}
            register={register}
            setValue={setValue}
            trigger={trigger}
            error={errors.targets?.message}
            resetSignal={resetDropdownSignal}
          />

          <DropdownField<RegistrationFormData>
            label="Preferable Activity"
            name="preferableActivity"
            options={ACTIVITY_OPTIONS}
            register={register}
            setValue={setValue}
            trigger={trigger}
            error={errors.preferableActivity?.message}
            resetSignal={resetDropdownSignal}
          />

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
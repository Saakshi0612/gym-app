// src/components/LoginForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../services/authSlice';
import SystemAlert from './SystemAlert';
import SubmitButton from './form/SubmitButton';
import AuthFooter from './auth/AuthFooter';
import { useAppDispatch, useAppSelector } from '../store/store';
import AuthLayout from './layout/authLayout';
import { QuoteSidebar } from './common/QuoteBanner';
import Input from './common/Input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useAppSelector(state => state.auth);

  const isSystemError = error && error.includes('technical difficulties');
  const passwordError = error && !isSystemError ? error : null;
  const systemError = isSystemError ? error : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      localStorage.setItem('user', JSON.stringify(resultAction.payload));
      setShowLoginSuccess(true);
    } else {
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    if (showLoginSuccess) {
      const timer = setTimeout(() => {
        setShowLoginSuccess(false);
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoginSuccess, navigate]);

  useEffect(() => {
    if (error && showErrorAlert) {
      const timer = setTimeout(() => {
        setShowErrorAlert(false);
        dispatch(clearError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, showErrorAlert, dispatch]);

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (passwordError) dispatch(clearError());
  };

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
          {systemError && showErrorAlert && (
            <SystemAlert
              type="error"
              message={systemError}
              onDismiss={() => {
                setShowErrorAlert(false);
                dispatch(clearError());
              }}
            />
          )}
          {showLoginSuccess && (
            <SystemAlert
              type="success"
              message="Login successful! Redirecting to home..."
              onDismiss={() => setShowLoginSuccess(false)}
            />
          )}
        </>
      }
    >
      <div className="max-w-md mx-auto w-full py-4">
        <h2 className="text-gray-700 mb-1 uppercase text-xs font-lexend">WELCOME BACK</h2>
        <h1 className="text-2xl font-lexend mb-6">Log In to Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Replaced EmailInput with reusable Input */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            helpText="e.g. username@domain.com"
          />

          {/* Replaced PasswordInput with reusable Input */}
          <Input
            label="Password"
            name="password"
            placeholder="Enter your Password "
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
            error={passwordError}
            helpText="At least one capital letter required"
            rightElement={passwordToggleIcon}
          />

          <SubmitButton
            isLoading={isLoading}
            text="Log In"
            loadingText="Logging in..."
          />
        </form>

        <AuthFooter
          message="Don't have an account?"
          linkText="CREATE NEW ACCOUNT"
          linkUrl="/register"
        />
      </div>
    </AuthLayout>
  );
}

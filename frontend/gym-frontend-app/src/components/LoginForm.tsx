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
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter your password"
              required
              rightIcon={passwordToggleIcon}
              error={passwordError}
            />
          </div>
          <div className="pt-2">
            <SubmitButton
              type="submit"
              isLoading={isLoading}
              text="Log In"
              fullWidth
            />
          </div>
        </form>
        <AuthFooter
          message="Don't have an account?"
          linkText="Sign up"
          linkUrl="/register"
        />
      </div>
    </AuthLayout>
  );
}

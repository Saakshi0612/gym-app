// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../services/authSlice';
import SystemErrorAlert from './SystemErrorAlert';
import EmailInput from './form/EmailInput';
import PasswordInput from './form/PasswordInput';
import SubmitButton from './form/SubmitButton';
import AuthFooter from './auth/AuthFooter';
import { useAppDispatch, useAppSelector } from '../store/store';
import AuthLayout from './layout/AuthLayout';
import { QuoteSidebar } from './common/QuoteBanner';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // If login is successful, save the user data to localStorage
      localStorage.setItem('user', JSON.stringify(resultAction.payload));
      navigate('/');
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (passwordError) dispatch(clearError());
  };

  return (
    <AuthLayout
      sidebar={<QuoteSidebar />}
      systemError={systemError ? 
        <SystemErrorAlert message={systemError} onDismiss={() => dispatch(clearError())} /> 
        : null
      }
    >
      <div className="max-w-md mx-auto w-full py-4">
        <h2 className="text-gray-700 mb-1 uppercase text-xs font-lexend">WELCOME BACK</h2>
        <h1 className="text-2xl font-lexend mb-6">Log In to Your Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput 
            value={email}
            onChange={setEmail}
            helpText="e.g. username@domain.com"
          />
          
          <PasswordInput 
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            helpText="At least one capital letter required"
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


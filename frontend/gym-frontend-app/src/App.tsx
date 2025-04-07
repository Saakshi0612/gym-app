// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/user_pages/dashboard';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import { useAppSelector } from './store/store';

// Protected route component using Outlet
const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Main app content
function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other protected routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppContent;
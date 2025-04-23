// src/App.tsx

import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { useAppSelector } from "./store/store";
import CoachesPage from "./pages/user_pages/Coaches";
import CoachProfilePage from "./pages/user_pages/CoachProfilePages";
import MainSection from "./components/homepage/Mainsection";
import ScheduledWorkoutPage from "./components/workouts/scheduledWorkoutPage";
import Header from "./components/common/Header";
import DynamicUserProfile from "./pages/UserProfile";

// Protected route component using Outlet
const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
  
  
// Main app content
function AppContent() {

  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<MainSection />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/coaches/:id" element={<CoachProfilePage />} />
        <Route path="/workout" element={<ScheduledWorkoutPage />} />
     

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainSection />} />
          <Route
          path="/account"
          element={<DynamicUserProfile />}
        />
          {/* Add other protected routes here as needed */}
        </Route>
      </Routes>
    </>
  );
}

export default AppContent;

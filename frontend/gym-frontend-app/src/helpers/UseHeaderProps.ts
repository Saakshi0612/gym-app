// headerUtils.ts
import { useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  loggedOutOnly?: boolean;
}

interface HeaderProps {
  navItems: NavItem[];
  isLoggedIn: boolean;
  userRole?: string;
  currentPath: string;
  welcomeText: string;
  showWelcomeBar: boolean;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onNavItemClick: (path: string) => void;
}

export const useHeaderProps = (
  isLoggedIn: boolean,
  userRole?: string,
  userName?: string,
  onLoginClick?: () => void,
  onSignUpClick?: () => void,
  onNavItemClick?: (path: string) => void
): HeaderProps => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define navigation items based on login status and role
  let navItems: NavItem[] = [];

  if (!isLoggedIn) {
    // Not logged in - show only Home and Coaches
    navItems = [
      { label: "Home", path: "/" },
      { label: "Coaches", path: "/coaches" }
    ];
  } else {
    // Logged in - show different tabs based on role
    switch (userRole) {
      case "COACH":
        navItems = [
          { label: "Workouts", path: "/workout" }
        ];
        break;
      case "CLIENT":
        navItems = [
          { label: "Home", path: "/" },
          { label: "Workouts", path: "/workout" },
          { label: "Coaches", path: "/coaches" }
        ];
        break;
      case "ADMIN":
        navItems = [
          { label: "Home", path: "/" },
          { label: "Reports", path: "/reports" }
        ];
        break;
      default:
        // Default case if role is not specified
        navItems = [
          { label: "Home", path: "/" }
        ];
    }
  }

  // Determine welcome bar visibility
  const showWelcomeBar = currentPath !== "/coaches";

  // Determine welcome text based on path and login status
  let welcomeText = "Welcome!";
  
  if (isLoggedIn) {
    switch (currentPath) {
      case "/":
        welcomeText = `Hello, ${userName || "User"}`;
        break;
      case "/workout":
        welcomeText = "My Workouts";
        break;
      case "/reports":
        welcomeText = "My Reports";
        break;
      default:
        welcomeText = `Hello, ${userName || "User"}`;
    }
  }

  return {
    navItems,
    isLoggedIn,
    userRole,
    currentPath,
    welcomeText,
    showWelcomeBar,
    onLoginClick: onLoginClick || (() => {}),
    onSignUpClick: onSignUpClick || (() => {}),
    onNavItemClick: onNavItemClick || (() => {})
  };
};
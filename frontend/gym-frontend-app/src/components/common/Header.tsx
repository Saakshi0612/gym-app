import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { RiFlashlightFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BackgroundHeader from "../../assets/Base.jpg";
import Button from "./ButtonComponent";
import { useAppSelector } from "../../store/store";
import { logout } from "../../services/authSlice";

import notification from "../../assets/images/notification.svg";
import profile from "../../assets/images/profile.svg";
import accountIcon from "../../assets/images/account.svg"; // Make sure you have this icon
import { useHeaderProps } from "../../helpers/UseHeaderProps";
import UserNavigation from "./Profilepop";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  console.log(isAuthenticated, isLoading, user);

  // Optional: Close menu on outside click or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const {
    navItems,
    onLoginClick,
    onSignUpClick,
    onNavItemClick,
    showWelcomeBar,
    welcomeText,
  } = useHeaderProps(
    isAuthenticated,
    user?.role,
    `${user?.firstName} ${user?.lastName}`,
    () => navigate("/login"),
    () => navigate("/register"),
    (path) => navigate(path)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleAccountClick = () => {
    navigate("/account");
  };

  // For mobile view, we'll use simpler components instead of the dropdown
  const MobileUserMenu = () => (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex items-center gap-2 py-2">
        <img src={profile} alt="Profile" className="w-6 h-6" />
        <div>
          <div className="font-semibold">{`${user?.firstName} ${user?.lastName}`}</div>
          <div className="text-sm text-neutral-500">{user?.email}</div>
          <div className="text-xs text-neutral-400">{user?.role}</div>
        </div>
      </div>
      
      <div 
        className="flex items-center gap-2 py-2 hover:bg-neutral-100 rounded-md cursor-pointer px-2"
        onClick={handleAccountClick}
      >
        <img src={accountIcon} alt="Account" className="w-4 h-4" />
        <div>
          <div className="text-sm font-medium">My Account</div>
          <div className="text-xs text-neutral-500">Edit account profile</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 py-2">
        <img src={notification} alt="Notifications" className="w-6 h-6" />
        <div className="text-sm font-medium">Notifications</div>
      </div>
      
      <Button
        onClick={handleLogout}
        variant="secondary"
        className="w-full mt-2"
      >
        Log Out
      </Button>
    </div>
  );

  return (
    <>
      <header className="shadow-md px-4 py-3 flex items-center justify-between gap-10 relative z-20">
        <div className="flex items-center gap-1 text-xl font-bold">
          <RiFlashlightFill />
          EnergyX
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center w-full justify-between gap-6">
          <ul className="flex gap-4">
            {navItems.map(({ label, path }) => (
              <li
                key={label}
                className={`border-b-2 ${
                  location.pathname === path
                    ? "border-primary-green"
                    : "border-transparent"
                }`}
              >
                <button onClick={() => onNavItemClick(path)}>{label}</button>
              </li>
            ))}
          </ul>
          
          {!isAuthenticated && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onLoginClick}>
                Log In
              </Button>
              <Button variant="secondary" onClick={onSignUpClick}>
                Sign Up
              </Button>
            </div>
          )}

          {isAuthenticated && (
            <UserNavigation
              isAuthenticated={isAuthenticated}
              userName={`${user?.firstName} ${user?.lastName}`}
              userEmail={user?.email}
              userDetail={user}
              notification={notification}
              profile={profile}
              accountIcon={accountIcon}
              handleLogout={handleLogout}
              handleAccountClick={handleAccountClick}
            />
          )}
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={20} />
          </button>
        </div>
      </header>

      {showWelcomeBar && (
        <div
          className="relative bg-cover bg-center text-white py-8 px-4"
          style={{ backgroundImage: `url(${BackgroundHeader})` }}
        >
          <div className="absolute inset-0 z-0" />
          <h1 className="relative z-10 text-2xl font-semibold">{welcomeText}!</h1>
        </div>
      )}

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/80 backdrop-blur-xs shadow-lg p-6 transform transition-transform duration-300 z-30 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-bold">Menu</div>
          <button onClick={() => setMenuOpen(false)} className="text-gray-500">
            ✕
          </button>
        </div>
        
        <ul className="flex flex-col gap-4 text-lg">
          {navItems.map(({ label, path }) => (
            <li key={label}>
              <button
                onClick={() => {
                  onNavItemClick(path);
                  setMenuOpen(false); // close sidebar
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {isAuthenticated && <MobileUserMenu />}
      </div>
    </>
  );
};

export default Header;
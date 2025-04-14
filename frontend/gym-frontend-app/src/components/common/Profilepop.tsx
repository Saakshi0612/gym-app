import React, { useRef, useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserNavigationProps } from '../../types';
import Button from './ButtonComponent';

const UserNavigation= ({
  isAuthenticated,
  userName,
  userEmail,
  userDetail,
  notification,
  profile,
  accountIcon,
  handleLogout,
  handleAccountClick
}:UserNavigationProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-10 flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <button
            aria-label="Notifications"
            className="-mt-1"
          >
            <img
              src={notification}
              alt="Notifications"
              className="h-6 w-6"
            />
          </button>
          <div className="relative">
            <button onClick={handleProfileClick}>
              <img
                src={profile}
                alt="Profile"
                className="h-6 w-6"
              />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-10 w-56 p-4 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
              >
                <div className="text-center mb-4">
                  <div className="font-semibold">{userName} ({userDetail?.role})</div>
                  <div className="text-sm text-neutral-500">{userEmail}</div>
                </div>
                <hr className="my-2" />
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
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="w-full mt-4 text-center"
                >
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <Button
          variant="secondary"
          onClick={() => navigate('/login')}
        >
          Log In
        </Button>
      )}

      <Button
        className="md:hidden text-black"
        onClick={() => setIsMobileMenuOpen(prev => !prev)}
        aria-label="Toggle Menu"
        variant="secondary"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default UserNavigation;
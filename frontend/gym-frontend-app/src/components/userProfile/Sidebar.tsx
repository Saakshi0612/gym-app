import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SidebarProps, SidebarTab, UserRole } from "../../types/components/sidebar.types";
import { logout } from "../../services/authSlice";

const Sidebar: React.FC<SidebarProps> = ({
  position = UserRole.CLIENT,
  activeTab,
  setActiveTab,
}) => {
  const isAdmin = position === UserRole.ADMIN;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const indicatorStyle = useMemo(
    () => ({
      backgroundColor: isAdmin
        ? "var(--color-semantic-blue)"
        : "var(--color-primary-green)",
    }),
    [isAdmin]
  );

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: SidebarTab.GENERAL_INFO, label: 'General Information' },
      { id: SidebarTab.CHANGE_PASSWORD, label: 'Change Password' },
    ];

    if (position === UserRole.COACH) {
      baseTabs.splice(1, 0, { id: SidebarTab.CLIENT_FEEDBACK, label: 'Client Feedback' });
    }

    return baseTabs;
  }, [position]);

  const handleLogout = () => {
    // Clear any stored profile drafts
    localStorage.removeItem('gym_app_profile_draft');
    
    // Dispatch logout action to clear auth state
    dispatch(logout());
    
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="md:h-screen flex flex-col">
      {/* Mobile Top Navbar (Non-Sticky) */}
      <div className="lg:hidden w-full bg-primary-white font-['Lexend'] shadow-sm mb-2">
        <div className={`grid ${position === UserRole.COACH ? 'grid-cols-3' : 'grid-cols-2'} gap-0`}>
          {/* General Information Tab */}
          <button
            onClick={() => setActiveTab(SidebarTab.GENERAL_INFO)}
            className={`relative text-xs px-1 py-3 whitespace-nowrap transition-all duration-200 ease-out ${
              activeTab === SidebarTab.GENERAL_INFO ? "font-medium text-primary-black" : "font-light text-neutral-700"
            }`}
          >
            General Information
            {activeTab === SidebarTab.GENERAL_INFO && (
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] transition-all"
                style={indicatorStyle}
              />
            )}
          </button>
          
          {/* Client Feedback Tab (Coach Only) */}
          {position === UserRole.COACH && (
            <button
              onClick={() => setActiveTab(SidebarTab.CLIENT_FEEDBACK)}
              className={`relative text-xs px-1 py-3 whitespace-nowrap transition-all duration-200 ease-out ${
                activeTab === SidebarTab.CLIENT_FEEDBACK ? "font-medium text-primary-black" : "font-light text-neutral-700"
              }`}
            >
              Client Feedback
              {activeTab === SidebarTab.CLIENT_FEEDBACK && (
                <span
                  className="absolute bottom-0 left-0 w-full h-[2px] transition-all"
                  style={indicatorStyle}
                />
              )}
            </button>
          )}
          
          {/* Change Password Tab */}
          <button
            onClick={() => setActiveTab(SidebarTab.CHANGE_PASSWORD)}
            className={`relative text-xs px-1 py-3 whitespace-nowrap transition-all duration-200 ease-out ${
              activeTab === SidebarTab.CHANGE_PASSWORD ? "font-medium text-primary-black" : "font-light text-neutral-700"
            }`}
          >
            Change Password
            {activeTab === SidebarTab.CHANGE_PASSWORD && (
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] transition-all"
                style={indicatorStyle}
              />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Full Height) */}
      <div className="hidden lg:block bg-primary-white h-full">
        <div className="flex flex-col">
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative flex items-center">
                <button
                  className={`w-full text-left px-6 py-3 text-base font-light transition-all duration-200 ease-out relative ${
                    activeTab === tab.id ? "font-medium text-primary-black bg-neutral-200" : "text-neutral-700 hover:bg-neutral-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {activeTab === tab.id && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200 ease-out"
                      style={indicatorStyle}
                    />
                  )}
                  {tab.label}
                </button>
              </div>
            ))}
          </div>
          
          {/* Log Out Button - Desktop Only */}
          <div className="hidden lg:block px-4 py-6">
            <button 
              onClick={handleLogout}
              className="w-24 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-primary-white border border-neutral-400 rounded-lg hover:bg-neutral-200 transition-all duration-200 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

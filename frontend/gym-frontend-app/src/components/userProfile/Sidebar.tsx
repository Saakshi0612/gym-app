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

  const tabs = [
    { id: SidebarTab.GENERAL_INFO, label: 'General Information' },
    { id: SidebarTab.CHANGE_PASSWORD, label: 'Change Password' },
    ...(position === UserRole.COACH
      ? [{ id: SidebarTab.CLIENT_FEEDBACK, label: 'Client Feedback' }]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="md:h-screen flex flex-col">
      {/* Mobile Top Navbar (Non-Sticky) */}
      <div className="lg:hidden w-full bg-primary-white font-['Lexend'] shadow-sm mb-2">
        <div className="flex overflow-x-auto px-0 gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative text-xs px-3 py-2.5 whitespace-nowrap transition-all duration-200 ease-out ${
                activeTab === tab.id ? "font-medium text-primary-black" : "font-light text-neutral-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 w-full h-[2px] transition-all"
                  style={indicatorStyle}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (Full Height) */}
      <div className="hidden lg:block bg-primary-white h-full">
        <div className="flex flex-col">
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative flex items-center">
                <button
                  className={`w-full text-left px-6 py-3 text-sm font-light transition-all duration-200 ease-out relative ${
                    activeTab === tab.id ? "font-medium text-primary-black bg-neutral-100" : "text-neutral-700 hover:bg-neutral-50"
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
          <div className="hidden lg:block px-4 py-4">
            <button 
              onClick={handleLogout}
              className="w-24 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all duration-200 ease-in-out"
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

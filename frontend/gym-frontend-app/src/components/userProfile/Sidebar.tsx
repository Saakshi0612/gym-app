import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SidebarProps, SidebarTab, UserRole } from "../../types/components/sidebar.types";
import { logout } from "../../services/authSlice";
import { User, Lock, Briefcase, Award, Dumbbell } from "lucide-react";

const Sidebar: React.FC<SidebarProps> = ({
  position = UserRole.CLIENT,
  activeTab,
  setActiveTab,
}) => {
  const isAdmin = position === UserRole.ADMIN;
  const isCoach = position === UserRole.COACH;
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

  const tabs: SidebarTab[] = useMemo(() => {
    return [
      SidebarTab.GENERAL_INFO,
      ...(isCoach ? [SidebarTab.CLIENT_FEEDBACK] : []),
      SidebarTab.CHANGE_PASSWORD,
    ];
  }, [isCoach]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Top Navbar (Non-Sticky) */}
      <div className="lg:hidden w-full bg-primary-white font-['Lexend'] shadow-sm">
        <div className="flex overflow-x-auto px-0 pt-3 pb-0 gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-sm px-4 py-2 whitespace-nowrap transition-all duration-200 ease-out ${
                activeTab === tab ? "font-medium text-primary-black" : "font-light text-neutral-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
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
        <div className="flex flex-col gap-2 p-4">
          {tabs.map((tab) => (
            <div key={tab} className="relative flex items-center">
              <button
                className={`w-full text-left px-4 py-3 text-sm font-light rounded-md transition-all duration-200 ease-out relative ${
                  activeTab === tab ? "font-medium text-primary-black" : "text-neutral-700"
                } hover:bg-neutral-200`}
                onClick={() => setActiveTab(tab)}
              >
                {activeTab === tab && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[2px] rounded-sm transition-all duration-200 ease-out"
                    style={indicatorStyle}
                  />
                )}
                {tab}
              </button>
            </div>
          ))}
          
          {/* Log Out Button - Now positioned right after the tabs */}
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-medium text-primary-black rounded-md hover:bg-neutral-200 transition-all duration-200 ease-in-out"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

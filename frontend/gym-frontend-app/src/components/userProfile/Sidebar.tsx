import React, { useMemo } from "react";
import { SidebarProps, SidebarTab, UserRole } from "../../types/components/sidebar.types";

const Sidebar: React.FC<SidebarProps> = ({
  position = UserRole.CLIENT,
  activeTab,
  setActiveTab,
}) => {
  const isAdmin = position === UserRole.ADMIN;
  const isCoach = position === UserRole.COACH;

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

  return (
    <div className="relative">
      {/* Mobile Top Navbar (Non-Sticky) */}
      <div className="lg:hidden w-full bg-primary-white font-['Lexend'] shadow-sm relative">
        <div className="flex overflow-x-auto px-0 pt-3 pb-0 gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative text-sm px-4 py-2 whitespace-nowrap transition-all duration-200 ease-out ${
                activeTab === tab ? "font-medium text-black" : "font-light text-neutral-700"
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

      {/* Desktop Sidebar (Non-Sticky) */}
      <div className="hidden lg:flex w-[250px] min-h-full bg-primary-white flex-col p-5 font-['Lexend']">
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <div key={tab} className="relative flex items-center">
              <button
                className={`w-full text-left px-4 py-3 text-sm font-light rounded-md transition-all duration-200 ease-out relative ${
                  activeTab === tab ? "font-medium" : ""
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

          {/* Log Out */}
          <div className="mt-auto pt-4">
            <button className="w-[90px] h-9 px-2 py-1 text-sm font-medium text-neutral-900 border border-neutral-700 rounded-md flex items-center justify-center hover:bg-neutral-200 transition-all duration-200 ease-in-out">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

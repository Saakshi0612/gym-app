import React, { useMemo, useState } from "react";
import { SidebarProps, SidebarTab, UserRole } from "../../types/components/sidebar.types";


const Sidebar: React.FC<SidebarProps> = ({
  position = UserRole.CLIENT,
  activeTab,
  setActiveTab,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdmin = position === UserRole.ADMIN;
  const isCoach = position === UserRole.COACH;

  const indicatorStyle = useMemo(
    () => ({
      backgroundColor: isAdmin ? "var(--color-semantic-blue)" : "var(--color-primary-green)",
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
      {/* Hamburger Menu Icon (Visible only on mobile) */}
      <button
        className="lg:hidden fixed top-6 left-6 text-2xl z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Blur Overlay when Sidebar is open */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block w-[250px] h-screen bg-primary-white flex flex-col p-5 font-['Lexend'] fixed lg:relative top-0 left-0 transition-all duration-300 z-50`}
      >
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <div key={tab} className="relative flex items-center">
              <button
                className={`w-full text-left px-4 py-3 text-sm font-light rounded-md transition-all duration-150 ease-in-out relative ${
                  activeTab === tab ? "font-medium" : ""
                } hover:bg-neutral-200`}
                onClick={() => {
                  setActiveTab(tab);
                  setIsSidebarOpen(false); // Close on mobile
                }}
              >
                {activeTab === tab && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[2px] rounded-sm transition-all duration-150 ease-in-out"
                    style={indicatorStyle}
                  />
                )}
                {tab}
              </button>
            </div>
          ))}

          <div className="mt-auto pt-4">
            <button className="w-[90px] h-9 px-2 py-1 text-sm font-medium text-neutral-900 border border-neutral-700 rounded-md flex items-center justify-center hover:bg-neutral-200 transition-all duration-150 ease-in-out">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

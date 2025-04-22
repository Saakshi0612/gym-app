import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SidebarProps, SidebarTab, UserRole } from "../../types/components/sidebar.types";
import { logout } from "../../services/authSlice";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants
const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const indicatorVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const logoutButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

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
    <motion.div 
      className="md:h-screen flex flex-col"
      initial="hidden"
      animate="visible"
    >
      {/* Mobile Top Navbar (Non-Sticky) */}
      <div className="lg:hidden w-full bg-primary-white font-['Lexend'] shadow-sm mb-2">
        <div className={`grid ${position === UserRole.COACH ? 'grid-cols-3' : 'grid-cols-2'} gap-0`}>
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative text-xs px-1 py-3 whitespace-nowrap transition-all duration-200 ease-out ${
                activeTab === tab.id ? "font-medium text-primary-black" : "font-light text-neutral-700"
              }`}
              variants={tabVariants}
              custom={index}
              whileHover="hover"
            >
              {tab.label}
              <AnimatePresence>
                {activeTab === tab.id && (
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-[2px]"
                    style={indicatorStyle}
                    variants={indicatorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    layoutId="mobileIndicator"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (Full Height) */}
      <div className="hidden lg:block bg-primary-white h-full">
        <div className="flex flex-col">
          <div className="flex flex-col">
            {tabs.map((tab, index) => (
              <motion.div 
                key={tab.id} 
                className="relative flex items-center"
                variants={tabVariants}
                custom={index}
              >
                <motion.button
                  className={`w-full text-left px-6 py-3 text-base font-light transition-all duration-200 ease-out relative ${
                    activeTab === tab.id ? "font-medium text-primary-black bg-neutral-200" : "text-neutral-700 hover:bg-neutral-200"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover="hover"
                >
                  <AnimatePresence>
                    {activeTab === tab.id && (
                      <motion.span
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={indicatorStyle}
                        variants={indicatorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layoutId="desktopIndicator"
                      />
                    )}
                  </AnimatePresence>
                  {tab.label}
                </motion.button>
              </motion.div>
            ))}
          </div>
          
          {/* Log Out Button - Desktop Only */}
          <motion.div 
            className="hidden lg:block px-4 py-6"
            variants={logoutButtonVariants}
          >
            <motion.button 
              onClick={handleLogout}
              className="w-24 px-3 py-2.5 text-sm font-medium text-neutral-700 bg-primary-white border border-neutral-400 rounded-lg hover:bg-neutral-200 transition-all duration-200 ease-in-out"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              Log Out
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

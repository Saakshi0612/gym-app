import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import UnifiedUserProfileForm from "../components/userProfile/UnifiedUserProfileForm";
import PasswordForm from "../components/userProfile/PasswordForm";
import ProfileFeedbackSection from "../components/userProfile/ProfileFeedbackSection";
import Sidebar from "../components/userProfile/Sidebar";
import { useAppSelector } from "../store/store";
import { UserRole } from "../types/components/UserProfileSettings.types";
import { SidebarTab } from "../types/components/sidebar.types";
import { updateUserProfile } from "../services/authSlice";

type Props = {
  role: UserRole | undefined;
};

const DynamicUserProfile: React.FC<Props> = ({ role }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.GENERAL_INFO);

  const localStorageKey = `user-profile-${role?.toLowerCase()}`;

  // Fetch profile data from localStorage or fallback to Redux store
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const localData = localStorage.getItem(localStorageKey);

        if (localData) {
          setProfileData(JSON.parse(localData));
        } else if (user) {
          const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
          const profileFromStore = {
            ...user,
            fullName,
            avatarUrl:
              user.avatarUrl ||
              "https://t4.ftcdn.net/jpg/02/62/46/55/240_F_262465578_xxIWQunF7zDbFpJDzSiYWJBwzMzPuEFh.jpg"
          };
          setProfileData(profileFromStore);
          localStorage.setItem(localStorageKey, JSON.stringify(profileFromStore));
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [role, user]);

  // Sync updated profile to localStorage and Redux
  const handleProfileUpdate = (updatedProfile: any) => {
    // Dispatch updateUserProfile to update the Redux store
    dispatch(updateUserProfile(updatedProfile));
    setProfileData(updatedProfile);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedProfile));
  };

  const renderTabContent = (): JSX.Element | null => {
    switch (activeTab) {
      case SidebarTab.GENERAL_INFO:
        return (
          <UnifiedUserProfileForm
            role={role as UserRole}
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case SidebarTab.CHANGE_PASSWORD:
        return (
          <PasswordForm
            user={{ currentPassword: profileData?.currentPassword ?? "" }}
          />
        );
      case SidebarTab.CLIENT_FEEDBACK:
        return role === UserRole.COACH ? <ProfileFeedbackSection /> : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen text-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Loading {role} data...
      </motion.div>
    );
  }

  if (!profileData) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen text-semantic-red"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        No profile data found for "{role}"
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-[250px] bg-white border-b lg:border-b-0 lg:border-r border-neutral-200">
        <Sidebar
          position={role as UserRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DynamicUserProfile;

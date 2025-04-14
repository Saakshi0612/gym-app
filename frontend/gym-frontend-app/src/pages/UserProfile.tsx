import React, { useEffect, useState } from "react";
import UnifiedUserProfileForm from "../components/userProfile/UnifiedUserProfileForm";
import PasswordForm from "../components/userProfile/PasswordForm";
import ProfileFeedbackSection from "../components/userProfile/ProfileFeedbackSection";
import Sidebar from "../components/userProfile/Sidebar";

import { UserRole } from "../types/components/UserProfileSettings.types";
import { SidebarTab } from "../types/components/sidebar.types";
import { useAppSelector } from "../store/store";

type Props = {
  role: 'client' | 'coach' | 'admin' | undefined;
};

const DynamicUserProfile: React.FC<Props> = ({ role }) => {
  const { user } = useAppSelector((state) => state.auth); // ✅ Lifted out for reuse
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.GENERAL_INFO);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/src/assets/JSON/data/mockProfiles.json");
        const data = await res.json();

        if (user) {
          const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
          setProfileData({ 
            ...user, 
            fullName, 
            avatarUrl: user.avatarUrl || 'https://t4.ftcdn.net/jpg/02/62/46/55/240_F_262465578_xxIWQunF7zDbFpJDzSiYWJBwzMzPuEFh.jpg' // Static image for avatar
          }); 
        } else {
          console.warn(`Role "${role}" not found in mock data.`);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, user]); // ✅ Added `user` as dependency

  if (loading) {
    return <div className="text-center py-10 text-body">Loading {role} data...</div>;
  }

  if (!profileData) {
    return <div className="text-center py-10 text-semantic-red">No profile data found for "{role}"</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case SidebarTab.GENERAL_INFO:
        return (
          <UnifiedUserProfileForm
            role={role as UserRole}
            profileData={profileData}
          />
        );

      case SidebarTab.CHANGE_PASSWORD:
        return (
          <PasswordForm user={{ currentPassword: profileData?.currentPassword ?? "" }} />
        );

      case SidebarTab.CLIENT_FEEDBACK:
        if (role === UserRole.COACH) return <ProfileFeedbackSection />;
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar (Mobile view above content, Desktop view as side menu) */}
      <div className="w-full lg:w-[250px] border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white sticky top-0 z-30">
        <Sidebar
          position={role as UserRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DynamicUserProfile;

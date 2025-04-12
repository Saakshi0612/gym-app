import React, { useEffect, useState } from "react";
import UnifiedUserProfileForm from "../components/userProfile/UnifiedUserProfileForm";
import PasswordForm from "../components/userProfile/PasswordForm";
import ProfileFeedbackSection from "../components/userProfile/ProfileFeedbackSection";
import Sidebar from "../components/userProfile/Sidebar";

import { UserRole } from "../types/components/UserProfileSettings.types";
import { SidebarTab } from "../types/components/sidebar.types";

type Props = {
  role: string;
};

const DynamicUserProfile: React.FC<Props> = ({ role }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.GENERAL_INFO);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/src/assets/JSON/data/mockProfiles.json"); // Adjust the path as needed
        const data = await res.json();
        if (data[role]) {
          const fullName = `${data[role].firstName ?? ""} ${data[role].lastName ?? ""}`.trim();
          setProfileData({ ...data[role], fullName });
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
  }, [role]);

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
      <div className="w-full lg:w-[250px] border-b lg:border-b-0 lg:border-r border-neutral-200">
        <Sidebar
          position={role as UserRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DynamicUserProfile;

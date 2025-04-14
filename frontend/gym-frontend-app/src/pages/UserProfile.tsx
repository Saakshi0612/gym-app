import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { UserRole } from "../types/components/UserProfileSettings.types";
import { SidebarTab } from "../types/components/sidebar.types";
import Sidebar from '../components/userProfile/Sidebar';
import UnifiedUserProfileForm from '../components/userProfile/UnifiedUserProfileForm';
import PasswordForm from '../components/userProfile/PasswordForm';
import ProfileFeedbackSection from '../components/userProfile/ProfileFeedbackSection';
import { AdminProfileData, CoachProfileData, ClientProfileData } from "../types/components/UserProfileSettings.types";

const DynamicUserProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.GENERAL_INFO);
  const [profileData, setProfileData] = useState<AdminProfileData | CoachProfileData | ClientProfileData | null>(null);

  useEffect(() => {
    if (user) {
      // Initialize profile data based on user role
      const baseProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || '',
      };

      switch (user.role) {
        case UserRole.ADMIN:
          setProfileData({
            ...baseProfile,
            phoneNumber: user.phoneNumber || '',
          } as AdminProfileData);
          break;
        case UserRole.COACH:
          setProfileData({
            ...baseProfile,
            title: user.title || '',
            about: user.about || '',
            tags: user.tags || [],
            certificates: user.certificates || [],
            rating: user.rating || 0,
          } as CoachProfileData);
          break;
        case UserRole.CLIENT:
          setProfileData({
            ...baseProfile,
            phoneNumber: user.phoneNumber || '',
            preferableActivity: user.preferableActivity || user.activity || '',
            targets: user.target || '',
            avatarUrl: user.avatarUrl || '',
          } as ClientProfileData);
          break;
      }
    }
  }, [user]);

  const renderTabContent = () => {
    if (!profileData || !user) return null;

    switch (activeTab) {
      case SidebarTab.GENERAL_INFO:
        return (
          <UnifiedUserProfileForm
            role={profileData.role}
            profileData={profileData}
          />
        );
      case SidebarTab.CHANGE_PASSWORD:
        return <PasswordForm />;
      case SidebarTab.CLIENT_FEEDBACK:
        return user.role === UserRole.COACH ? <ProfileFeedbackSection /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-white">
      <div className="w-64">
        <Sidebar
          position={user?.role as UserRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <main className="flex-1 p-8 overflow-auto">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default DynamicUserProfile;

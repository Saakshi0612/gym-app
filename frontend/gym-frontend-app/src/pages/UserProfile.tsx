import { useEffect, useState, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { UserRole } from "../types/components/UserProfileSettings.types";
import { SidebarTab } from "../types/components/sidebar.types";
import Sidebar from '../components/userProfile/Sidebar';
import { AdminProfileData, CoachProfileData, ClientProfileData } from "../types/components/UserProfileSettings.types";
import { toast } from "sonner";

// Lazy load components that aren't immediately needed
const UnifiedUserProfileForm = lazy(() => import('../components/userProfile/UnifiedUserProfileForm'));
const PasswordForm = lazy(() => import('../components/userProfile/PasswordForm'));
const ProfileFeedbackSection = lazy(() => import('../components/userProfile/ProfileFeedbackSection'));

// Constants
const AUTOSAVE_DELAY = 2000; // 2 seconds delay for autosave
const PROFILE_STORAGE_KEY = 'gym_app_profile_draft';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

// Error component
const ErrorDisplay = memo(({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-red-600">
    <p>{error}</p>
    <button 
      onClick={onRetry} 
      className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
    >
      Refresh Page
    </button>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

const DynamicUserProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.GENERAL_INFO);
  const [profileData, setProfileData] = useState<AdminProfileData | CoachProfileData | ClientProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved draft from localStorage
  const loadSavedDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        const savedTime = new Date(parsedDraft.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
        
        // Only restore draft if it's less than 24 hours old
        if (hoursDiff < 24) {
          setProfileData(parsedDraft.data);
          setLastSaved(savedTime);
          toast.info("Restored your last unsaved changes");
          return true;
        } else {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        }
      }
      return false;
    } catch (err) {
      console.error('Error loading draft:', err);
      return false;
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = useCallback((data: AdminProfileData | CoachProfileData | ClientProfileData) => {
    try {
      const draftData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draftData));
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error saving draft:', err);
    }
  }, []);

  // Generate profile data with error handling
  const generateProfileData = useCallback(() => {
    if (!user) return null;

    try {
      const baseProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || '',
      };

      switch (user.role) {
        case UserRole.ADMIN:
          return {
            ...baseProfile,
            phoneNumber: user.phoneNumber || '',
          } as AdminProfileData;
        case UserRole.COACH:
          return {
            ...baseProfile,
            title: user.title || '',
            about: user.about || '',
            tags: user.tags || [],
            certificates: user.certificates || [],
            rating: user.rating || 0,
          } as CoachProfileData;
        case UserRole.CLIENT:
          return {
            ...baseProfile,
            phoneNumber: user.phoneNumber || '',
            preferableActivity: user.preferableActivity || user.activity || '',
            targets: user.target || '',
            avatarUrl: user.avatarUrl || '',
          } as ClientProfileData;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error generating profile data:', error);
      setError('Error generating profile data. Please refresh the page.');
      return null;
    }
  }, [user]);

  // Initialize profile data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const hasDraft = loadSavedDraft();
      if (!hasDraft) {
        const newProfileData = generateProfileData();
        if (newProfileData) {
          setProfileData(newProfileData);
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Error loading profile data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, [generateProfileData, loadSavedDraft]);

  // Handle profile data changes
  const handleProfileChange = useCallback((newData: AdminProfileData | CoachProfileData | ClientProfileData) => {
    setProfileData(newData);
    setIsDirty(true);
  }, []);

  // Autosave effect with debounce
  useEffect(() => {
    if (!isDirty || !profileData) return;

    const timer = setTimeout(() => {
      saveDraft(profileData);
      setIsDirty(false);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [isDirty, profileData, saveDraft]);

  // Clear draft on successful save
  const handleSuccessfulSave = useCallback(() => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setIsDirty(false);
    setLastSaved(null);
  }, []);

  // Handle tab changes with unsaved changes warning
  const handleTabChange = useCallback((newTab: SidebarTab) => {
    if (isDirty) {
      const proceed = window.confirm('You have unsaved changes. Are you sure you want to leave this tab?');
      if (!proceed) return;
    }
    setActiveTab(newTab);
  }, [isDirty]);

  // Memoize the tab content
  const tabContent = useMemo(() => {
    if (isLoading) {
      return <LoadingFallback />;
    }

    if (error) {
      return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
    }

    if (!profileData || !user) return null;

    switch (activeTab) {
      case SidebarTab.GENERAL_INFO:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UnifiedUserProfileForm
              role={profileData.role}
              profileData={profileData}
              onChange={handleProfileChange}
              onSaveSuccess={handleSuccessfulSave}
              lastSaved={lastSaved}
            />
          </Suspense>
        );
      case SidebarTab.CHANGE_PASSWORD:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PasswordForm />
          </Suspense>
        );
      case SidebarTab.CLIENT_FEEDBACK:
        return user.role === UserRole.COACH ? (
          <Suspense fallback={<LoadingFallback />}>
            <ProfileFeedbackSection />
          </Suspense>
        ) : null;
      default:
        return null;
    }
  }, [activeTab, profileData, user, isLoading, error, handleProfileChange, handleSuccessfulSave, lastSaved]);

  // Memoize sidebar props
  const sidebarProps = useMemo(() => ({
    position: user?.role as UserRole,
    activeTab,
    setActiveTab: handleTabChange,
    isDirty
  }), [user?.role, activeTab, handleTabChange, isDirty]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-primary-white">
      <div className="w-full md:w-64 md:min-h-screen md:border-r border-neutral-200 flex-shrink-0">
        <Sidebar {...sidebarProps} />
      </div>
      <main className="flex-1 px-4 md:px-8 py-6 md:py-8 overflow-auto">
        <div className="max-w-4xl">
          {tabContent}
        </div>
      </main>
    </div>
  );
};

export default memo(DynamicUserProfile);

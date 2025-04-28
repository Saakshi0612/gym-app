import { useEffect, useState, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { UserRole } from "../types/components/UserProfileSettings.types";
import { SidebarTab } from "../types/components/sidebar.types";
import Sidebar from '../components/userProfile/Sidebar';
import { AdminProfileData, CoachProfileData, ClientProfileData } from "../types/components/UserProfileSettings.types";
import SuccessAlert from '../components/userProfile/shared/SuccessAlert';
import { motion } from "framer-motion";
import { fetchUserProfile, updateUserProfile } from "../services/authSlice";
import { AppDispatch } from "../store/store";

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
    <motion.div 
      className="flex flex-col items-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-16 h-16 rounded-full border-4 border-primary-green border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="text-primary-green font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading...
      </motion.div>
    </motion.div>
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
  const [info, setInfo] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

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
          setInfo("Restored your last unsaved changes");
          setTimeout(() => setInfo(null), 2000);
          return true;
        } else {
          localStorage.removeItem(PROFILE_STORAGE_KEY);
        }
      }
      return false;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading draft';
      setError(errorMessage);
      return false;
    }
  }, [setProfileData, setLastSaved, setInfo, setError]); 

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
  }, [setLastSaved]);

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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading profile data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [generateProfileData, loadSavedDraft, setError, setIsLoading]);

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchUserProfile());
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  // Handle profile data changes
  const handleProfileChange = useCallback((newData: AdminProfileData | CoachProfileData | ClientProfileData) => {
    setProfileData(newData);
    setIsDirty(true);
  }, [setIsDirty]);

  // Autosave effect with debounce
  useEffect(() => {
    if (!isDirty || !profileData) return;

    const timer = setTimeout(() => {
      saveDraft(profileData);
      setIsDirty(false);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [isDirty, profileData, saveDraft, setIsDirty]);

  // Handle successful save
  const handleSuccessfulSave = useCallback(() => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    setIsDirty(false);
    setLastSaved(null);
  }, [setIsDirty, setLastSaved]);

  // Handle profile save
  const handleSave = useCallback(async () => {
    if (!profileData || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert profile data to the format expected by the API
      const userData = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        avatarUrl: profileData.avatarUrl,
      };
      
      // Add role-specific fields
      if (user.role === 'client') {
        userData.preferableActivity = (profileData as ClientProfileData).preferableActivity;
        userData.target = (profileData as ClientProfileData).targets;
      } else if (user.role === 'coach') {
        userData.title = (profileData as CoachProfileData).title;
        userData.about = (profileData as CoachProfileData).about;
        userData.tags = (profileData as CoachProfileData).tags;
        userData.certificates = (profileData as CoachProfileData).certificates;
      }
      
      // Dispatch the update action
      await dispatch(updateUserProfile(userData));
      
      // Update last saved time
      setLastSaved(new Date());
      setInfo("Profile updated successfully");
      setTimeout(() => setInfo(null), 3000);
      
      // Clear draft
      handleSuccessfulSave();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [profileData, user, dispatch, handleSuccessfulSave, setIsLoading, setError, setInfo, setLastSaved]);

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
  }, [activeTab, profileData, user, isLoading, error, handleProfileChange, handleSave, handleSuccessfulSave, lastSaved]);

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
      <main className="flex-1 px-4 md:px-8 pt-6 md:pt-8 pb-16 transition-all duration-300 ease-in-out">
        <div className="max-w-4xl mx-auto transition-opacity duration-300 ease-in-out">
          {tabContent}
          {isDirty && (
            <div className="fixed bottom-8 right-8 z-50">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-3 bg-primary-green text-white rounded-lg shadow-lg hover:bg-primary-green-dark transition-colors duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
      {error && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
          <SuccessAlert
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}
      {info && (
        <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
          <SuccessAlert
            message={info}
            onClose={() => setInfo(null)}
          />
        </div>
      )}
    </div>
  );
};

export default memo(DynamicUserProfile);
DynamicUserProfile.displayName = 'DynamicUserProfile';

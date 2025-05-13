import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProfileFeedbackCard from '../userProfile/ProfileFeedBackCard';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { Feedback, FeedbackState } from '../../types/components/feedback.types';
import debounce from 'lodash/debounce';
import Spinner from '../common/Spinner';
import { feedbackService } from '../../services/feedbackService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const getFeedbacksPerPage = () => {
  const width = window.innerWidth;
  if (width >= 1536) return 6; // 2xl screens
  if (width >= 1280) return 6; // xl screens
  if (width >= 1024) return 3; // lg screens
  if (width >= 768) return 2;  // md screens
  return 2; // sm screens - show 2 on mobile
};

interface ProfileFeedbackSectionProps {
  coachId?: string; // Optional coach ID for viewing specific coach's feedback
  onFeedbackStatusUpdate?: (hasData: boolean) => void; // Callback to notify parent about feedback status
}

const ProfileFeedbackSection: React.FC<ProfileFeedbackSectionProps> = ({ 
  coachId,
  onFeedbackStatusUpdate 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedbacksPerPage, setFeedbacksPerPage] = useState(getFeedbacksPerPage());
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    data: [],
    loading: true,
    error: null
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const retryCount = useRef(0);
  const MAX_RETRIES = 2;
  
  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isCoach = currentUser?.role === 'coach';

  const debouncedResize = useMemo(
    () => debounce(() => {
      const newFeedbacksPerPage = getFeedbacksPerPage();
      setFeedbacksPerPage(newFeedbacksPerPage);
      setCurrentPage(1);
    }, 250),
    []
  );

  // Fetch feedbacks from API
  useEffect(() => {
    const fetchFeedbacks = async (): Promise<void> => {
      try {
        setFeedbackState(prev => ({ ...prev, loading: true, error: null }));
        
        let result;
        
        // Determine which API endpoint to use
        if (coachId) {
          // If coachId is provided, fetch that specific coach's feedbacks
          result = await feedbackService.getCoachFeedbacks(
            coachId,
            currentPage,
            feedbacksPerPage,
            'rating'
          );
        } else if (isCoach) {
          // If current user is a coach and no coachId provided, fetch their own received feedbacks
          result = await feedbackService.getMyReceivedFeedbacks(
            currentPage,
            feedbacksPerPage,
            'rating'
          );
        } else {
          // Fallback to mock data if not a coach and no coachId provided
          try {
            const data = await import('../../assets/JSON/mockFeedbacks.json');
            if (Array.isArray(data.default)) {
              const feedbacks = data.default.map(item => ({
                ...item,
                id: item.id.toString()
              }));
              
              setFeedbackState({
                data: feedbacks,
                loading: false,
                error: null
              });
              
              setTotalPages(Math.ceil(data.default.length / feedbacksPerPage));
              
              // Notify parent component about feedback status
              if (onFeedbackStatusUpdate) {
                onFeedbackStatusUpdate(feedbacks.length > 0);
              }
              
              return;
            }
          } catch (importError) {
            console.warn('Failed to import mockFeedbacks.json from assets:', importError);
            throw new Error('No feedback data available');
          }
        }
        
        // Update state with API response
        if (result) {
          setFeedbackState({
            data: result.feedbacks,
            loading: false,
            error: null
          });
          setTotalPages(result.totalPages);
          
          // Notify parent component about feedback status
          if (onFeedbackStatusUpdate) {
            onFeedbackStatusUpdate(result.feedbacks.length > 0);
          }
        }
        
        // Reset retry count on success
        retryCount.current = 0;
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        
        // Try one more time if we haven't exceeded retries
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.log(`Retrying feedback fetch (attempt ${retryCount.current}/${MAX_RETRIES})...`);
          setTimeout(fetchFeedbacks, 1000); // Wait 1 second before retrying
        } else {
          setFeedbackState({
            data: [],
            loading: false,
            error: 'Unable to load feedback data. Please refresh the page or try again later.'
          });
          
          // Notify parent component about feedback status
          if (onFeedbackStatusUpdate) {
            onFeedbackStatusUpdate(false);
          }
        }
      }
    };

    fetchFeedbacks();
  }, [currentPage, feedbacksPerPage, coachId, isCoach, onFeedbackStatusUpdate]);

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      debouncedResize.cancel();
    };
  }, [debouncedResize]);
  
  // Ensure currentPage is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const scrollToTop = useCallback(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const handlePageChange = (pageNumber: number): void => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      scrollToTop();
    }
  };

  const handleSwipe = (offset: number): void => {
    if (offset > 100) handlePageChange(currentPage - 1);
    else if (offset < -100) handlePageChange(currentPage + 1);
  };

  const handleRetry = () => {
    retryCount.current = 0;
    setFeedbackState(prev => ({ ...prev, loading: true, error: null }));
    // Trigger a re-fetch by updating the state
    setCurrentPage(prev => prev);
  };

  // If there's no feedback data and we're not loading, don't render anything
  // The parent component will handle showing the "No Feedback" message
  if (!feedbackState.loading && !feedbackState.error && feedbackState.data.length === 0) {
    return null;
  }

  return (
    <div
      ref={sectionRef}
      className="flex flex-col mt-4 md:mt-0 w-full overflow-hidden max-w-[95%] mx-auto"
      role="region"
      aria-label="User Feedback Section"
    >
      {feedbackState.loading ? (
        <div className="flex justify-center items-center py-8" role="status">
          <Spinner size="lg" />
          <span className="sr-only">Loading feedback...</span>
        </div>
      ) : feedbackState.error ? (
        <div 
          className="flex flex-col justify-center items-center py-8 text-red-600 gap-4"
          role="alert"
        >
          <p>{feedbackState.error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x: dragX }}
              dragElastic={0.1}
              onDragEnd={(_, info) => handleSwipe(info.offset.x)}
            >
              {feedbackState.data.map((feedback) => (
                <div key={feedback.id} className="w-full">
                  <ProfileFeedbackCard {...feedback} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <nav 
              className="mt-6 sm:pt-10 flex justify-center" 
              aria-label="Feedback pagination"
            >
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`text-sm px-2 ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  aria-label="Previous page"
                >
                  ‹
                </motion.button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <motion.button
                      key={pageNum}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-6 h-6 flex items-center justify-center text-sm border-b-2 transition-colors ${
                        currentPage === pageNum
                          ? 'border-[#9ef300] text-black font-medium'
                          : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                      }`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`text-sm px-2 ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                  aria-label="Next page"
                >
                  ›
                </motion.button>
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileFeedbackSection;
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProfileFeedbackCard from '../userProfile/ProfileFeedBackCard';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { Feedback, RawFeedback, FeedbackState } from '../../types/components/feedback.types';
import debounce from 'lodash/debounce';
import Spinner from '../common/Spinner';

const getFeedbacksPerPage = () => {
  const width = window.innerWidth;
  if (width >= 1536) return 6; // 2xl screens
  if (width >= 1280) return 6; // xl screens
  if (width >= 1024) return 3; // lg screens
  if (width >= 768) return 2;  // md screens
  return 2; // sm screens - show 2 on mobile
};

const ProfileFeedbackSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const debouncedResize = useMemo(
    () => debounce(() => {
      const newFeedbacksPerPage = getFeedbacksPerPage();
      setFeedbacksPerPage(newFeedbacksPerPage);
      setCurrentPage(1);
    }, 250),
    []
  );

  // Fetch feedbacks from JSON
  useEffect(() => {
    const fetchFeedbacks = async (): Promise<void> => {
      try {
        setFeedbackState(prev => ({ ...prev, loading: true, error: null }));
        
        // Try fetching from assets directory first (more reliable)
        try {
          const data = await import('../../assets/JSON/mockFeedbacks.json');
          if (Array.isArray(data.default)) {
            // Process and validate the data
            const processedFeedbacks = processFeedbackData(data.default);
            
            if (processedFeedbacks.length > 0) {
              setFeedbackState({
                data: processedFeedbacks,
                loading: false,
                error: null
              });
              return;
            }
          }
        } catch (importError) {
          console.warn('Failed to import mockFeedbacks.json from assets:', importError);
        }
        
        // Fallback to public directory
        const response = await fetch('/mockFeedbacks.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process and validate the data
        const processedFeedbacks = processFeedbackData(data);
        
        if (processedFeedbacks.length > 0) {
          setFeedbackState({
            data: processedFeedbacks,
            loading: false,
            error: null
          });
        } else {
          throw new Error('No valid feedback data found');
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
        }
      }
    };

    // Helper function to process and validate feedback data
    const processFeedbackData = (data: unknown): Feedback[] => {
      if (!Array.isArray(data)) {
        console.error('Invalid feedback data format: expected an array');
        return [];
      }

      // Track unique reviews to avoid duplicates
      const uniqueReviews = new Map<string, Feedback>();
      
      // Validate each feedback object
      data.forEach((feedback: unknown) => {
        // Type guard to ensure feedback is a RawFeedback
        if (
          typeof feedback === 'object' && 
          feedback !== null &&
          'id' in feedback &&
          'name' in feedback &&
          'date' in feedback &&
          'rating' in feedback &&
          'review' in feedback &&
          'avatarUrl' in feedback
        ) {
          const rawFeedback = feedback as RawFeedback;
          
          // Create a unique key based on ID only to preserve entries with different IDs
          const uniqueKey = rawFeedback.id;
          
          // Only process if it's a valid feedback object
          if (
            typeof rawFeedback.id === 'string' &&
            typeof rawFeedback.name === 'string' &&
            typeof rawFeedback.date === 'string' &&
            typeof rawFeedback.rating === 'number' &&
            typeof rawFeedback.review === 'string' &&
            typeof rawFeedback.avatarUrl === 'string' &&
            rawFeedback.rating >= 0 &&
            rawFeedback.rating <= 5
          ) {
            // Convert string ID to number
            const numericId = parseInt(rawFeedback.id, 10) || 0;
            
            // Only add if we haven't seen this ID before
            if (!uniqueReviews.has(uniqueKey)) {
              uniqueReviews.set(uniqueKey, {
                ...rawFeedback,
                id: numericId
              });
            }
          } else {
            console.warn('Invalid feedback entry:', rawFeedback);
          }
        } else {
          console.warn('Invalid feedback object structure:', feedback);
        }
      });

      // Convert map to array and sort by date (newest first)
      const processedFeedbacks = Array.from(uniqueReviews.values());
      
      // Sort by date (newest first)
      processedFeedbacks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(`Processed ${data.length} feedback entries, found ${processedFeedbacks.length} unique valid entries`);
      return processedFeedbacks;
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      debouncedResize.cancel();
    };
  }, [debouncedResize]);

  const totalPages = Math.ceil(feedbackState.data.length / feedbacksPerPage);
  
  // Ensure currentPage is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentFeedbacks = feedbackState.data.slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
              {currentFeedbacks.map((feedback) => (
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

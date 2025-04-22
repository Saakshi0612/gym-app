import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProfileFeedbackCard from '../userProfile/ProfileFeedBackCard';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { Feedback } from '../../types/components/feedback.types';
import debounce from 'lodash/debounce';
import Spinner from '../common/Spinner';

interface FeedbackState {
  data: Feedback[];
  loading: boolean;
  error: string | null;
}

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

  const handleResize = () => {
    const newFeedbacksPerPage = getFeedbacksPerPage();
    setFeedbacksPerPage(newFeedbacksPerPage);
    setCurrentPage(1);
  };

  const debouncedResize = useCallback(
    debounce(handleResize, 250),
    [setFeedbacksPerPage, setCurrentPage]
  );

  // Fetch feedbacks from JSON
  useEffect(() => {
    const fetchFeedbacks = async (): Promise<void> => {
      try {
        // Try fetching from public directory first
        const response = await fetch('/mockFeedbacks.json');
        if (!response.ok) throw new Error('Failed to load feedbacks');
        
        const data = await response.json();
        
        // Validate the data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid feedback data format');
        }

        // Validate each feedback object
        const validFeedbacks = data.filter((feedback: Feedback) => {
          return (
            typeof feedback.id === 'string' &&
            typeof feedback.name === 'string' &&
            typeof feedback.date === 'string' &&
            typeof feedback.rating === 'number' &&
            typeof feedback.review === 'string' &&
            typeof feedback.avatarUrl === 'string'
          );
        });

        if (validFeedbacks.length === 0) {
          throw new Error('No valid feedback data found');
        }

        setFeedbackState({
          data: validFeedbacks,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        // Try fetching from assets directory as fallback
        try {
          const data = await import('../../assets/JSON/mockFeedbacks.json');
          if (Array.isArray(data.default)) {
            setFeedbackState({
              data: data.default,
              loading: false,
              error: null
            });
            return;
          }
          throw new Error('Invalid feedback data format in fallback');
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setFeedbackState({
            data: [],
            loading: false,
            error: 'Failed to load feedback. Please try again later.'
          });
        }
      }
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
          className="flex justify-center items-center py-8 text-red-600"
          role="alert"
        >
          {feedbackState.error}
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

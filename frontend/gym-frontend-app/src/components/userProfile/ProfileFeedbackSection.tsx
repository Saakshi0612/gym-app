import React, { useState, useEffect, useRef } from 'react';
import ProfileFeedbackCard from '../userProfile/ProfileFeedBackCard';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { Feedback } from '../../types/components/feedback.types';

const getFeedbacksPerPage = () => {
  const width = window.innerWidth;
  if (width >= 1536) return 9;
  if (width >= 1280) return 6;
  if (width >= 768) return 4;
  return 2;
};

const ProfileFeedbackSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacksPerPage, setFeedbacksPerPage] = useState(getFeedbacksPerPage());
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  // Fetch feedbacks from JSON
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('../../assets/JSON/data/mockFeedbacks.json'); // Update path if needed
        if (!response.ok) throw new Error('Failed to load feedbacks');
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error loading feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const handleResize = () => setFeedbacksPerPage(getFeedbacksPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);
  const currentFeedbacks = feedbacks.slice(
    (currentPage - 1) * feedbacksPerPage,
    currentPage * feedbacksPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSwipe = (offset: number) => {
    if (offset > 100) handlePageChange(currentPage - 1);
    else if (offset < -100) handlePageChange(currentPage + 1);
  };

  return (
    <div
      ref={sectionRef}
      className="flex flex-col mt-16 sm:mt-0 min-h-[calc(100vh-100px)] w-full px-4 md:px-8 lg:px-16 pb-8 relative overflow-x-hidden"
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span>Loading...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            dragElastic={0.1}
            onDragEnd={(_, info) => handleSwipe(info.offset.x)}
          >
            {currentFeedbacks.map((feedback) => (
              <div key={feedback.id} className="h-full">
                <ProfileFeedbackCard {...feedback} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {totalPages > 1 && (
        <div className="pt-10">
          <div className="flex justify-center items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-caption text-neutral-600 hover:text-primary-black font-bold px-3 py-1 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              ‹
            </motion.button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              return (
                <motion.button
                  key={pageNum}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 text-caption font-medium border-b-2 transition ${
                    currentPage === pageNum
                      ? 'border-primary-green text-primary-black'
                      : 'border-transparent text-neutral-600'
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            })}

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`text-caption text-neutral-600 hover:text-primary-black font-bold px-3 py-1 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              ›
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFeedbackSection;

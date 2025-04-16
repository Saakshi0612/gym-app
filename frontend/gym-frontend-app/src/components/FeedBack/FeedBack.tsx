import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import FeedbackCard from './FeedBackCard';
import mockFeedbackData from '../../assets/JSON/Feedback.json';
import { Feedback } from '../../types/components/feedback.types';

const fetchFeedbackData = async (): Promise<Feedback[]> => {
  // When API is ready, replace this with:
  // const response = await fetch('your-api-endpoint');
  // const data = await response.json();
  // return data.feedbacks;
  
  return mockFeedbackData.feedbacks;
};

const FeedbackSection: React.FC = () => {
  const [sortBy, setSortBy] = useState<'Rating' | 'Date'>('Rating');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Always show exactly 3 feedbacks per page as in the image
  const feedbacksPerPage = 3;

  // Fetch feedback data from JSON file
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        // Properly call the async function and get the data directly
        const data = await fetchFeedbackData();
        setFeedbacks(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading feedback data');
        setLoading(false);
        console.error('Error fetching feedback data:', err);
      }
    };

    loadFeedbacks();
  }, []);

  // Sort feedbacks based on selected option
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortBy === 'Rating') {
      return b.rating - a.rating;
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Get current feedbacks - always exactly 3 per page
  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = sortedFeedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);

  if (loading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium uppercase">Feedback</h2>
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <span className="text-gray-500 text-sm mr-2">Sort by</span>
            <span className="font-medium text-sm mr-1">{sortBy}</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-700" />
          </div>

          {showSortOptions && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'Rating' ? 'font-medium' : ''}`}
                onClick={() => {
                  setSortBy('Rating');
                  setShowSortOptions(false);
                }}
              >
                Rating
              </div>
              <div
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortBy === 'Date' ? 'font-medium' : ''}`}
                onClick={() => {
                  setSortBy('Date');
                  setShowSortOptions(false);
                }}
              >
                Date
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Always 3 cards per row as in the image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {currentFeedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            name={feedback.name}
            date={feedback.date}
            rating={feedback.rating}
            review={feedback.review}
            avatarUrl={feedback.avatarUrl}
          />
        ))}
      </div>
      
      {/* Pagination with normal HTML buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 mb-12">
          <div className="flex items-center space-x-6">
            {/* Show the « icon to go back to previous pages when not on first set */}
            {currentPage > 3 && (
              <button
                type="button"
                className="bg-transparent p-2 border-none shadow-none rounded-none text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => {
                  const prevPage = Math.max(
                    Math.floor((currentPage - 1) / 3) * 3 - 2,
                    1
                  );
                  paginate(prevPage);
                }}
              >
                «
              </button>
            )}

            {/* Show only 3 pages at a time */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else {
                const setStart = Math.floor((currentPage - 1) / 3) * 3 + 1;
                pageNum = setStart + i;
              }

              if (pageNum > totalPages) return null;

              return (
                <button
                  key={i}
                  type="button"
                  className={`bg-transparent p-2 border-none shadow-none rounded-none relative text-sm font-medium pb-2 cursor-pointer${
                    currentPage === pageNum
                      ? 'text-black'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => paginate(pageNum)}
                >
                  {pageNum}
                  {currentPage === pageNum && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-green-500"></div>
                  )}
                </button>
              );
            })}

            {/* Show the » icon only if there are more pages beyond what's currently shown */}
            {totalPages > 3 && currentPage <= Math.floor((totalPages - 1) / 3) * 3 && (
              <button
                type="button"
                className="bg-transparent p-2 border-none shadow-none rounded-none text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                onClick={() => {
                  const nextPage = Math.min(
                    Math.ceil(currentPage / 3) * 3 + 1,
                    totalPages
                  );
                  paginate(nextPage);
                }}
              >
                »
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;
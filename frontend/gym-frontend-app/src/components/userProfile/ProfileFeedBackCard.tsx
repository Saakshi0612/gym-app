import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

// Default placeholder avatar
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOC40MiAxLjMzIDguNDIgNHY3YzAgMi43NS01Ljc1IDQtOC40MiA0LTIuNjcgMC04LjQyLTEuMjUtOC40Mi00di03YzAtMi42NyA1Ljc1LTQgOC40Mi00em0wIDEuNWMtMS44MyAwLTUuNDIuODMtNS40MiAyLjVzMy41OCAyLjUgNS40MiAyLjVjMS44MyAwIDUuNDItLjgzIDUuNDItMi41cy0zLjU4LTIuNS01LjQyLTIuNXptMCA5Yy0xLjgzIDAtNS40Mi0uODMtNS40Mi0yLjV2LTRjMS4xNyAxLjE3IDMuMzMgMS41IDUuNDIgMS41IDIuMDggMCA0LjI1LS4zMyA1LjQyLTEuNXY0YzAgMS42Ny0zLjU4IDIuNS01LjQyIDIuNXoiLz48L3N2Zz4=';

interface ProfileFeedbackCardProps {
  name: string;
  date: string;
  rating: number;
  review: string;
  avatarUrl: string;
}

const ProfileFeedbackCard: React.FC<ProfileFeedbackCardProps> = ({
  name,
  date,
  rating,
  review,
  avatarUrl,
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Ensure we have valid data
  const displayName = name || 'Anonymous';
  const displayDate = date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const displayRating = typeof rating === 'number' && rating >= 0 && rating <= 5 
    ? rating 
    : 0;
  const displayReview = review || 'No comment provided.';
  
  // Use the provided avatar URL, unless there was an error loading it
  const displayAvatarUrl = !imgError && avatarUrl ? avatarUrl : DEFAULT_AVATAR;

  const handleImageError = () => {
    console.log('Avatar image failed to load:', avatarUrl);
    setImgError(true);
  };

  return (
    <div className="bg-primary-white rounded-lg p-4 sm:p-5 xl:p-6 shadow-sm w-full max-w-[500px] sm:max-w-none mx-auto">
      {/* Top row: Avatar, name, date, rating */}
      <div className="flex items-start gap-3 mb-2 xl:mb-3">
        <img
          src={displayAvatarUrl}
          alt={`${displayName}'s avatar`}
          className="w-10 h-10 xl:w-12 xl:h-12 rounded-full object-cover mt-1 bg-gray-100"
          onError={handleImageError}
        />
        <div className="flex-1 min-w-0"> {/* Added min-width to ensure proper flex behavior */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="min-w-0"> {/* Added min-width to prevent text overflow */}
              <h3 className="text-body-bold truncate">{displayName}</h3>
              <p className="text-caption">{displayDate}</p>
            </div>
            <div className="flex flex-shrink-0 mt-1 sm:mt-0"> {/* Added flex-shrink-0 to prevent stars from shrinking */}
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    i < displayRating ? 'text-semantic-yellow' : 'text-neutral-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="text-body-2 text-left">{displayReview}</p>
    </div>
  );
};

export default ProfileFeedbackCard;
import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

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
  return (
    <div className="bg-primary-white rounded-lg p-5 xl:p-6 shadow-sm h-full min-h-[180px] xl:min-h-[200px]">
      {/* Top row: Avatar, name, date, rating */}
      <div className="flex items-start gap-3 mb-2 xl:mb-3">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-10 h-10 xl:w-12 xl:h-12 rounded-full object-cover mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-body-bold">{name}</h3>
              <p className="text-caption">{date}</p>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 xl:h-[17px] xl:w-[17px] ${
                    i < rating ? 'text-semantic-yellow' : 'text-neutral-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="text-body-2 text-left">{review}</p>
    </div>
  );
};

export default ProfileFeedbackCard;

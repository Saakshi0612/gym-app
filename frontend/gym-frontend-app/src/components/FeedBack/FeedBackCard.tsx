// FeedbackCard.tsx
import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { FeedbackCardProps } from '../../types/components/feedback.types';
const FeedbackCard: React.FC<FeedbackCardProps> = ({
  name,
  date,
  rating,
  review,
  avatarUrl
}) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-lg h-full w-full max-w-md">
      <div className="flex items-center mb-8">
        <img 
          src={avatarUrl} 
          alt={`${name}'s avatar`} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="font-medium text-sm">{name}</h3>
          <p className="text-gray-500 text-sm">{date}</p>
        </div>
        <div className="ml-auto flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-500 text-xs leading-relaxed mb-10">
        {review}
      </p>
    </div>
  );
};

export default FeedbackCard;
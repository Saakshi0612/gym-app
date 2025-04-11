// CoachCard.tsx
import React from "react";
import { CoachCardProps } from "../../types/components/coach.types";
import Button from "../common/ButtonComponent";
const CoachCard: React.FC<CoachCardProps> = ({
  name_of_coach,
  rating,
  title,
  description,
  imageUrl,
  onBookWorkout,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-md transition-shadow duration-300 w-full h-full flex flex-col">
      {/* Coach Image - Fixed height for consistency */}
      <div className="w-full h-48">
        <img
          src={imageUrl}
          alt={`${name}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Coach Info - Using flex-grow to ensure consistent card heights */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-medium text-gray-800">{name_of_coach}</h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-yellow-400 ml-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">{title}</p>

        {/* Using line-clamp to ensure consistent text length */}
        <p className="text-sm text-gray-600 mb-auto line-clamp-3 flex-grow">
          {description}
        </p>

        <Button
          onClick={(e) => onBookWorkout(e, name_of_coach)}
          variant="primary"
          fullWidth={true}
          className="mt-6 bg-primary-green hover:bg-lime-500 py-2 text-sm text-black cursor-pointer"
        >
          Book Workout
        </Button>
      </div>
    </div>
  );
};

export default CoachCard;

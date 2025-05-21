/* eslint-disable */
// @ts-nocheck
import { useState } from "react";
import { X, Star, Dumbbell, Clock, Calendar } from "lucide-react";
import { feedbackService } from "../../services/feedbackService";

// Default avatar as a data URI
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjY2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgOC40MiAxLjMzIDguNDIgNHY3YzAgMi43NS01Ljc1IDQtOC40MiA0LTIuNjcgMC04LjQyLTEuMjUtOC40Mi00di03YzAtMi42NyA1Ljc1LTQgOC40Mi00em0wIDEuNWMtMS44MyAwLTUuNDIuODMtNS40MiAyLjVzMy41OCAyLjUgNS40MiAyLjVjMS44MyAwIDUuNDItLjgzIDUuNDItMi41cy0zLjU4LTIuNS01LjQyLTIuNXptMCA5Yy0xLjgzIDAtNS40Mi0uODMtNS40Mi0yLjV2LTRjMS4xNyAxLjE3IDMuMzMgMS41IDUuNDIgMS41IDIuMDggMCA0LjI1LS4zMyA1LjQyLTEuNXY0YzAgMS42Ny0zLjU4IDIuNS01LjQyIDIuNXoiLz48L3N2Zz4=';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  workoutType: string;
  time: string;
  date: string;
  imageUrl: string;
  workoutId: string;
  coachName?: string;
}

export default function WorkoutFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  workoutType,
  time,
  date,
  imageUrl,
  workoutId,
  coachName = "Your Coach",
}: FeedbackModalProps) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

 const handleSubmit = async () => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  setError(null);
  
  try {
    // Submit feedback using the service
    await feedbackService.submitClientFeedback(workoutId, rating, comment);
    
    // Call the onSubmit callback with the new status
    onSubmit(rating, comment, 'Finished');
    
    // Close the modal
    onClose();
    
    // Dispatch a more detailed event to notify other components
    window.dispatchEvent(new CustomEvent('feedbackSubmitted', {
      detail: {
        workoutId,
        newStatus: 'Finished'
      }
    }));
  } catch (err: any) {
    setError(err.message || "Failed to submit feedback. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/30">
      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 relative">
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-1">Workout feedback</h2>
        <p className="text-sm text-gray-500 mb-4">
          Please rate your experience below
        </p>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Trainer + Workout Info in one line */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-4">
          {/* Trainer Info */}
          <div className="flex items-center gap-4">
            <img
              src={imageUrl || DEFAULT_AVATAR}
              alt="Trainer"
              className="w-12 h-12 rounded-full bg-gray-200 object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent infinite loop
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <p className="font-semibold">{coachName}</p>
              <p className="text-xs text-gray-500">
                Certified personal trainer
              </p>
            </div>
          </div>

          {/* Workout Details */}
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Dumbbell className="w-5 h-5" />
              <span>{workoutType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer ${
                i <= rating
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "stroke-gray-300"
              }`}
              onClick={() => setRating(i)}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">{rating}/5 stars</span>
        </div>

        {/* Comments */}
        <textarea
          placeholder="Add your comments"
          className="w-full h-20 border border-gray-300 rounded-md p-2 text-sm mb-4 resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <button
          className={`bg-lime-400 hover:bg-lime-500 text-black font-semibold py-2 px-4 rounded-md w-full transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
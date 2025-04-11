import { useState } from "react";
import { X, Star, Dumbbell, Clock, Calendar } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  workoutType: string;
  time: string;
  date: string;
}

export default function WorkoutFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  workoutType,
  time,
  date,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white w-[500px] rounded-lg shadow-xl p-6 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-1">Workout feedback</h2>
        <p className="text-sm text-gray-500 mb-4">
          Please rate your experience below
        </p>
        {/* Trainer + Workout Info in one line */}
        <div className=" flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-4">
          {/* Trainer Info */}
          <div className="flex items-center gap-4">
            <img
              src=""
              alt="Trainer"
              className="w-12 h-12 rounded-full bg-gray-200 object-cover"
            />
            <div>
              <p className="font-semibold">Kristin Watson</p>
              <p className="text-xs text-gray-500">
                Certified personal yoga trainer
              </p>
              <div className="flex items-center text-yellow-500 text-sm">
                4.96{" "}
                <Star className="w-4 h-4 ml-1 fill-yellow-500 stroke-yellow-500" />
              </div>
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
        />

        {/* Submit Button */}
        <button
          className="bg-lime-400 hover:bg-lime-500 text-black font-semibold py-2 px-4 rounded-md w-full transition-colors"
          onClick={() => onSubmit(rating, comment)}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

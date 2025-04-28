import React from "react";
import { Calendar, Clock, Dumbbell, X } from "lucide-react";
import Button from "../common/ButtonComponent";
import { CoachFromApi } from "../../types/components/coach.types";

interface ConfirmBookingCardProps {
  coach: CoachFromApi & {
    selectedTime: string;
    date: string;
  };
  onClose: () => void;
  onConfirm?: () => void;
}

const ConfirmBook: React.FC<ConfirmBookingCardProps> = ({
  coach,
  onClose,
  onConfirm,
}) => {
  // Extract values from coach object
  const {
    firstName,
    lastName,
    title,
    rating,
    specializations,
    profileImageUrl,
    selectedTime,
    date
  } = coach;

  // Format the coach name
  const coachName = `${firstName} ${lastName}`;
  
  // Get activity type from specializations
  const activityType = specializations && specializations.length > 0 
    ? specializations[0] 
    : "Workout";

  // Format the date
  const formattedDate = date ? new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  }) : "Date not specified";

  const handleConfirm = () => {
    console.log("Booking confirmed:", coach);
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-90 flex text-gray-800 items-center justify-center px-5 bg-black/30">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg relative px-6 py-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">
          Confirm your booking
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Please double-check your workout details.
        </p>

        <div className="flex items-start justify-between mb-6">
          {/* Coach Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border">
              <img
                src={profileImageUrl || "/default-avatar.png"}
                alt={coachName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {coachName}
              </p>
              <p className="text-sm text-gray-500">{title || "Coach"}</p>
              <p className="text-sm font-medium text-gray-800 flex items-center">
                {rating || "N/A"} <span className="text-yellow-400 ml-1">★</span>
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Type:</strong> {activityType}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Time:</strong> 1h
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Date:</strong> {formattedDate}, {selectedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          variant="primary"
          className="w-full bg-lime-400 text-black font-semibold py-3 rounded-lg hover:bg-lime-500 transition"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBook;
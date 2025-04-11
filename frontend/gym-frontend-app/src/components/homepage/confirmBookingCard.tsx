import React from "react";
import { Calendar, Clock, Dumbbell, X } from "lucide-react";

import CoachDataInterface from "../../types/components/CoachDataInterface";
import Button from "../common/ButtonComponent";

interface ConfirmBookingCardProps {
  coach: CoachDataInterface & {
    selectedTime: string;
  };
  onClose: () => void;
}

const ConfirmBookingCard: React.FC<ConfirmBookingCardProps> = ({
  coach,
  onClose,
}) => {
  const {
    name_of_coach,
    title,
    rating,
    type_of_sport,
    date,
    imageUrl,
    selectedTime,
  } = coach;

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  const formattedTime = new Date(`${date}T${selectedTime}`).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex text-gray-800 items-center justify-center px-5 bg-black/30">
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
                src={imageUrl}
                alt={name_of_coach}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {name_of_coach}
              </p>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-sm font-medium text-gray-800 flex items-center">
                {rating} <span className="text-yellow-400 ml-1">★</span>
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-gray-500" />
              <span>
                <strong>Type:</strong> {type_of_sport}
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
          onClick={() => {
            console.log("Booking confirmed:", coach);
            onClose();
          }}
          variant="primary"
          className="w-full bg-lime-400 text-black font-semibold py-3 rounded-lg hover:bg-lime-500 transition"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBookingCard;

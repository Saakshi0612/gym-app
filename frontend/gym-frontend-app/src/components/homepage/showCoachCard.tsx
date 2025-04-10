import React, { useState } from "react";
import { Dumbbell, Calendar, Clock } from "lucide-react";

import { useWorkoutContext } from "../../context/WorkoutContext";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";

import Button from "../common/ButtonComponent";
import ConfirmBookingCard from "./confirmBookingCard";
import LoginPromptModal from "./isLoggedInCard";

const ShowCochesCard: React.FC<any> = (coach) => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { filters } = useWorkoutContext();
  const selectedTime = filters.time;
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const timeArray = Array.isArray(coach.time) ? coach.time : [coach.time];
  const selected =
    selectedTime && selectedTime !== "all" ? selectedTime : timeArray[0];
  const remainingTimes = timeArray.filter((t: string) => t !== selected);

  const formattedDate = new Date(coach.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  const handleBookingClick = () => {
    if (isAuthenticated) {
      setShowModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl  p-4 shadow-xl rounded-2xl text-gray-700 bg-white relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-4 md:gap-5 items-center lg:w-[300px]">
            <div className="h-[80px] w-[80px] md:h-[100px] md:w-[100px] rounded-full overflow-hidden border shrink-0">
              {coach.imageUrl && (
                <img
                  src={coach.imageUrl}
                  alt={coach.name_of_coach}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="font-bold text-base md:text-lg">
                {coach.name_of_coach}
              </p>
              <p className="lg:text-sm md:text-base md:w-auto ">
                {coach.title}
              </p>
              <p className="mt-2 text-sm md:text-base">{coach.rating}⭐ </p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <fieldset className="border-2 border-primary-green rounded-xl px-1 py-2">
              <legend className="text-sm font-semibold px-2">
                Booking Details
              </legend>
              <div className="py-1 px-5 text-gray-600">
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Dumbbell className="w-5 h-5" />
                  <p>
                    <strong>Type:</strong> {coach.type_of_sport}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Clock className="w-5 h-5" />
                  <p>
                    <strong>Time:</strong> 1h
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Calendar className="w-5 h-5" />
                  <p>
                    <strong>Date:</strong> {formattedDate}, {selected}
                  </p>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-gray-700 text-sm sm:line-clamp-3 lg:h-10 lg:line-clamp-2 text-justify">
            {coach.description}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">Also Available for this date:</p>
          <div className="flex flex-wrap mt-2 gap-2">
            {remainingTimes.length > 0 ? (
              remainingTimes.map((slot: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-green-100 px-2 py-1 rounded text-sm"
                >
                  {slot}
                </span>
              ))
            ) : (
              <span className="bg-green-100 px-2 py-1 rounded text-sm">
                No more available times
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            variant="secondary"
            className="w-full sm:w-1/2 border border-gray-400 py-2 rounded-lg cursor-pointer"
          >
            <Link to={`/coaches/${coach.id}`}>Coach Profile</Link>
          </Button>

          <Button
            onClick={handleBookingClick}
            variant="primary"
            className="w-full sm:w-1/2 bg-primary-green text-black py-2 rounded-lg cursor-pointer"
          >
            Book Workout
          </Button>
        </div>
      </div>

      {showModal && (
        <ConfirmBookingCard
          coach={{ ...coach, selectedTime: selected }}
          onClose={() => setShowModal(false)}
        />
      )}

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onCancel={() => setShowLoginPrompt(false)}
        onLogin={() => navigate("/login")}
      />
    </>
  );
};

export default ShowCochesCard;

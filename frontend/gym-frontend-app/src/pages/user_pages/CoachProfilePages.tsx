// pages/CoachProfilePage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AvatarImg from '../../assets/images/avatar-1.png';
import CoachSidebar from '../../components/CoachComponents/CoachSideBar';
import CoachCalendarSection from '../../components/CoachComponents/CoachCalandarSection';
import FeedbackSection from '../../components/FeedBack/FeedBack';
import LoginPromptModal from '../../components/homepage/isLoggedInCard';
import SystemAlert from '../../components/SystemAlert';
import UpcomingWorkouts from '../../components/workouts/UpcomingWorkouts';
import ConfirmBookingCard from '../../components/homepage/confirmBookingCard';
import CoachHeader from '../../components/CoachComponents/CoachHeader';
import { useCoachData } from '../../hooks/UseCoachData';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import { useBookingWorkout } from '../../hooks/useBookingWorkouts';

const CoachProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Custom hooks
  const { coach, loading, error } = useCoachData(id);
  const { 
    availableTimeSlots, 
    apiTimeSlots,
    slotsLoading, 
    selectedTimeSlot,
    selectedDate,
    dateSelected,
    handleDateChange,
    handleTimeSlotSelect,
    fetchBookedSlots
  } = useTimeSlots(id);
  
  const {
    showConfirmCard,
    showLoginPrompt,
    showAlert,
    alertMessage,
    alertType,
    refreshWorkoutsKey,
    selectedCoachForBooking,
    handleBookWorkoutClick,
    handleWorkoutBooked,
    setShowConfirmCard,
    setShowLoginPrompt,
    setShowAlert,
    setSelectedCoachForBooking
  } = useBookingWorkout(
    coach, 
    apiTimeSlots, 
    selectedTimeSlot, 
    selectedDate, 
    dateSelected, 
    fetchBookedSlots
  );

  // Listen for workout booked event
  useEffect(() => {
    window.addEventListener('workoutBooked', handleWorkoutBooked);
    return () => {
      window.removeEventListener('workoutBooked', handleWorkoutBooked);
    };
  }, [coach, selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error || 'Coach not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* Alert Component */}
      {showAlert && (
        <SystemAlert
          type={alertType}
          message={alertMessage}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      <CoachHeader coach={coach} />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coach Sidebar */}
          <div className="lg:col-span-1">
            <div className="max-w-sm mx-auto md:max-w-md lg:max-w-full">
              <CoachSidebar
                name_of_coach={`${coach.firstName} ${coach.lastName}`}
                rating={coach.rating}
                title={coach.title}
                about={coach.about}
                specializations={coach.specializations}
                certificates={coach.certificateUrls.map((url) => ({
                  name: url.split('/').pop() || 'Certificate',
                  file: url,
                }))}
                profileImage={coach.profileImageUrl || AvatarImg}
                onBookWorkout={handleBookWorkoutClick}
              />
            </div>
          </div>

          {/* Right Column - Calendar, Buttons, and Feedback */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calendar Section */}
            <CoachCalendarSection
              selectedDate={selectedDate}
              availableTimeSlots={availableTimeSlots}
              onTimeSlotSelect={handleTimeSlotSelect}
              onDateChange={handleDateChange}
              slotsLoading={slotsLoading}
            />

            {/* Upcoming Workouts Section */}
            <div key={refreshWorkoutsKey}>
              <UpcomingWorkouts
                coachId={id as string}
                onWorkoutsLoaded={(workouts) => {
                  console.log('Workouts loaded in parent:', workouts.length);
                }}
              />
            </div>

            {/* Feedback Section */}
            <div>
              <FeedbackSection />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Card Modal */}
      {showConfirmCard && selectedCoachForBooking && (
        <ConfirmBookingCard
          coach={selectedCoachForBooking}
          onClose={() => {
            setShowConfirmCard(false);
            setSelectedCoachForBooking(null);
          }}
        />
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onCancel={() => setShowLoginPrompt(false)}
        onLogin={() => {
          localStorage.setItem('redirectAfterLogin', `/coaches/${id}`);
          navigate("/login");
        }}
      />
    </div>
  );
};

export default CoachProfilePage;
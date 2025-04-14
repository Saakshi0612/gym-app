import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import CoachSidebar from '../../components/CoachComponents/CoachSideBar';
import AvatarImg from '../../assets/Avatar.jpg';
import CoachAvailabilityCalendar from '../../components/CoachComponents/CoachCalendar';
import FeedbackSection from '../../components/FeedBack/FeedBack';
import { TimeSlot } from '../../types/components/coach.types';
import { Coach } from '../../types/components/coach.types';
import ConfirmBookingCard from '../../components/homepage/confirmBookingCard';
import LoginPromptModal from '../../components/homepage/isLoggedInCard';
import { ChevronRightIcon } from 'lucide-react';
import SystemAlert from '../../components/SystemAlert';

// Define the structure of the JSON file
interface CoachesData {
  coaches: Coach[];
}

const CoachProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 6, 3)); // July 3, 2024
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showConfirmCard, setShowConfirmCard] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Get authentication state from Redux
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Log authentication state for debugging
  useEffect(() => {
    console.log('Auth state in CoachProfilePage:', { isAuthenticated });
  }, [isAuthenticated]);

  // Sample time slots data
  const [availableTimeSlots] = useState<TimeSlot[]>([
    { id: '1', startTime: '8:00', endTime: '9:00 AM', isAvailable: true },
    { id: '2', startTime: '9:00', endTime: '10:00 AM', isAvailable: true },
    { id: '3', startTime: '10:00', endTime: '11:00 AM', isAvailable: true },
    { id: '4', startTime: '3:00', endTime: '4:00 PM', isAvailable: true },
    { id: '5', startTime: '4:00', endTime: '5:00 PM', isAvailable: false },
    { id: '6', startTime: '5:00', endTime: '6:00 PM', isAvailable: true }
  ]);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const response = await import('../../assets/JSON/Coaches.json');
        const coachesData: CoachesData = response.default;

        const coachId = parseInt(id || '0', 10);
        const foundCoach = coachesData.coaches.find(c => c.id === coachId);

        if (foundCoach) {
          setCoach(foundCoach);
        } else {
          setError('Coach not found');
        }
      } catch (err) {
        setError('Failed to load coach data');
        console.error('Error fetching coach data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [id]);

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    console.log(`Selected time slot: ${timeSlot.startTime} - ${timeSlot.endTime}`);
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookWorkoutClick = () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot before booking.");
      return;
    }
    
    // Check if user is authenticated
    if (isAuthenticated) {
      setShowConfirmCard(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleBookingConfirmed = () => {
    // Close the confirmation modal
    setShowConfirmCard(false);
    
    // Show success alert
    setAlertMessage(`Your workout with ${coach?.name_of_coach} has been booked successfully!`);
    setShowAlert(true);
    
    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const upcomingWorkouts = [
    {
      type: "Yoga",
      date: "July 9, 9:30",
      duration: "1 hour"
    }
  ];

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
      {/* Success Alert */}
      {showAlert && (
        <SystemAlert 
          type="success" 
          message={alertMessage} 
          onDismiss={() => setShowAlert(false)} 
        />
      )}
      
      <p className="flex items-center space-x-2 p-4">
        <span>Coaches</span>
        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
        <span className="text-gray-600">{coach.name_of_coach}</span>
      </p>

      <div className="max-w-7xl mx-auto">
        {/* Use grid for better responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Coach Sidebar - Full width on small and medium screens, 1/4 on large */}
          <div className="lg:col-span-1">
            <div className="max-w-sm mx-auto md:max-w-md lg:max-w-full">
              <CoachSidebar
                name_of_coach={coach.name_of_coach}
                rating={coach.rating}
                title={coach.title}
                about={"I have 8 years of experience in the field, having studied various styles of yoga and completed rigorous training programs. I have taught diverse groups, from beginners to advanced practitioners, in both studio and private settings. I have regularly engaged in community events and wellness retreats, inspiring others on their yoga journeys."}
                specializations={[coach.type_of_sport]}
                certificates={[
                  {
                    name: "Mindfulness-Based Stress Reduction (MBSR) Certification.pdf",
                    file: "/certificates/mbsr.pdf"
                  },
                  {
                    name: "Integrative Yoga Therapy Certification.pdf",
                    file: "/certificates/yoga-therapy.pdf"
                  }
                ]}
                profileImage={coach.imageUrl || AvatarImg}
                onBookWorkout={handleBookWorkoutClick}
              />
            </div>
          </div>

          {/* Right Column - Calendar, Buttons, and Feedback */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calendar Section */}
            <div className="overflow-hidden">
              <CoachAvailabilityCalendar
                initialDate={selectedDate}
                availableTimeSlots={availableTimeSlots}
                onTimeSlotSelect={handleTimeSlotSelect}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  console.log(`Date changed to: ${date.toDateString()}`);
                }}
              />
            </div>

            {/* Upcoming Workouts Section */}
            <div>
              <h2 className="text-lg font-medium uppercase mb-4">Upcoming Workouts</h2>
              {upcomingWorkouts.map((workout, index) => (
                <div key={index} className="flex justify-between items-center border-l-4 border-blue-400 bg-blue-50 p-3 rounded-r-md">
                  <div>
                    <h3 className="font-medium">{workout.type}</h3>
                    <p className="text-sm text-gray-600">{workout.date}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {workout.duration}
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Section */}
            <div>
              <FeedbackSection />
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Card Modal */}
      {showConfirmCard && selectedTimeSlot && (
        <ConfirmBookingCard
          coach={{
            ...coach,
            selectedTime: selectedTimeSlot.startTime,
            date: selectedDate.toISOString(),
          }}
          onClose={() => setShowConfirmCard(false)}
          onConfirm={handleBookingConfirmed}
        />
      )}
      
      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onCancel={() => setShowLoginPrompt(false)}
        onLogin={() => {
          // Store the current URL for redirect after login
          localStorage.setItem('redirectAfterLogin', `/coaches/${id}`);
          navigate("/login");
        }}
      />
    </div>
  );
};

export default CoachProfilePage;
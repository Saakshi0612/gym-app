import React, { useState } from 'react';
import CoachSidebar from '../../components/CoachComponents/CoachSideBar';
import AvatarImg from '../../assets/Avatar.jpg';
import CoachAvailabilityCalendar from '../../components/CoachComponents/CoachCalendar';
import FeedbackSection from '../../components/FeedBack/FeedBack';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const CoachProfilePage: React.FC = () => {
  // Sample time slots data
  const [availableTimeSlots] = useState<TimeSlot[]>([
    { id: '1', startTime: '8:00', endTime: '9:00 AM', isAvailable: true },
    { id: '2', startTime: '9:00', endTime: '10:00 AM', isAvailable: true },
    { id: '3', startTime: '10:00', endTime: '11:00 AM', isAvailable: true },
    { id: '4', startTime: '3:00', endTime: '4:00 PM', isAvailable: true },
    { id: '5', startTime: '4:00', endTime: '5:00 PM', isAvailable: false },
    { id: '6', startTime: '5:00', endTime: '6:00 PM', isAvailable: true }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 6, 3)); // July 3, 2024
  
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    console.log(`Selected time slot: ${timeSlot.startTime} - ${timeSlot.endTime}`);
    // Handle booking logic here
  };

  const upcomingWorkouts = [
    {
      type: "Yoga",
      date: "July 9, 9:30",
      duration: "1 hour"
    }
  ];

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Coach Info - reduced width */}
          <div className="lg:w-1/4 space-y-6">
            {/* Coach Sidebar */}
            <CoachSidebar
              name="Kristin Watson"
              rating={4.96}
              title="Certified personal yoga trainer"
              about="I have 8 years of experience in the field, having studied various styles of yoga and completed rigorous training programs. I have taught diverse groups, from beginners to advanced practitioners, in both studio and private settings. I have regularly engaged in community events and wellness retreats, inspiring others on their yoga journeys."
              specializations={["Yoga", "Personal workout", "Group workout"]}
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
              profileImage={AvatarImg}
            />
          </div>
          
          {/* Right Column - Calendar, Buttons, and Feedback - increased width */}
          <div className="lg:w-3/4 space-y-6">
            {/* Calendar Section */}
            <div className="overflow-hidden">
              <CoachAvailabilityCalendar
                initialDate={selectedDate}
                availableTimeSlots={availableTimeSlots}
                onTimeSlotSelect={handleTimeSlotSelect}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  // In a real app, you would fetch available slots for the new date
                  console.log(`Date changed to: ${date.toDateString()}`);
                }}
              />
            </div>
            
            {/* Upcoming Workouts Section */}
            <div className="">
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
            
            {/* Feedback Section - Now correctly positioned below calendar and time slots */}
            <div>
              <FeedbackSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachProfilePage;
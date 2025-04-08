import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CoachCard from '../../components/CoachComponents/CoachCard';
import coachesData from '../../assets/JSON/Coaches.json';

// Coach Interface and API Service
export interface Coach {
  id: string;
  name: string;
  rating: number;
  title: string;
  specialty: string;
  description: string;
  imageUrl: string;
}

// API functions - will be replaced with real API calls in the future
const coachesApi = {
  // Get all coaches
  fetchCoaches: async (): Promise<Coach[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Using the imported JSON file
    return coachesData.coaches;
  },
  
  // Book a workout with a coach
  bookCoachWorkout: async (coachId: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: `Workout booked successfully with coach ID: ${coachId}`
    };
  },
  
  // Get a coach by ID
  getCoachById: async (id: string): Promise<Coach | undefined> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return coachesData.coaches.find(coach => coach.id === id);
  }
};

// Main CoachesPage Component
const CoachesPage: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setLoading(true);
        const data = await coachesApi.fetchCoaches();
        setCoaches(data);
      } catch (err) {
        console.error('Failed to load coaches:', err);
        setError('Failed to load coaches. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCoaches();
  }, []);

  const handleBookWorkout = async (coachId: string) => {
    try {
      const result = await coachesApi.bookCoachWorkout(coachId);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Error booking workout:', err);
      alert('An error occurred while booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-full px-4 py-6 bg-gray-50">
      <h1 className="text-xl font-medium mb-6">Our Coaches</h1>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {coaches.map((coach) => (
          <Link to={`/coaches/${coach.id}`} key={coach.id} className="no-underline">
            <div className="h-full"> {/* Wrapper to ensure consistent height */}
              <CoachCard
                name={coach.name}
                rating={coach.rating}
                title={coach.title}
                description={coach.description}
                imageUrl={coach.imageUrl}
                onBookWorkout={(e, name) => {
                  e.preventDefault(); // Prevent the Link navigation
                  handleBookWorkout(coach.id);
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoachesPage;
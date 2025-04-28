import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import CoachCard from "../../components/CoachComponents/CoachCard";
import coachesData from "../../assets/JSON/Coaches.json";
import { Coach, CoachFromApi } from "../../types/components/coach.types";
import Button from "../../components/common/ButtonComponent";

// API simulation
const coachesApi = {
  fetchCoaches: async (): Promise<CoachFromApi[]> => {
    try {
      const response = await fetch("https://d4uzu22xh0.execute-api.ap-southeast-1.amazonaws.com/dev/coaches");
      
      if (!response.ok) {
        throw new Error("Failed to fetch coaches data");
      }
      
      const data = await response.json();  // Only parse JSON once

  
      return data as CoachFromApi[];  // Ensure the response structure matches your data
    } catch (error) {
      console.error("Error fetching coaches data:", error);
      return [];  // Return an empty array in case of failure
    }
  }
,  
  

  bookCoachWorkout: async (
    coachId: number
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      message: `Workout booked successfully with coach ID: ${coachId}`,
    };
  },

  getCoachById: async (id: number): Promise<Coach | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return coachesData.coaches.find((coach) => coach.id === id);
  },
};

const CoachesPage: React.FC = () => {
  const [coaches, setCoaches] = useState<CoachFromApi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCoaches = async () => {
      try {
        setLoading(true);
        const data = await coachesApi.fetchCoaches();
        setCoaches(data);
      } catch (err) {
        console.error("Failed to load coaches:", err);
        setError("Failed to load coaches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCoaches();
  }, []);

  const handleNavigate = (coachId: string) => {
    navigate(`/coaches/${coachId}`);
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
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-full px-4 py-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {coaches.map((coach) => (
          <div key={coach._id} className="h-full">
            <CoachCard
              name_of_coach={`${coach.firstName} ${coach.lastName}`}
              rating={coach.rating}
              title={coach.title}
              description={coach.about}  
              imageUrl={coach.profileImageUrl}
              onBookWorkout={() => handleNavigate(coach._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachesPage;

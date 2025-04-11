import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import CoachCard from "../../components/CoachComponents/CoachCard";
import coachesData from "../../assets/JSON/Coaches.json";
import { Coach } from "../../types/components/coach.types";
import Button from "../../components/common/ButtonComponent";

// API simulation
const coachesApi = {
  fetchCoaches: async (): Promise<Coach[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return coachesData.coaches;
  },

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
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate =useNavigate();
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

  // const handleBookWorkout = async (coachId: number) => {
  //   try {
  //     const result = await coachesApi.bookCoachWorkout(coachId);
  //     alert(result.message);
  //   } catch (err) {
  //     console.error("Error booking workout:", err);
  //     alert("An error occurred while booking. Please try again.");
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const handleNavigate = (coachId: number) => {
    navigate(`/coaches/${coachId}`);
  };

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
            <div className="h-full">
              <CoachCard
                name_of_coach={coach.name_of_coach}
                rating={coach.rating}
                title={coach.title}
                description={coach.description}
                imageUrl={coach.imageUrl}
                onBookWorkout={()=>handleNavigate(coach.id)}
              />
            </div>
        ))}
      </div>
    </div>
  );
};

export default CoachesPage;

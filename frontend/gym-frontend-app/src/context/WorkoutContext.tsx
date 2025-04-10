import React, { createContext, useContext, useState } from "react";
import CoachDataInterface from "../types/components/CoachDataInterface";

interface Filters {
  type_of_sport: string;
  date: string;
  time: string;
  name_of_coach: string;
  imageUrl: string;
}

interface WorkoutContextProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredResults: CoachDataInterface[];
  setFilteredResults: React.Dispatch<
    React.SetStateAction<CoachDataInterface[]>
  >;
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkoutContext = createContext<WorkoutContextProps | undefined>(
  undefined
);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<Filters>({
    type_of_sport: "all",
    date: "",
    time: "all",
    name_of_coach: "all",
    imageUrl: "",
  });

  const [filteredResults, setFilteredResults] = useState<CoachDataInterface[]>(
    []
  );
  const [showResults, setShowResults] = useState(false);

  return (
    <WorkoutContext.Provider
      value={{
        filters,
        setFilters,
        filteredResults,
        setFilteredResults,
        showResults,
        setShowResults,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export function useWorkoutContext(): WorkoutContextProps {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkoutContext must be used within a WorkoutProvider");
  }
  return context;
}

// export interface TimeSlot {
//   id: string;
//   startTime: string;
//   endTime: string;
//   isAvailable: boolean;
// }

// export interface TimeSlotsProps {
//   selectedDate: Date;
//   timeSlots: TimeSlot[];
//   selectedTimeSlotId: string | null;
//   onTimeSlotSelect: (timeSlot: TimeSlot) => void;
// }

// export interface Certificate {
//   name: string;
//   file: string;
// }

// export interface CoachProps {
//   name: string;
//   rating: number;
//   title: string;
//   about: string;
//   specializations: string[];
//   certificates: Certificate[];
//   profileImage: string;
// }

// export interface CoachCardProps {
//   name: string;
//   rating: number;
//   title: string;
//   description: string;
//   imageUrl: string;
//   onBookWorkout: (e: React.MouseEvent, coachName: string) => void;
// }

// export interface CoachAvailabilityCalendarProps {
//   initialDate?: Date;
//   availableTimeSlots: TimeSlot[];
//   onTimeSlotSelect: (timeSlot: TimeSlot) => void;
//   onDateChange?: (date: Date) => void;
// }

// export interface CalendarProps {
//   currentDate: Date;
//   selectedDate: Date;
//   onDateSelect: (date: Date) => void;
//   onMonthChange: (date: Date) => void;
// }

// export interface Coach {
//   id: string;
//   name: string;
//   rating: number;
//   title: string;
//   specialty: string;
//   description: string;
//   imageUrl: string;
// }

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlotsProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  selectedTimeSlotId: string | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
}

export interface Certificate {
  name: string;
  file: string;
}

// ✅ Main interface that matches your given coach JSON
export interface Coach {
  id: number;
  name_of_coach: string;
  rating: number;
  time: string[];
  date: string;
  title: string;
  type_of_sport: string;
  description: string;
  imageUrl: string;
}

// Optional: for detailed profile view (if needed later)
export interface CoachProps {
  name_of_coach: string;
  rating: number;
  title: string;
  about: string;
  description?: string;
  type_of_sport?: string;
  time?: string[];
  date?: string;
  profileImage: string;
  specializations?: string[];
  certificates?: Certificate[];
  onBookWorkout?: () => void;
}

export interface CoachCardProps {
  name_of_coach: string;
  rating: number;
  title: string;
  description: string;
  imageUrl: string;
  onBookWorkout: (e: React.MouseEvent, coachName: string) => void;
}

export interface CoachAvailabilityCalendarProps {
  initialDate?: Date;
  availableTimeSlots: TimeSlot[];
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onDateChange?: (date: Date) => void;
}

export interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}


export interface CoachFromApi {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string; // optional
  title: string;
  about: string;
  summary: string;
  rating: number;
  specializations: string[];
  certificateUrls: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number; // optional
}



export interface BookedWorkout {
  _id: string;
  name: string;
  activity: string;
  date: string;
  slot: string;
  slotDetails: {
    startTime: string;
    endTime: string;
  };
}

export interface BookedWorkoutsResponse {
  success: boolean;
  count: number;
  bookings: BookedWorkout[];
}

// Define the structure for upcoming workouts response
export interface UpcomingWorkout {
  _id: string;
  name: string;
  description: string;
  activity: string;
  date: string;
  slot: string;
  state: string;
  slotDetails: {
    startTime: string;
    endTime: string;
  } | null;
}

export interface UpcomingWorkoutsResponse {
  success: boolean;
  count: number;
  workouts: UpcomingWorkout[];
}



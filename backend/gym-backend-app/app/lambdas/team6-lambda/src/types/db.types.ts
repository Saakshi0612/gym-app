// interfaces.ts
import mongoose, { Document } from 'mongoose';

// Base User interface
export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  profileImageUrl?: string;
  role: 'CLIENT' | 'COACH' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

// Client interface extending User
export interface IClient extends IUser {
  role: 'CLIENT';
  preferableActivity?: string;
  target?: string;
}

// Coach interface extending User
export interface ICoach extends IUser {
  role: 'COACH';
  title?: string;
  about?: string;
  summary?: string;
  rating?: number;
  specializations?: string[];
  certificateUrls?: string[];
}

// Admin interface extending User
export interface IAdmin extends IUser {
  role: 'ADMIN';
  phoneNumber?: string;
}

// Coach Email interface
export interface ICoachEmail extends Document {
  email: string;
}

// Available Slot interface
export interface IAvailableSlot extends Document {
  startTime: Date;
  endTime: Date;
}

// Feedback interface
export interface IFeedback extends Document {
  from: mongoose.Types.ObjectId | IClient | ICoach;
  to: mongoose.Types.ObjectId | ICoach | IClient;
  workout: mongoose.Types.ObjectId | IWorkout;
  comment?: string;
  rating: number;
  date: Date;
  createdAt: Date;
}

// Workout interface
export interface IWorkout extends Document {
  name: string;
  description?: string;
  activity: string;
  coach: mongoose.Types.ObjectId | ICoach;
  client: mongoose.Types.ObjectId | IClient;
  date: Date;
  slot: mongoose.Types.ObjectId | IAvailableSlot;
  state: 'SCHEDULED' | 'FINISHED' | 'WAITING_FOR_FEEDBACK' | 'CANCELLED';
  clientFeedback?: mongoose.Types.ObjectId | IFeedback;
  coachFeedback?: mongoose.Types.ObjectId | IFeedback;
  createdAt: Date;
  updatedAt: Date;
}
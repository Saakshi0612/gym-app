import { Schema, model } from 'mongoose';
import { IWorkout } from '../types/db.types';

// Workout schema

  const workoutSchema = new Schema<IWorkout>(
    {
      description: { type: String },
      activity: { type: String, required: true },
      coach: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      date: { type: Date, required: true },
      slot: { type: Schema.Types.ObjectId, ref: 'AvailableSlot', required: true },
      state: { 
        type: String, 
        enum: ['SCHEDULED', 'FINISHED', 'WAITING_FOR_FEEDBACK', 'CANCELLED'], 
        default: 'SCHEDULED' 
      },
      clientFeedback: { type: Schema.Types.ObjectId, ref: 'Feedback' },
      coachFeedback: { type: Schema.Types.ObjectId, ref: 'Feedback' }
    },
    { timestamps: true }
  );
  


 export const WorkoutModel = model<IWorkout>('Workout', workoutSchema);



import  { Schema, model } from 'mongoose';
import { IFeedback } from '../types/db.types';


const feedbackSchema = new Schema<IFeedback>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  workout: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
  comment: { type: String },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const FeedbackModel = model<IFeedback>('Feedback', feedbackSchema);

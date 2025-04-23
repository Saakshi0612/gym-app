import  {  Schema, model } from 'mongoose';
import { ICoachEmail } from 'src/types/db.types';
// Coach Email schema

const coachEmailSchema = new Schema<ICoachEmail>({
  email: { type: String, required: true, unique: true }
});

export const CoachEmailModel = model<ICoachEmail>('CoachEmail', coachEmailSchema);
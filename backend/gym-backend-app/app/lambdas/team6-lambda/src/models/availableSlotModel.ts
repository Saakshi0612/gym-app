import  { Schema, model } from 'mongoose';
import { IAvailableSlot } from 'src/types/db.types';



const availableSlotSchema = new Schema<IAvailableSlot>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

export const AvailableSlotModel = model<IAvailableSlot>('AvailableSlot', availableSlotSchema);
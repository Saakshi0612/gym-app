import  {  Schema, model } from 'mongoose';
import { IAdminEmail } from '../types/db.types';
// Admin Email schema

const AdminEmailSchema = new Schema<IAdminEmail>({
  email: { type: String, required: true, unique: true }
});

export const AdminEmailModel = model<IAdminEmail>('AdminEmail', AdminEmailSchema);
import {  Schema, model } from 'mongoose';
import { IAdmin, IClient, ICoach, IUser } from '../types/db.types';



// Base User schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    profileImageUrl: { type: String },
    role: { 
      type: String, 
      required: true, 
      enum: ['CLIENT', 'COACH', 'ADMIN'],  // Removed 'USER'
      default: 'CLIENT'  // Changed default to 'CLIENT'
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role'
  }
);

// Create the base User model
const UserModel = model<IUser>('User', userSchema);

// Create Client model using discriminator
const ClientModel = UserModel.discriminator<IClient>(
  'CLIENT',
  new Schema<IClient>({
    preferableActivity: { type: String },
    target: { type: String }
  })
);

// Create Coach model using discriminator
const CoachModel = UserModel.discriminator<ICoach>(
  'COACH',
  new Schema<ICoach>({
    title: { type: String },
    about: { type: String },
    summary: { type: String },
    rating: { type: Number },
    specializations: [{ type: String }],
    certificateUrls: [{ type: String }]
  })
);

// Create Admin model using discriminator
const AdminModel = UserModel.discriminator<IAdmin>(
  'ADMIN',
  new Schema<IAdmin>({
    phoneNumber: { type: String }
  })
);


export {
    UserModel,
    ClientModel,
    CoachModel,
    AdminModel
  };
  
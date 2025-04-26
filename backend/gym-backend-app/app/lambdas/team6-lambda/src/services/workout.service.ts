import { WorkoutModel } from "../models/workoutModel";
import { DatabaseService } from "./database.service";
import { WorkoutBookingRequest } from "../controllers/workout.controller";
import { IWorkout } from "../types/db.types";

export class WorkoutService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }
  async MyBookedWorkouts({id}: {id: String}): Promise<IWorkout[]> {
    try {
      await this.dbService.connect();
 
      // Check if the user has already booked this exact workout
      const existingUserBooking = await WorkoutModel.find({
         $or: [{client:id }, {coach:id}] 

      });
      return existingUserBooking 
    }catch (error) {
      console.error("Error booking workout:", error);
      if (error.type === "RESPONSE") {
        throw error;
      }
      throw {
        message: "Failed to book workout. Please try again.",
        type: "RESPONSE",
        statusCode: 400
      }
    }
  }

  async bookWorkout({activity, coach, client, date, slot}: WorkoutBookingRequest): Promise<IWorkout> {
    try {
      await this.dbService.connect();
 
      // Check if the user has already booked this exact workout
      const existingUserBooking = await WorkoutModel.findOne({
        activity,
        coach,
        client,
        date,
        slot,
        state: { $ne: "CANCELLED" } // Exclude cancelled bookings by this user
      });
      
      console.info("Existing user booking:", existingUserBooking);

      if (existingUserBooking) {
        throw {
          message: "This workout session is already booked by you.",
          type: "RESPONSE",
          statusCode: 400
        };
      }

      // First check if this slot is available (not booked by anyone else)
      const activeBookings = await WorkoutModel.find({
        coach,
        date,
        slot,
        state: { $ne: "CANCELLED" } // Exclude cancelled bookings by anyone
      });
      
      console.info("Active bookings for this slot:", activeBookings);
      
      if (activeBookings.length !== 0) {
        throw {
          message: "This time slot is already booked!",
          type: "RESPONSE",
          statusCode: 400
        };
      }
     
      
      // Create new booking if no previous cancellation exists for this user
      const newWorkout = new WorkoutModel({
        activity,
        coach,
        client,
        date,
        slot,
        state: "SCHEDULED"
      });

      await newWorkout.save();
      console.info("Created new workout booking:", newWorkout);

      return newWorkout;
    } catch (error) {
      console.error("Error booking workout:", error);
      if (error.type === "RESPONSE") {
        throw error;
      }
      throw {
        message: "Failed to book workout. Please try again.",
        type: "RESPONSE",
        statusCode: 400
      }
    }
  }
  
  async cancelWorkout(workoutId: string, clientId: string): Promise<IWorkout> {
    try {
      await this.dbService.connect();
      
      const workout = await WorkoutModel.findById(workoutId);
      
      if (!workout) {
        throw {
          message: "Workout booking not found.",
          type: "RESPONSE",
          statusCode: 404
        };
      }
      
      // Verify the client owns this booking
      if (workout.client.toString() !== clientId) {
        throw {
          message: "You don't have permission to cancel this booking.",
          type: "RESPONSE",
          statusCode: 403
        };
      }
      
      // Check if already cancelled
      if (workout.state === "CANCELLED") {
        throw {
          message: "This workout is already cancelled.",
          type: "RESPONSE",
          statusCode: 400
        };
      }
      
      // Update booking status
      workout.state = "CANCELLED";
      workout.updatedAt = new Date();
      
      await workout.save();
      console.info("Workout cancelled:", workout);
      
      return workout;
    } catch (error) {
      console.error("Error cancelling workout:", error);
      if (error.type === "RESPONSE") {
        throw error;
      }
      throw {
        message: "Failed to cancel workout. Please try again.",
        type: "RESPONSE",
        statusCode: 400
      }
    }
  }
}
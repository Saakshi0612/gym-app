import { WorkoutModel } from "../models/workoutModel";
import { DatabaseService } from "./database.service";
import { WorkoutBookingRequest } from "../controllers/workout.controller";
import { IWorkout } from "../types/db.types";

export class WorkoutService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }
  
  async MyBookedWorkouts({
    id, 
    states = ['SCHEDULED', 'FINISHED', 'WAITING_FOR_FEEDBACK', 'CANCELLED'],
    startDate,
    endDate
  }: {
    id: string, 
    states?: string[],
    startDate?: Date,
    endDate?: Date
  }): Promise<IWorkout[]> {
    try {
      await this.dbService.connect();
      
      // Build the query
      let query: any = { $or: [{client: id}, {coach: id}] };
      
      // Add state filter
      if (states && states.length > 0) {
        query.state = { $in: states };
      }
      
      // Add date range filter if provided
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
      }
 
      // Execute the query with population and sorting
      const workouts = await WorkoutModel.find(query)
        .populate("slot")
        .populate("coach", "name profilePicture")
        .populate("client", "name profilePicture")
        .sort({ date: 1 });
        
      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      if (error.type === "RESPONSE") {
        throw error;
      }
      throw {
        message: "Failed to fetch workouts. Please try again.",
        type: "RESPONSE",
        statusCode: 400
      }
    }
  }
  
  //for deleting the workouts
  async deleteWorkout(workoutId: string): Promise<{ success: boolean, message: string }> {
    try {
      await this.dbService.connect();
   
      // Find and delete the workout by ID
      const deletedWorkout = await WorkoutModel.findByIdAndDelete(workoutId);
      
      // Check if workout was found and deleted
      if (!deletedWorkout) {
        throw {
          message: "Workout not found or already deleted.",
          type: "RESPONSE",
          statusCode: 404
        };
      }
      
      return {
        success: true,
        message: "Workout successfully deleted."
      };
    } catch (error) {
      console.error("Error deleting workout:", error);
      if (error.type === "RESPONSE") {
        throw error;
      }
      throw {
        message: "Failed to delete workout. Please try again.",
        type: "RESPONSE",
        statusCode: 400
      };
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
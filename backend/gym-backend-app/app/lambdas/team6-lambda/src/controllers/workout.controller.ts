import { WorkoutService } from "../services/workout.service";
import {z, ZodError} from "zod";
  
const WorkoutBookingSchema = z.object({
  activity: z.string().min(2, "Activity type is required"),
  coach: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid coach ID format"),
  client: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid client ID format"),
  date: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format"
    })
    .transform(val => new Date(val)),
  slot: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid slot ID format"),
});

const WorkoutIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid workout ID format"),
});

const CancelWorkoutSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid workout ID format"),
  clientId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid client ID format"),
});

const GetWorkoutsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
  states: z.array(z.string()).optional(),
  startDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid start date format"
    })
    .transform(val => new Date(val))
    .optional(),
  endDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid end date format"
    })
    .transform(val => new Date(val))
    .optional(),
});
  
// Type inference from the schema
export type WorkoutBookingRequest = z.infer<typeof WorkoutBookingSchema>;

export class WorkoutController{
  async bookWorkout(body: unknown) {
    try {
      // Use zod to validate the data
      const validatedData = WorkoutBookingSchema.parse(body);
      const workoutService = new WorkoutService();
      return await workoutService.bookWorkout(validatedData);
    } catch (error) {
      // Error handling for zod
      if(error instanceof ZodError) {
        throw {
          message: "Validation failed: " + error.errors.map(e => e.message).join(", "),
          type: "RESPONSE",
          statusCode: 400
        };
      }
      console.error(error);
      throw error;
    }
  }

  async getWorkout(body: unknown) {
    try {
      // Use zod to validate the data
      const validatedData = GetWorkoutsSchema.parse(body);
      const workoutService = new WorkoutService();
      return await workoutService.MyBookedWorkouts(validatedData);
    } catch (error) {
      // Error handling for zod
      if(error instanceof ZodError) {
        throw {
          message: "Validation failed: " + error.errors.map(e => e.message).join(", "),
          type: "RESPONSE",
          statusCode: 400
        };
      }
      console.error(error);
      throw error;
    }
  }

  async deleteWorkout(body: unknown) {
    try {
      // Use zod to validate the data
      const validatedData = WorkoutIdSchema.parse(body);
      const workoutService = new WorkoutService();
      return await workoutService.deleteWorkout(validatedData.id);
    } catch (error) {
      // Error handling for zod
      if(error instanceof ZodError) {
        throw {
          message: "Validation failed: " + error.errors.map(e => e.message).join(", "),
          type: "RESPONSE",
          statusCode: 400
        };
      }
      console.error(error);
      throw error;
    }
  }

  async cancelWorkout(body: unknown) {
    try {
      // Use zod to validate the data
      const validatedData = CancelWorkoutSchema.parse(body);
      const workoutService = new WorkoutService();
      return await workoutService.cancelWorkout(
        validatedData.id,
        validatedData.clientId
      );
    } catch (error) {
      // Error handling for zod
      if(error instanceof ZodError) {
        throw {
          message: "Validation failed: " + error.errors.map(e => e.message).join(", "),
          type: "RESPONSE",
          statusCode: 400
        };
      }
      console.error(error);
      throw error;
    }
  }
}
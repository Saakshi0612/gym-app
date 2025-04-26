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
  
  // Type inference from the schema
  export type WorkoutBookingRequest = z.infer<typeof WorkoutBookingSchema>;
export class WorkoutController{
    async bookWorkout(body:unknown){
        try {
            //we will use zod to validate the data
            const validatedData = WorkoutBookingSchema.parse(body);
            const workoutService = new WorkoutService();
            return await workoutService.bookWorkout(validatedData)
        } catch (error) {
            // error handling for zod
            if(error instanceof ZodError){
                throw {
                  message: "Validation failed!! Please check your fields",
                  type: "RESPONSE",
                  statusCode:400
                };
            }
            console.error(error);

            throw error;
        }
    }

    async getWorkout(body:{id:String}){
      try {
          //we will use zod to validate the data

          const workoutService = new WorkoutService();
          return await workoutService.MyBookedWorkouts(body)
      } catch (error) {
          // error handling for zod
         
          console.error(error);

          throw error;
      }
  }
}


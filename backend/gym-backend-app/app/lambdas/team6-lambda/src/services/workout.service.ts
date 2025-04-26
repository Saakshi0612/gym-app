import { WorkoutModel } from "../models/workoutModel";
import { DatabaseService } from "./database.service";
import { WorkoutBookingRequest } from "../controllers/workout.controller";
import { IWorkout } from "../types/db.types";

export class WorkoutService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }


  async bookWorkout({activity,coach,client,date,slot}:WorkoutBookingRequest): Promise<IWorkout> {
    try {
      await this.dbService.connect();
 
      const existingWorkout = await WorkoutModel.findOne({
        activity,
        coach,
        client,
        date,
        slot,
      });
      console.info(existingWorkout);

      if (existingWorkout) {
        throw {
          message: "This workout session is already booked by you.",
          type: "RESPONSE",
          statusCode:400
        };
      }

      //for not over booking

      const checkOverBooking = await WorkoutModel.find({
        coach,
        date,
        slot,

      });
      console.info(checkOverBooking);
      if(checkOverBooking.length!==0){
        throw {
          message:"This time slot is full!",
          type:"RESPONSE",
          statusCode:400
        }
      }
     
      const newWorkout = new WorkoutModel({
        activity,
        coach,
        client,
        date,
        slot,
        state:"SCHEDULED"
      });


      await newWorkout.save();

      return newWorkout;
    } catch (error) {
      console.error("Error booking workout:", error);
      throw {
        message:"Failed to book workout. Please try again.",
        type:"RESPONSE",
        statusCode:400
      }
    }
  }
}

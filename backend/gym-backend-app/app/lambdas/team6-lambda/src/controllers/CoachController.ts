import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachModel } from "../models/userModel";
import { WorkoutModel } from "../models/workoutModel";
import mongoose from "mongoose";
import { AvailableSlotModel } from "../models/availableSlotModel";

export const getAllCoaches = async (
    event: APIGatewayProxyEvent,
    headers: Record<string, string>
  ): Promise<APIGatewayProxyResult> => {
    try {
      const coaches = await CoachModel.find({}).lean(); // Fetch all coaches
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(coaches),
      };
    } catch (err) {
      console.error('Error fetching coaches:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  };


  export const getCoachById = async (
    event: APIGatewayProxyEvent,
    headers: Record<string, string>
  ): Promise<APIGatewayProxyResult> => {
    try {
      const coachId = event.pathParameters?.coachId;
  
      if (!coachId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Coach ID is required" }),
        };
      }
  
      const coach = await CoachModel.findById(coachId);
  
      if (!coach) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Coach not found" }),
        };
      }
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(coach),
      };
    } catch (error) {
      console.error("Error fetching coach by ID:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  };


  // export const getBookedWorkouts = async (
  //   event: APIGatewayProxyEvent,
  //   headers: Record<string, string>
  // ): Promise<APIGatewayProxyResult> => {
  //   try {
  //     // Extract parameters
  //     const coachId = event.pathParameters?.coachId;
  //     const dateParam = event.pathParameters?.date;
      
  //     // Validate required parameters
  //     if (!coachId || !dateParam) {
  //       return {
  //         statusCode: 400,
  //         headers,
  //         body: JSON.stringify({ 
  //           success: false,
  //           message: "Missing required parameters: coachId and date are required" 
  //         })
  //       };
  //     }
      
  //     // Validate coachId format
  //     if (!mongoose.Types.ObjectId.isValid(coachId)) {
  //       return {
  //         statusCode: 400,
  //         headers,
  //         body: JSON.stringify({ 
  //           success: false,
  //           message: "Invalid coachId format" 
  //         })
  //       };
  //     }
      
  //     // Validate date format
  //     const selectedDate = new Date(dateParam);
  //     if (isNaN(selectedDate.getTime())) {
  //       return {
  //         statusCode: 400,
  //         headers,
  //         body: JSON.stringify({ 
  //           success: false,
  //           message: "Invalid date format" 
  //         })
  //       };
  //     }
      
  //     // Set time range for the selected date
  //     const startOfDay = new Date(selectedDate);
  //     startOfDay.setUTCHours(0, 0, 0, 0);
      
  //     const endOfDay = new Date(selectedDate);
  //     endOfDay.setUTCHours(23, 59, 59, 999);
      
  //     // Query database for bookings
  //     const bookings = await WorkoutModel.find({
  //       coach: new mongoose.Types.ObjectId(coachId),
  //       date: { $gte: startOfDay, $lte: endOfDay },
  //       state: "SCHEDULED",
  //     }).lean(); // Using lean() for better performance with read-only data
      
  //     // Return successful response
  //     return {
  //       statusCode: 200,
  //       headers,
  //       body: JSON.stringify({
  //         success: true,
  //         count: bookings.length,
  //         bookings
  //       })
  //     };
  //   } catch (error) {
  //     // Log the full error for debugging
  //     console.error("Error fetching bookings:", error);
      
  //     // Determine if it's a MongoDB error or something else
  //     const errorMessage = error instanceof Error 
  //       ? error.message 
  //       : "Unknown error occurred";
      
  //     // Return appropriate error response
  //     return {
  //       statusCode: 500,
  //       headers,
  //       body: JSON.stringify({ 
  //         success: false,
  //         message: "Failed to fetch bookings",
  //         error: errorMessage
  //       })
  //     };
  //   }
  // };
  
  
  export const getBookedWorkouts = async (
    event: APIGatewayProxyEvent,
    headers: Record<string, string>
  ): Promise<APIGatewayProxyResult> => {
    try {
      // Extract parameters
      const coachId = event.pathParameters?.coachId;
      const dateParam = event.pathParameters?.date;
      
      // Validate required parameters
      if (!coachId || !dateParam) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false,
            message: "Missing required parameters: coachId and date are required" 
          })
        };
      }
      
      // Validate coachId format
      if (!mongoose.Types.ObjectId.isValid(coachId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false,
            message: "Invalid coachId format" 
          })
        };
      }
      
      // Validate date format
      const selectedDate = new Date(dateParam);
      if (isNaN(selectedDate.getTime())) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false,
            message: "Invalid date format" 
          })
        };
      }
      
      // Set time range for the selected date
      const startOfDay = new Date(selectedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      // Query database for bookings
      const bookings = await WorkoutModel.find({
        coach: new mongoose.Types.ObjectId(coachId),
        date: { $gte: startOfDay, $lte: endOfDay },
        state: "SCHEDULED",
      }).lean();
      
      // Get all slot IDs from the bookings
      const slotIds = bookings.map(booking => booking.slot);
      
      // Fetch all slots in a single query
      const slots = await AvailableSlotModel.find({
        _id: { $in: slotIds }
      }).lean();
      
      // Create a map of slot IDs to slot objects for easy lookup
      const slotMap = slots.reduce((map, slot) => {
        map[slot._id.toString()] = {
          startTime: slot.startTime,
          endTime: slot.endTime
        };
        return map;
      }, {});
      
      // Enhance bookings with slot information
      const enhancedBookings = bookings.map(booking => {
        const slotId = booking.slot.toString();
        return {
          ...booking,
          slotDetails: slotMap[slotId] || null
        };
      });
      
      // Return successful response
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          count: enhancedBookings.length,
          bookings: enhancedBookings
        })
      };
    } catch (error) {
      // Log the full error for debugging
      console.error("Error fetching bookings:", error);
      
      // Determine if it's a MongoDB error or something else
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
      
      // Return appropriate error response
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          message: "Failed to fetch bookings",
          error: errorMessage
        })
      };
    }
  };


  export const getCoachWorkouts = async (
    event: APIGatewayProxyEvent,
    headers: Record<string, string>
  ): Promise<APIGatewayProxyResult> => {
    try {
      // Extract coach ID from path parameters
      const coachId = event.pathParameters?.coachId;
  
      // Validate coachId
      if (!coachId || !mongoose.Types.ObjectId.isValid(coachId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: "Valid coach ID is required"
          })
        };
      }
  
      // Get current date (start of today)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
  
      // Query for workouts with date >= today and matching coach ID
      const workouts = await WorkoutModel.find({
        coach: new mongoose.Types.ObjectId(coachId),
        date: { $gte: today },
        state: "SCHEDULED"
      }).lean();
  
      // Get all slot IDs from the workouts
      const slotIds = workouts.map(workout => workout.slot);
  
      // Fetch all slots in a single query
      const slots = await AvailableSlotModel.find({
        _id: { $in: slotIds }
      }).lean();
  
      // Create a map of slot IDs to slot objects for easy lookup
      const slotMap = slots.reduce((map, slot) => {
        map[slot._id.toString()] = {
          startTime: slot.startTime,
          endTime: slot.endTime
        };
        return map;
      }, {});
  
      // Enhance workouts with slot information
      const enhancedWorkouts = workouts.map(workout => {
        const slotId = workout.slot.toString();
        return {
          ...workout,
          slotDetails: slotMap[slotId] || null
        };
      });
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          count: enhancedWorkouts.length,
          workouts: enhancedWorkouts
        })
      };
    } catch (error) {
      console.error("Error fetching coach workouts:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unknown error occurred";
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Failed to fetch workouts",
          error: errorMessage
        })
      };
    }
  };
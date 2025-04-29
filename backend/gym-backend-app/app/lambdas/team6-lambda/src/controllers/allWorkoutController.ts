import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachModel } from "../models/userModel";
import { WorkoutModel } from "../models/workoutModel";
import { AvailableSlotModel } from "../models/availableSlotModel";
import { formatInTimeZone } from "date-fns-tz"; // Import formatInTimeZone for time zone formatting

export const getAllWorkout = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const coaches = await CoachModel.find();
    const bookedWorkouts = await WorkoutModel.find();
    const availableTimeSlots = await AvailableSlotModel.find();

    if (!coaches || coaches.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "No coaches found" }),
      };
    }

    // 1. Create a map: coachId -> booked slotIds
    const coachBookedSlotsMap = new Map<string, Set<string>>();

    bookedWorkouts.forEach((workout) => {
      if (workout.state === "SCHEDULED" && workout.coach && workout.slot) {
        const coachId = workout.coach.toString();
        const slotId = workout.slot.toString();
        if (!coachBookedSlotsMap.has(coachId)) {
          coachBookedSlotsMap.set(coachId, new Set());
        }
        coachBookedSlotsMap.get(coachId)!.add(slotId);
      }
    });

    // 2. Create available coach list with available slots
    const availableCoachList = coaches
      .map((coach) => {
        const coachId = coach._id.toString();
        const bookedSlots = coachBookedSlotsMap.get(coachId) || new Set();

        // Find slots that are NOT booked
        const freeSlots = availableTimeSlots
          .filter((slot) => !bookedSlots.has(slot._id.toString()))
          .map((slot) => {
            // Format the times to IST (Asia/Kolkata)
            const startTimeFormatted = formatInTimeZone(
              new Date(slot.startTime),
              "Asia/Kolkata",
              "hh:mm a"
            );
            const endTimeFormatted = formatInTimeZone(
              new Date(slot.endTime),
              "Asia/Kolkata",
              "hh:mm a"
            );

            return {
              _id: slot._id,
              time: `${startTimeFormatted} - ${endTimeFormatted}`,
            };
          });

        if (freeSlots.length === 0) {
          // Coach has no free slots
          return null;
        }

        return {
          _id: coach._id,
          firstName: coach.firstName,
          lastName: coach.lastName,
          profileImageUrl: coach.profileImageUrl,
          specializations: coach.specializations,
          rating: coach.rating,
          title: coach.title,
          about: coach.about,
          availableSlots: freeSlots,
        };
      })
      .filter((coach) => coach !== null); // Remove fully booked coaches

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ coaches: availableCoachList }),
    };
  } catch (error) {
    console.error("Error fetching all Workouts: ", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

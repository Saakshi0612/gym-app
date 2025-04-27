import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachModel } from "../models/userModel";
import { WorkoutModel } from "../models/workoutModel";
import { AvailableSlotModel } from "../models/availableSlotModel";
import { formatInTimeZone } from "date-fns-tz";
import mongoose from "mongoose";

export const searchWorkout = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { coach_id, sport_name, date, time_slot } = JSON.parse(
      event.body || "{}"
    );
    console.log("Request Body: ", { coach_id, sport_name, date, time_slot });

    const query: Record<string, any> = {};

    if (coach_id && coach_id !== "All") {
      query._id = new mongoose.Types.ObjectId(coach_id);
    }
    if (sport_name && sport_name !== "All") {
      query.specializations = sport_name;
    }

    const coaches = await CoachModel.find(query)
      .select(
        "firstName lastName title rating specializations about profileImageUrl"
      )
      .exec();

    if (!coaches || coaches.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: "No coaches found matching the filters",
        }),
      };
    }

    const availableTimeSlots = await AvailableSlotModel.find().exec();
    console.log("Available Slots Initially: ", availableTimeSlots);

    let existingWorkouts: any[] = [];
    const coachTakenSlotsMap = new Map<string, string[]>();

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const workoutQuery: Record<string, any> = {
        date: { $gte: startOfDay, $lte: endOfDay },
        state: "SCHEDULED",
      };

      if (coach_id && coach_id !== "All") {
        workoutQuery.coach = new mongoose.Types.ObjectId(coach_id);
      }

      existingWorkouts = await WorkoutModel.find(workoutQuery).exec();
      console.log("Existing Workouts: ", existingWorkouts);

      existingWorkouts.forEach((w) => {
        const coachId = w.coach.toString();
        if (!coachTakenSlotsMap.has(coachId)) {
          coachTakenSlotsMap.set(coachId, []);
        }
        coachTakenSlotsMap.get(coachId)!.push(w.slot.toString());
      });
    }

    const result = coaches
      .map((coach: any) => {
        const coachId = coach._id.toString();
        const takenSlots = coachTakenSlotsMap.get(coachId) || [];

        // Available slots for this coach after removing booked slots
        const coachAvailableSlots = availableTimeSlots.filter(
          (slot) => !takenSlots.includes(slot._id.toString())
        );

        // Check if selected time_slot is in available slots
        const hasSelectedTimeSlot =
          !time_slot || time_slot === "All"
            ? true
            : coachAvailableSlots.some(
                (slot) => slot._id.toString() === time_slot
              );

        if (!hasSelectedTimeSlot) {
          return null;
        }

        const formattedAvailableSlots = coachAvailableSlots.map((slot) => ({
          _id: slot._id.toString(),
          time: `${formatInTimeZone(
            new Date(slot.startTime),
            "Asia/Kolkata",
            "hh:mm a"
          )} - ${formatInTimeZone(
            new Date(slot.endTime),
            "Asia/Kolkata",
            "hh:mm a"
          )}`,
        }));

        const filteredSpecializations =
          sport_name && sport_name !== "All"
            ? coach.specializations.filter(
                (spec: string) => spec === sport_name
              )
            : coach.specializations;

        return {
          id: coach._id.toString(),
          profileImageUrl: coach.profileImageUrl,
          firstName: coach.firstName,
          lastName: coach.lastName,
          title: coach.title,
          about: coach.about,
          rating: coach.rating,
          specializations: filteredSpecializations,
          availableSlots: formattedAvailableSlots,
        };
      })
      .filter((coach) => coach !== null);

    if (result.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message:
            "No workout found. The selected time slot is already booked.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ coaches: result }),
    };
  } catch (error) {
    console.error("Error in searchWorkout: ", JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

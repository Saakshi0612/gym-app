// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
// import { CoachModel } from "../models/userModel";
// import { WorkoutModel } from "../models/workoutModel";
// import { AvailableSlotModel } from "../models/availableSlotModel";

// export const getWorkout = async (
//   event: APIGatewayProxyEvent,
//   headers: Record<string, string>
// ): Promise<APIGatewayProxyResult> => {
//   try {
//     const filters = JSON.parse(event.body || "{}");
//     const { coach_id, sport_name, date, time_slot } = filters;

//     const query: Record<string, any> = {};

//     if (coach_id && coach_id !== "All") query._id = coach_id;
//     if (sport_name && sport_name !== "All") query.specializations = sport_name;

//     const coaches = await CoachModel.find(query)
//       .select("firstName lastName title rating specializations about")
//       .exec();

//     if (!coaches || coaches.length === 0) {
//       return {
//         statusCode: 404,
//         headers,
//         body: JSON.stringify({
//           message: "No coaches found matching the filters",
//         }),
//       };
//     }

//     let availableTimeSlots = await AvailableSlotModel.find().exec();
//     console.log("Available Slots Initially: ", availableTimeSlots);

//     if (date) {
//       const workoutQuery: Record<string, any> = {
//         date: new Date(date),
//         state: "SCHEDULED",
//       };

//       if (coach_id && coach_id !== "All") {
//         workoutQuery.coach = coach_id;
//       }

//       const existingWorkouts = await WorkoutModel.find(workoutQuery).exec();
//       console.log("Existing Workouts: ", existingWorkouts);

//       const takenSlotIds = existingWorkouts.map((w: any) => w.slot.toString());
//       console.log("Taken Slots: ", takenSlotIds);

//       if (time_slot && time_slot !== "All") {
//         if (takenSlotIds.includes(time_slot)) {
//           return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify({
//               message:
//                 "No workout found. The selected time slot is already booked.",
//             }),
//           };
//         }
//       }

//       // Filter out already booked slots
//       availableTimeSlots = availableTimeSlots.filter(
//         (slot: any) => !takenSlotIds.includes(slot._id.toString())
//       );
//       console.log("Available Slots After Filtering: ", availableTimeSlots);
//     }

//     const result = coaches.map((coach: any) => {
//       const filteredSpecializations =
//         sport_name && sport_name !== "All"
//           ? coach.specializations.filter((spec: string) => spec === sport_name)
//           : coach.specializations;

//       return {
//         id: coach._id,
//         firstName: coach.firstName,
//         lastName: coach.lastName,
//         title: coach.title,
//         about: coach.about,
//         rating: coach.rating,
//         specializations: filteredSpecializations,
//         availableSlots: availableTimeSlots,
//       };
//     });

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ coaches: result }),
//     };
//   } catch (error) {
//     console.error("Error to get coaches:", JSON.stringify(error, null, 2));
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({
//         message: "Server error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }),
//     };
//   }
// };

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachModel } from "../models/userModel";
import { WorkoutModel } from "../models/workoutModel";
import { AvailableSlotModel } from "../models/availableSlotModel";

export const getWorkout = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const filters = JSON.parse(event.body || "{}");
    const { coach_id, sport_name, date, time_slot } = filters;

    const query: Record<string, any> = {};

    if (coach_id && coach_id !== "All") query._id = coach_id;
    if (sport_name && sport_name !== "All") query.specializations = sport_name;

    const coaches = await CoachModel.find(query)
      .select(
        "firstName lastName  profileImageUrl title rating specializations about"
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

    let availableTimeSlots = await AvailableSlotModel.find().exec();
    console.log("Available Slots Initially: ", availableTimeSlots);

    if (date) {
      const workoutQuery: Record<string, any> = {
        date: new Date(date),
        state: "SCHEDULED",
      };

      if (coach_id && coach_id !== "All") {
        workoutQuery.coach = coach_id;
      }

      const existingWorkouts = await WorkoutModel.find(workoutQuery).exec();
      console.log("Existing Workouts: ", existingWorkouts);

      const takenSlotIds = existingWorkouts.map((w: any) => w.slot.toString());
      console.log("Taken Slots: ", takenSlotIds);

      if (time_slot && time_slot !== "All") {
        if (takenSlotIds.includes(time_slot)) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              message:
                "No workout found. The selected time slot is already booked.",
            }),
          };
        }
      }

      // Filter out already booked slots
      availableTimeSlots = availableTimeSlots.filter(
        (slot: any) => !takenSlotIds.includes(slot._id.toString())
      );
      console.log("Available Slots After Filtering: ", availableTimeSlots);
    }

    // 🛠️ Format available slots properly
    const formattedAvailableSlots = availableTimeSlots.map((slot: any) => {
      const start = new Date(slot.startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const end = new Date(slot.endTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        _id: slot._id.toString(),
        time: `${start} - ${end}`,
      };
    });

    const result = coaches.map((coach: any) => {
      const filteredSpecializations =
        sport_name && sport_name !== "All"
          ? coach.specializations.filter((spec: string) => spec === sport_name)
          : coach.specializations;

      return {
        id: coach._id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        profileImageUrl: coach.profileImageUrl,
        title: coach.title,
        about: coach.about,
        rating: coach.rating,
        specializations: filteredSpecializations,
        availableSlots: formattedAvailableSlots, // ⬅️ Using formatted one
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ coaches: result }),
    };
  } catch (error) {
    console.error("Error to get coaches:", JSON.stringify(error, null, 2));
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

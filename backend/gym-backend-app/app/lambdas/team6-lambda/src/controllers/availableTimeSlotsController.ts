import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AvailableSlotModel } from "../models/availableSlotModel";
import { formatInTimeZone } from "date-fns-tz"; // Import the date-fns-tz package

export const getAvailableTimeSlots = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const slots = await AvailableSlotModel.find();

    const Available_Time_Slots = slots.map((slot: any) => {
      // Format the start and end time to IST (Asia/Kolkata)
      const start = formatInTimeZone(
        new Date(slot.startTime),
        "Asia/Kolkata",
        "hh:mm a"
      );
      const end = formatInTimeZone(
        new Date(slot.endTime),
        "Asia/Kolkata",
        "hh:mm a"
      );

      return {
        id: slot._id.toString(), // Add the _id as id in the response
        slot: `${start} - ${end}`, // The formatted time range in IST
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ Available_Time_Slots }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Server error", error }),
    };
  }
};

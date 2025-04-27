import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AvailableSlotModel } from "../models/availableSlotModel";

export const getAvailableTimeSlots = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const slots = await AvailableSlotModel.find();

    const Available_Time_Slots = slots.map((slot: any) => {
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
        id: slot._id.toString(), // Add the _id as id in the response
        slot: `${start} - ${end}`, // The formatted time range
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

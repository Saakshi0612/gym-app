import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachModel } from "../models/userModel"; // Assuming userModel.ts contains the CoachModel

// Get all coach names
export const getCoachName = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    // Find all users with the 'COACH' role
    const coaches = await CoachModel.find({}, "_id firstName lastName"); // Select only necessary fields

    if (!coaches || coaches.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "No coaches found" }),
      };
    }

    // Map over the coaches to return their full names and titles
    const coachNames = coaches.map((coach: any) => ({
      id: coach._id.toString(),
      name: `${coach.firstName} ${coach.lastName}`,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ coaches: coachNames }),
    };
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Server error", error }),
    };
  }
};

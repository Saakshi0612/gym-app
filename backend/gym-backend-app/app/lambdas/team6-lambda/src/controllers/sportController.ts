import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachModel } from "../models/userModel"; // Adjust path if needed

// Get all coach specializations along with their IDs
export const getCoachSpecializations = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const coaches = await CoachModel.find({}, "_id specializations ").exec(); // Select specializations and _id

    if (!coaches || coaches.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "No coaches found" }),
      };
    }

    // Collect all specializations into a flat array, include coach ID as well
    const allSpecializations = coaches
      .flatMap((coach) =>
        (coach.specializations || []).map((specialization: string) => ({
          specialization,
          coachId: coach._id.toString(), // Add coach ID alongside specialization
        }))
      )
      .filter(
        (spec, index, self) =>
          spec.specialization && self.indexOf(spec) === index
      ); // remove duplicates

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ specializations: allSpecializations }),
    };
  } catch (error) {
    console.error("Error fetching coach specializations:", error);
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

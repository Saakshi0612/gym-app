import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserById, updateUserById } from "../controllers/userController";

export const getUserProfileHandler = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    return await getUserById(event, headers);
  } catch (error) {
    console.error("Error in getUserProfileHandler:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error retrieving user profile",
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};

export const updateUserProfileHandler = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    return await updateUserById(event, headers);
  } catch (error) {
    console.error("Error in updateUserProfileHandler:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error updating user profile",
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
}; 
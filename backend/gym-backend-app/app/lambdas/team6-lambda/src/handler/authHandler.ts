// src/handlers/authHandlers.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as authController from "../controllers/authController";

// Register user handler
export const registerHandler = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, firstName, lastName, password, confirmPassword, target, activity } =
      authController.parseBody(event.body);

    const result = await authController.register(
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      target,
      activity
    );

    return {
      statusCode: result.statusCode,
      headers,
      body: JSON.stringify({
        message: result.message,
        user: result.success ? result.user : undefined,
      }),
    };
  } catch (error) {
    console.error("Error in registerHandler:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error registering user",
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};

// Login user handler
export const loginHandler = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = authController.parseBody(event.body);

    const result = await authController.login(email, password);

    return {
      statusCode: result.statusCode,
      headers,
      body: JSON.stringify({
        message: result.message,
        user: result.success ? result.user : undefined,
      }),
    };
  } catch (error) {
    console.error("Error in loginHandler:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error logging in",
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};
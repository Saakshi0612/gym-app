// src/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { registerUser, loginUser } from "./controllers/authController";
import { DatabaseService } from "./services/database.service";
import { workoutBookingHandler } from "./handler/workout-booking.handler";
import { getBookingHandler } from "./handler/getWorkout.handler";

// Connect to MongoDB when the Lambda container initializes
const dbService = DatabaseService.getInstance();
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  await dbService.connect();
  console.info("db connected successfully");
  isConnected = true;
};

const routes: Record<
  string,
(
    event: APIGatewayProxyEvent,
    headers: Record<string, string>
  ) => Promise<APIGatewayProxyResult>
> = {
  "/auth/register": registerUser,
  "/auth/login": loginUser,
  "/workout":(event: APIGatewayProxyEvent,
    headers: Record<string, string>)=>{
      if(event.httpMethod==="POST"){
        return workoutBookingHandler(event,headers);
      }

      if(event.httpMethod==="GET"){
        return getBookingHandler(event, headers)
      }

      if(event.httpMethod==="DELETE"){
        //cancel the workout handler
      }

      throw Error("Invalid Method");
  }
  
};

// Main handler function
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log(event)
    // Connect to the database
    await connectToDatabase();

    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    };

    // Handle OPTIONS requests (for CORS)
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "CORS enabled" }),
      };
    }

    // Route the request based on the path and method
    const path = event.path;
    const method = event.httpMethod;
    console.log(path);
    console.log(method);

    // "POST /auth/register":registerUser

    const routeHandler = routes[event.path];

    if (routeHandler) {
      return await routeHandler(event, headers);
    }

    // If no route matches
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Route not found" }),
    };
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

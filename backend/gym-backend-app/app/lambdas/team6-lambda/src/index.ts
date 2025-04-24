// src/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { connectDB } from "./config/db";
import { registerUser, loginUser } from "./controllers/authController";
import { addCoachEmail, addAdminEmail } from "./controllers/adminController";
import { CoachEmailModel } from "./models/coachEmailModel";
import { AdminEmailModel } from "./models/adminEmailModel";

// Connect to MongoDB when the Lambda container initializes
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }
  await connectDB();
  isConnected = true;
};

// Initialize database with default admin and coach emails if empty
const initializeDatabase = async () => {
  try {
    // Check if initialization has been done
    const adminCount = await AdminEmailModel.countDocuments();
    const coachCount = await CoachEmailModel.countDocuments();
    
    if (adminCount === 0) {
      // Add default admin emails
      await AdminEmailModel.create({ email: 'admin@example.com' });
      console.log('Added default admin email');
    }
    
    if (coachCount === 0) {
      // Add default coach emails
      await CoachEmailModel.create({ email: 'coach1@example.com' });
      await CoachEmailModel.create({ email: 'coach2@example.com' });
      console.log('Added default coach emails');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Define route handlers based on HTTP method and path
const routeHandlers: Record<
  string,
  Record<
    string,
    (
      event: APIGatewayProxyEvent,
      headers: Record<string, string>
    ) => Promise<APIGatewayProxyResult>
  >
> = {
  "/auth/register": {
    POST: registerUser
  },
  "/auth/login": {
    POST: loginUser
  },
  "/admin/add-coach-email": {
    POST: addCoachEmail
  },
  "/admin/add-admin-email": {
    POST: addAdminEmail
  }
};

// Main handler function
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Event received:", JSON.stringify(event, null, 2));
    
    // Connect to the database
    await connectToDatabase();
    console.log("Database connected successfully");

    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
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
    console.log(`Processing ${method} request to ${path}`);

    // Check if the path exists in our route handlers
    if (routeHandlers[path] && routeHandlers[path][method]) {
      console.log(`Handler found for ${method} ${path}`);
      return await routeHandlers[path][method](event, headers);
    }

    // If no route matches
    console.log(`No handler found for ${method} ${path}`);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        message: "Route not found", 
        path: path, 
        method: method 
      }),
    };
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};
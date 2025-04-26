// src/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AdminEmailModel } from "./models/adminEmailModel";
import { CoachEmailModel } from "./models/coachemailModel";
import { loginHandler, registerHandler } from "./handler/authHandler";
import { addAdminEmail, addCoachEmail } from "./controllers/adminController";
import { requireAdmin } from "./middleware/authMiddleware";
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

// Define route handlers with middleware
const routes = [
  {
    path: "/auth/register",
    method: "POST",
    handler: registerHandler,
    middleware: [] // No middleware for registration
  },
  {
    path: "/auth/login",
    method: "POST",
    handler: loginHandler,
    middleware: [] // No middleware for login
  },
  {
    path: "/workout",
    method: "POST",
    handler: workoutBookingHandler,
    middleware: [] // No middleware for registration
  },
  {
    path: "/workout",
    method: "GET",
    handler: getBookingHandler,
    middleware: [] // No middleware for registration
  },
  {
    path: "/admin/add-coach-email",
    method: "POST",
    handler: async (event: APIGatewayProxyEvent, headers: Record<string, string>) => 
      await addCoachEmail(event, headers),
    middleware: [requireAdmin] // Require admin role
  },
  {
    path: "/admin/add-admin-email",
    method: "POST",
    handler: async (event: APIGatewayProxyEvent, headers: Record<string, string>) => 
      await addAdminEmail(event, headers),
    middleware: [requireAdmin] // Require admin role
  }
];

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

    // Find the matching route
    const route = routes.find(r => r.path === path && r.method === method);
    
    if (route) {
      console.log(`Handler found for ${method} ${path}`);
      
      // Apply middleware
      for (const middleware of route.middleware) {
        const middlewareResult = await middleware(event, headers);
        if (middlewareResult) {
          // Middleware returned a response, so return it
          return middlewareResult;
        }
      }
      
      // Execute the handler
      return await route.handler(event, headers);
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
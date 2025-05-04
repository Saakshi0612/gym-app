// src/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { connectDB } from "./config/db";
import { getAllCoaches, getCoachById, getBookedWorkouts, getCoachWorkouts } from "./controllers/CoachController"
import { getCoachName } from "./controllers/coachNameController";
import { getCoachSpecializations } from "./controllers/sportController";
import { getAvailableTimeSlots } from "./controllers/availableTimeSlotsController";
import { searchWorkout } from "./controllers/searchWorkoutController";
import { getAllWorkout } from "./controllers/allWorkoutController";
import { loginHandler, registerHandler } from "./handler/authHandler";
import { addAdminEmail, addCoachEmail } from "./controllers/adminController";
import { requireAdmin } from "./middleware/authMiddleware";
import { DatabaseService } from "./services/database.service";
import { workoutBookingHandler } from "./handler/workout-booking.handler";
import { getBookingHandler } from "./handler/getWorkout.handler";
import { deleteWorkoutHandler } from "./handler/deleteWorkout.handler";



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
    path: "/workout",
    method: "DELETE",
    handler: deleteWorkoutHandler,
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
  },
  {
    path: "/workout/getCoachName",
    method: "GET",
    handler: getCoachName,
    middleware: []
  },
  {
    path: "/workout/getSportName",
    method: "GET",
    handler: getCoachSpecializations,
    middleware: []
  },
  {
    path: "/workout/getAvailableTimeSlots",
    method: "GET",
    handler: getAvailableTimeSlots,
    middleware: []
  },
  {
    path: "/workout/getAllWorkout",
    method: "GET",
    handler: getAllWorkout,
    middleware: []
  },
  {
    path: "/workout/searchWorkout",
    method: "POST",
    handler: searchWorkout,
    middleware: []
  },
  {
    path: "/coaches",
    method: "GET",
    handler: getAllCoaches,
    middleware: []
  },
  {
    path: "/coaches/{coachId}",
    method: "GET",
    handler: getCoachById,
    middleware: []
  },
  {
    path: "/coaches/{coachId}/booked-workouts/{date}",
    method: "GET",
    handler: getBookedWorkouts,
    middleware: []
  },
  {
    path: "/coaches/{coachId}/workouts",
    method: "GET",
    handler: getBookedWorkouts,
    middleware: []
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

    const coachIdMatch = path.match(/^\/coaches\/([a-fA-F0-9]{24})$/);

    if (method === "GET" && coachIdMatch) {
      event.pathParameters = { coachId: coachIdMatch[1] };
      return await getCoachById(event, headers);
    }

    const availableSlotsMatch = path.match(/^\/coaches\/([a-fA-F0-9]{24})\/booked-workouts\/([\d-]+)$/);
    if (method === "GET" && availableSlotsMatch) {
      event.pathParameters = {
        coachId: availableSlotsMatch[1],
        date: availableSlotsMatch[2],
      };
      return await getBookedWorkouts(event, headers);
    }

    const coachWorkoutsMatch = path.match(/^\/coaches\/([a-fA-F0-9]{24})\/workouts$/);
    if (method === "GET" && coachWorkoutsMatch) {
      event.pathParameters = {
        coachId: coachWorkoutsMatch[1],
      };
      return await getCoachWorkouts(event, headers);
    }
    console.log(path);
    console.log(method);

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
// src/controllers/authController.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserModel, ClientModel, CoachModel, AdminModel } from "../models/userModel";
import { CoachEmailModel } from "../models/coachEmailModel";
import { AdminEmailModel } from "../models/adminEmailModel";
import { hashPassword, comparePassword } from "../utils/passwordUtils";

// Helper function to parse request body
const parseBody = (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new Error("Missing request body");
  }
  return JSON.parse(event.body);
};

// Register a new user
export const registerUser = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, firstName, lastName, password, target, activity } =
      parseBody(event);

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message:
            "Please provide all required fields: email, firstName, lastName, password",
        }),
      };
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "User with this email already exists",
        }),
      };
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Check if email exists in admin or coach tables to determine role
    const isAdmin = await AdminEmailModel.findOne({ email });
    const isCoach = await CoachEmailModel.findOne({ email });
    
    let newUser;
    let userResponse;
    
    if (isAdmin) {
      console.log(`Creating ADMIN user for email: ${email}`);
      newUser = await AdminModel.create({
        email,
        firstName,
        lastName,
        passwordHash,
        role: "ADMIN"
      });
      
      userResponse = {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      };
    } else if (isCoach) {
      console.log(`Creating COACH user for email: ${email}`);
      newUser = await CoachModel.create({
        email,
        firstName,
        lastName,
        passwordHash,
        role: "COACH",
        title: "",
        about: "",
        summary: "",
        rating: 0,
        specializations: []
      });
      
      userResponse = {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        title: newUser.title,
        about: newUser.about,
        rating: newUser.rating
      };
    } else {
      console.log(`Creating CLIENT user for email: ${email}`);
      newUser = await ClientModel.create({
        email,
        firstName,
        lastName,
        passwordHash,
        role: "CLIENT",
        preferableActivity: activity,
        target
      });
      
      userResponse = {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        preferableActivity: newUser.preferableActivity,
        target: newUser.target
      };
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "User registered successfully",
        user: userResponse,
      }),
    };
  } catch (error) {
    console.error("Error in registerUser:", error);
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

// Login a user
export const loginUser = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = parseBody(event);

    // Validate required fields
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Please provide email and password" }),
      };
    }

    // Find the user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    // Create user response without password
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      // Include role-specific fields based on user type
      ...(user.role === "CLIENT" && {
        preferableActivity: (user as any).preferableActivity,
        target: (user as any).target,
      }),
      ...(user.role === "COACH" && {
        title: (user as any).title,
        about: (user as any).about,
        rating: (user as any).rating,
        specializations: (user as any).specializations,
      }),
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Login successful",
        user: userResponse,
      }),
    };
  } catch (error) {
    console.error("Error in loginUser:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error logging in" }),
    };
  }
};

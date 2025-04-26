// src/controllers/adminController.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CoachEmailModel } from "../models/coachEmailModel";
import { AdminEmailModel } from "../models/adminEmailModel";

// Add coach email
export const addCoachEmail = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { email } = JSON.parse(event.body || '{}');
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Email is required" })
      };
    }
    
    // Check if email already exists
    const existingEmail = await CoachEmailModel.findOne({ email });
    if (existingEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Email already exists in coach list" })
      };
    }
    
    // Add new coach email
    await CoachEmailModel.create({ email });
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: "Coach email added successfully" })
    };
  } catch (error) {
    console.error("Error adding coach email:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error adding coach email" })
    };
  }
};

// Add admin email
export const addAdminEmail = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    const { email } = JSON.parse(event.body || '{}');
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Email is required" })
      };
    }
    
    // Check if email already exists
    const existingEmail = await AdminEmailModel.findOne({ email });
    if (existingEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Email already exists in admin list" })
      };
    }
    
    // Add new admin email
    await AdminEmailModel.create({ email });
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: "Admin email added successfully" })
    };
  } catch (error) {
    console.error("Error adding admin email:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error adding admin email" })
    };
  }
};
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { UserModel, ClientModel, CoachModel } from "../models/userModel";
import mongoose from 'mongoose';
import { 
  uploadToS3, 
  deleteFromS3, 
  validateFile, 
  getFileKeyFromUrl 
} from "../utils/s3Utils";
import { v4 as uuidv4 } from 'uuid';
import { IClient, ICoach } from "../types/db.types";

/**
 * Get user profile by ID
 * Handles GET /users/{userId} requests
 */
export const getUserById = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract the userId from the path parameters
    const userId = event.pathParameters?.userId;
    console.log(`Getting user with ID: ${userId}`);

    // Validate userId
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }

    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid user ID format" }),
      };
    }

    // Find the user by ID
    const user = await UserModel.findById(userId);

    // Check if user exists
    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Prepare the response object based on user role
    let userResponse: any = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      imageUrl: user.profileImageUrl || null,
    };

    // Add role-specific fields
    if (user.role === 'CLIENT') {
      // Get additional client-specific fields
      // Cast the user to IClient to access client-specific fields
      const clientUser = user as unknown as IClient;
      userResponse = {
        ...userResponse,
        preferableActivity: clientUser.preferableActivity || null,
        target: clientUser.target || null,
      };
    } else if (user.role === 'COACH') {
      // Get additional coach-specific fields
      // Cast the user to ICoach to access coach-specific fields
      const coachUser = user as unknown as ICoach;
      userResponse = {
        ...userResponse,
        about: coachUser.about || null,
        title: coachUser.title || null,
        specializations: coachUser.specializations || [],
        fileUrls: coachUser.certificateUrls || [],
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(userResponse),
    };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error retrieving user profile" }),
    };
  }
};

/**
 * Update user profile by ID
 * Handles PUT /users/{userId} requests
 */
export const updateUserById = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract the userId from the path parameters
    const userId = event.pathParameters?.userId;

    // Validate userId
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }

    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid user ID format" }),
      };
    }

    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const updateData = JSON.parse(event.body);

    // Find the user to check if they exist and get their role
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Basic fields that can be updated for any user type
    const basicUpdateFields: any = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
    };

    // Handle profile image update
    if (updateData.base64encodedImage) {
      try {
        // Delete old image if exists
        if (user.profileImageUrl) {
          await deleteFileFromStorage(user.profileImageUrl);
        }
        // Upload new image
        basicUpdateFields.profileImageUrl = await processImageForStorage(updateData.base64encodedImage);
      } catch (error) {
        console.error('Error updating profile image:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: "Error updating profile image" }),
        };
      }
    }

    // Filter out undefined values
    const filteredBasicFields = Object.fromEntries(
      Object.entries(basicUpdateFields).filter(([_, v]) => v !== undefined)
    );

    // Update the base user fields
    if (Object.keys(filteredBasicFields).length > 0) {
      await UserModel.updateOne({ _id: userId }, { $set: filteredBasicFields });
    }

    // Role-specific updates
    if (user.role === 'CLIENT') {
      const clientUpdateFields = {
        preferableActivity: updateData.preferableActivity,
        target: updateData.target,
      };

      // Filter out undefined values
      const filteredClientFields = Object.fromEntries(
        Object.entries(clientUpdateFields).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(filteredClientFields).length > 0) {
        await ClientModel.updateOne({ _id: userId }, { $set: filteredClientFields });
      }
    } else if (user.role === 'COACH') {
      const coachUpdateFields: Record<string, any> = {
        about: updateData.about,
        title: updateData.title,
        summary: updateData.summary,
        specializations: updateData.specializations,
      };

      // Handle certificate uploads
      if (updateData.base64encodedFiles && Array.isArray(updateData.base64encodedFiles)) {
        try {
          const fileUrls = await Promise.all(
            updateData.base64encodedFiles.map(processFileForStorage)
          );
          if (fileUrls.length > 0) {
            coachUpdateFields.certificateUrls = fileUrls;
          }
        } catch (error) {
          console.error('Error updating certificates:', error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Error updating certificates" }),
          };
        }
      }

      // Filter out undefined values
      const filteredCoachFields = Object.fromEntries(
        Object.entries(coachUpdateFields).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(filteredCoachFields).length > 0) {
        await CoachModel.updateOne({ _id: userId }, { $set: filteredCoachFields });
      }
    }

    // Fetch the updated user to return in the response
    const updatedUser = await UserModel.findById(userId);
    
    // Check if updatedUser exists (should always be true at this point, but TypeScript needs the check)
    if (!updatedUser) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: "Error retrieving updated user profile" }),
      };
    }
    
    let userResponse: any = {
      id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      imageUrl: updatedUser.profileImageUrl || null,
    };

    // Add role-specific fields to the response
    if (updatedUser.role === 'CLIENT') {
      // Cast the user to IClient to access client-specific fields
      const clientUser = updatedUser as unknown as IClient;
      userResponse = {
        ...userResponse,
        preferableActivity: clientUser.preferableActivity || null,
        target: clientUser.target || null,
      };
    } else if (updatedUser.role === 'COACH') {
      // Cast the user to ICoach to access coach-specific fields
      const coachUser = updatedUser as unknown as ICoach;
      userResponse = {
        ...userResponse,
        about: coachUser.about || null,
        title: coachUser.title || null,
        specializations: coachUser.specializations || [],
        fileUrls: coachUser.certificateUrls || [],
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(userResponse),
    };
  } catch (error) {
    console.error("Error in updateUserById:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error updating user profile" }),
    };
  }
};

// Helper function to process base64 encoded image
async function processImageForStorage(base64Image: string): Promise<string> {
  try {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
    
    // Validate file
    if (!validateFile(buffer, 'image', 'image/jpeg')) {
      throw new Error('Invalid image file');
    }

    // Generate unique filename
    const key = `img/${uuidv4()}.jpg`;
    
    // Upload to S3
    return await uploadToS3(buffer, key, 'image/jpeg');
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Helper function to process base64 encoded files
async function processFileForStorage(base64File: string): Promise<string> {
  try {
    // Decode base64 to buffer
    const buffer = Buffer.from(base64File.split(',')[1], 'base64');
    
    // Validate file
    if (!validateFile(buffer, 'certificate', 'application/pdf')) {
      throw new Error('Invalid certificate file');
    }

    // Generate unique filename
    const key = `certificates/${uuidv4()}.pdf`;
    
    // Upload to S3
    return await uploadToS3(buffer, key, 'application/pdf');
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
}

// Helper function to delete file from S3
async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  try {
    const key = getFileKeyFromUrl(fileUrl);
    await deleteFromS3(key);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
} 
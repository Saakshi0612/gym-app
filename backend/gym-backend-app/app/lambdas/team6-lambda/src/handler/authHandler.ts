// src/handler/authHandler.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as authController from "../controllers/authController";
import { validateEmail, validateName, validatePassword, validateTarget, validateActivity } from "../utils/validationUtils";




// src/handler/authHandler.ts
// Update the registerHandler function to correctly handle preferableActivity
// src/handler/authHandler.ts
// Update the registerHandler function
export const registerHandler = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const body = authController.parseBody(event.body);
    
    // Extract fields with all possible naming variations
    const { 
      email, 
      firstName, 
      lastName, 
      password, 
      confirmPassword,
      target,
      activity,
      targets,           // From frontend
      preferableActivity // From frontend
    } = body;

    // Use the appropriate field based on what's available
    const targetValue = target || targets || "";
    const activityValue = activity || preferableActivity || "";
    
    console.log("Request body parsed:", {
      email,
      firstName,
      lastName,
      password: "***REDACTED***",
      targetValue,
      activityValue
    });

    // Collect all validation errors
    const validationErrors = [];

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      validationErrors.push(emailValidation.message);
    }

    // Validate first name
    const firstNameValidation = validateName(firstName);
    if (!firstNameValidation.isValid) {
      validationErrors.push(`First name ${firstNameValidation.message}`);
    }

    // Validate last name
    const lastNameValidation = validateName(lastName);
    if (!lastNameValidation.isValid) {
      validationErrors.push(`Last name ${lastNameValidation.message}`);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      validationErrors.push(passwordValidation.message);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match");
    }

    // If target is provided, validate it
    if (targetValue) {
      const targetValidation = validateTarget(targetValue);
      if (!targetValidation.isValid) {
        validationErrors.push(targetValidation.message);
      }
    }

    // If activity is provided, validate it
    if (activityValue) {
      const activityValidation = validateActivity(activityValue);
      if (!activityValidation.isValid) {
        validationErrors.push(activityValidation.message);
      }
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      console.log("Validation errors:", validationErrors);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Validation failed",
          errors: validationErrors
        }),
      };
    }

    // Call the controller function with the correct values
    const result = await authController.register(
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      targetValue,
      activityValue
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
    // Parse request body
    const body = authController.parseBody(event.body);
    const { email, password } = body;

    // Collect validation errors
    const validationErrors = [];

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      validationErrors.push(emailValidation.message);
    }

    // Validate password (basic validation for login)
    if (!password) {
      validationErrors.push("Password is required");
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Validation failed",
          errors: validationErrors
        }),
      };
    }

    // Call the controller function
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

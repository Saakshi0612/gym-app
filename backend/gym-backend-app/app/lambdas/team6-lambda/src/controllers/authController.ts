// src/controllers/authController.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AdminEmailModel } from "../models/adminEmailModel";
import { CoachEmailModel } from "../models/coachEmailModel";
import { AdminModel, ClientModel, CoachModel, UserModel } from "../models/userModel";
import { authenticateUser, registerUserInCognito } from "../services/cognitoService";
import { comparePassword, hashPassword } from "../utils/passwordUtils";


// Helper function to parse request body
const parseBody = (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    throw new Error("Missing request body");
  }
  return JSON.parse(event.body);
};

// src/controllers/authController.ts
export const registerUser = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Starting user registration process");
    
    // Log the request body
    console.log("Request body:", event.body);
    
    const { email, firstName, lastName, password, target, activity } =
      parseBody(event);

    console.log(`Registration attempt for email: ${email}`);

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      console.log("Missing required fields");
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
    console.log(`Checking if user exists: ${email}`);
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log(`User already exists with email: ${email}`);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "User with this email already exists",
        }),
      };
    }

    // Hash the password
    console.log("Hashing password");
    const passwordHash = await hashPassword(password);
    
    // Check role assignment
    console.log(`Checking role for email: ${email}`);
    
    try {
      console.log("Checking admin emails collection");
      const isAdmin = await AdminEmailModel.findOne({ email: email });
      console.log(`Admin check result: ${JSON.stringify(isAdmin)}`);
      
      console.log("Checking coach emails collection");
      const isCoach = await CoachEmailModel.findOne({ email: email });
      console.log(`Coach check result: ${JSON.stringify(isCoach)}`);
      
      // Create user in MongoDB
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
          preferableActivity: activity || "",
          target: target || ""
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

      console.log(`User created successfully with role: ${newUser.role}`);

      // Try to register with Cognito if available
      if (process.env.USER_POOL_ID && process.env.CLIENT_ID) {
        try {
          console.log("Attempting Cognito registration");
          console.log(`USER_POOL_ID: ${process.env.USER_POOL_ID}`);
          console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);
          
          // Import AWS SDK dynamically to avoid errors if not configured
          const AWS = require('aws-sdk');
          
          // Configure AWS SDK
          AWS.config.update({ 
            region: process.env.AWS_REGION || 'ap-southeast-1'
          });
          
          console.log("AWS SDK configured");
          
          // Create Cognito Identity Service Provider
          const cognitoISP = new AWS.CognitoIdentityServiceProvider();
          console.log("Cognito Identity Service Provider created");
          
          // Create user in Cognito
          const createParams = {
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            TemporaryPassword: password,
            MessageAction: 'SUPPRESS',
            UserAttributes: [
              {
                Name: 'email',
                Value: email
              },
              {
                Name: 'email_verified',
                Value: 'true'
              },
              {
                Name: 'given_name',
                Value: firstName
              },
              {
                Name: 'family_name',
                Value: lastName
              }
            ]
          };
          
          console.log("Calling adminCreateUser with params:", JSON.stringify(createParams, null, 2));
          
          try {
            const createResult = await cognitoISP.adminCreateUser(createParams).promise();
            console.log("Cognito user created:", JSON.stringify(createResult, null, 2));
            
            // Set permanent password
            const setPasswordParams = {
              UserPoolId: process.env.USER_POOL_ID,
              Username: email,
              Password: password,
              Permanent: true
            };
            
            console.log("Setting permanent password");
            await cognitoISP.adminSetUserPassword(setPasswordParams).promise();
            console.log("Password set successfully");
            
            // Add Cognito ID to response
            if (createResult.User && createResult.User.Username) {
              userResponse.cognitoId = createResult.User.Username;
            }
          } catch (cognitoError: any) {
            console.error("Cognito error:", cognitoError);
            console.log("Cognito error code:", cognitoError.code);
            console.log("Cognito error message:", cognitoError.message);
            
            // If user already exists in Cognito, we can continue
            if (cognitoError.code !== 'UsernameExistsException') {
              throw cognitoError;
            }
          }
        } catch (awsError) {
          console.error("AWS SDK error:", awsError);
          // Continue without Cognito integration
        }
      } else {
        console.log("Skipping Cognito integration - environment variables not set");
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: "User registered successfully",
          user: userResponse,
        }),
      };
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      throw dbError;
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: "Error registering user",
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.name : typeof error
      }),
    };
  }
};

// Login a user
// src/controllers/authController.ts - loginUser function
// src/controllers/authController.ts - loginUser function
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

    // Find the user in our database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    // Check if Cognito integration is enabled
    if (!process.env.USER_POOL_ID || !process.env.CLIENT_ID) {
      console.log("Cognito integration not enabled - falling back to local authentication");
      
      // Fall back to local password check
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: "Invalid credentials" }),
        };
      }
      
      // Create user response without Cognito tokens
      const userResponse = createUserResponse(user);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Login successful (local authentication)",
          user: userResponse,
        }),
      };
    }

    // Try Cognito authentication
    try {
      console.log(`Authenticating user with Cognito: ${email}`);
      const authResult = await authenticateUser(email, password);
      console.log(`Cognito authentication successful for ${email}`);
      
      // Create user response with Cognito tokens
      const userResponse = {
        ...createUserResponse(user),
        // Include Cognito tokens
        accessToken: authResult.AuthenticationResult?.AccessToken,
        refreshToken: authResult.AuthenticationResult?.RefreshToken,
        idToken: authResult.AuthenticationResult?.IdToken,
        tokenType: authResult.AuthenticationResult?.TokenType,
        expiresIn: authResult.AuthenticationResult?.ExpiresIn
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Login successful (Cognito authentication)",
          user: userResponse,
        }),
      };
    } catch (cognitoError: any) {
      console.error(`Cognito authentication error for ${email}:`, cognitoError);
      
      // If there's a Cognito error, fall back to local authentication
      console.log("Falling back to local authentication");
      
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: "Invalid credentials" }),
        };
      }
      
      // Create user response without Cognito tokens
      const userResponse = {
        ...createUserResponse(user),
        // Include error info for debugging
        cognitoError: cognitoError.name || 'Unknown error'
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Login successful (local authentication)",
          user: userResponse,
        }),
      };
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
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

// Helper function to create a user response object
const createUserResponse = (user: any) => {
  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    // Include role-specific fields based on user type
    ...(user.role === "CLIENT" && {
      preferableActivity: user.preferableActivity,
      target: user.target,
    }),
    ...(user.role === "COACH" && {
      title: user.title,
      about: user.about,
      rating: user.rating,
      specializations: user.specializations,
    })
  };
};
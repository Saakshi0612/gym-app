// src/controllers/authController.ts
import { UserModel, ClientModel, CoachModel, AdminModel } from "../models/userModel";
import { AdminEmailModel } from "../models/adminEmailModel";
import { CoachEmailModel } from "../models/coachEmailModel";
import { authenticateUser, registerUserInCognito } from "../services/cognitoService";
import { comparePassword, hashPassword, validatePassword } from "../utils/passwordUtils";

// Helper function to parse request body
export const parseBody = (body: string | null) => {
  if (!body) {
    throw new Error("Missing request body");
  }
  return JSON.parse(body);
};

// Register user controller
export const register = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string,
  target?: string,
  activity?: string
) => {
  console.log(`Registration attempt for email: ${email}`);

  // Validate required fields
  if (!email || !firstName || !lastName || !password || !confirmPassword) {
    return {
      success: false,
      statusCode: 400,
      message: "Please provide all required fields: email, firstName, lastName, password, confirmPassword",
    };
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return {
      success: false,
      statusCode: 400,
      message: "Passwords do not match",
    };
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      statusCode: 400,
      message: passwordValidation.message,
    };
  }

  // Check if user already exists in our database
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    console.log(`User already exists with email: ${email}`);
    return {
      success: false,
      statusCode: 400,
      message: "User with this email already exists",
    };
  }

  // Hash the password for our database
  const passwordHash = await hashPassword(password);

  // Check if email exists in admin or coach tables to determine role
  console.log(`Checking if ${email} is in admin or coach lists...`);
  const isAdmin = await AdminEmailModel.findOne({ email: email });
  const isCoach = await CoachEmailModel.findOne({ email: email });

  console.log(`Database check results - isAdmin: ${!!isAdmin}, isCoach: ${!!isCoach}`);

  let newUser;
  let userResponse;
  let userRole = "CLIENT"; // Default role

  // Create user based on role (admin, coach, or client)
  if (isAdmin) {
    console.log(`Creating ADMIN user for email: ${email}`);
    userRole = "ADMIN";
    newUser = await AdminModel.create({
      email,
      firstName,
      lastName,
      passwordHash,
      role: userRole
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
    userRole = "COACH";
    newUser = await CoachModel.create({
      email,
      firstName,
      lastName,
      passwordHash,
      role: userRole,
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
    userRole = "CLIENT";
    newUser = await ClientModel.create({
      email,
      firstName,
      lastName,
      passwordHash,
      role: userRole,
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

  // Register user in Cognito
  try {
    console.log(`Registering user in Cognito: ${email}`);
    const cognitoResult = await registerUserInCognito(email, password, firstName, lastName);
    console.log(`Cognito registration successful for ${email}`);

    // Add the Cognito user ID to the response
    if (cognitoResult.User && cognitoResult.User.Username) {
      userResponse.cognitoId = cognitoResult.User.Username;
    }
  } catch (cognitoError: any) {
    console.error(`Cognito registration error for ${email}:`, cognitoError);

    // If the user already exists in Cognito but not in our DB, we can continue
    if (cognitoError.code !== 'UsernameExistsException' &&
      cognitoError.name !== 'UsernameExistsException') {
      // For other errors, we should log but not fail the registration
      console.error("Continuing with local registration despite Cognito error");
    }
  }

  return {
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    user: userResponse,
  };
};

// Login user controller
export const login = async (email: string, password: string) => {
  // Validate required fields
  if (!email || !password) {
    return {
      success: false,
      statusCode: 400,
      message: "Please provide email and password",
    };
  }

  // Find the user in our database
  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid credentials",
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
        success: false,
        statusCode: 401,
        message: "Invalid credentials",
      };
    }

    // Create user response without Cognito tokens
    const userResponse = createUserResponse(user);

    return {
      success: true,
      statusCode: 200,
      message: "Login successful (local authentication)",
      user: userResponse,
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
      success: true,
      statusCode: 200,
      message: "Login successful (Cognito authentication)",
      user: userResponse,
    };
  } catch (cognitoError: any) {
    console.error(`Cognito authentication error for ${email}:`, cognitoError);

    // If there's a Cognito error, fall back to local authentication
    console.log("Falling back to local authentication");

    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: 401,
        message: "Invalid credentials",
      };
    }

    // Create user response without Cognito tokens
    const userResponse = {
      ...createUserResponse(user),
      // Include error info for debugging
      cognitoError: cognitoError.name || 'Unknown error'
    };

    return {
      success: true,
      statusCode: 200,
      message: "Login successful (local authentication)",
      user: userResponse,
    };
  }
};

// Helper function to create a user response object
export const createUserResponse = (user: any) => {
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
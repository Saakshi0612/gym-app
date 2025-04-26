// src/middleware/authMiddleware.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Define interface for middleware context
export interface MiddlewareContext {
  userId?: string;
  userRole?: string;
  email?: string;
  isAuthenticated: boolean;
}

// Create JWT verifier for Cognito
const createVerifier = () => {
  const userPoolId = process.env.USER_POOL_ID;
  const clientId = process.env.CLIENT_ID;
  
  if (!userPoolId || !clientId) {
    console.warn("USER_POOL_ID or CLIENT_ID not set. Token verification will fail.");
    return null;
  }
  
  return CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: "access",
    clientId,
  });
};

// Middleware to verify JWT token
export const verifyToken = async (
  event: APIGatewayProxyEvent
): Promise<MiddlewareContext> => {
  try {
    // Get token from Authorization header
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      return { isAuthenticated: false };
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return { isAuthenticated: false };
    }

    // Create verifier
    const verifier = createVerifier();
    if (!verifier) {
      return { isAuthenticated: false };
    }

    // Verify token
    const payload = await verifier.verify(token);
    
    return {
      isAuthenticated: true,
      userId: payload.sub,
      email: payload.email,
      userRole: payload["custom:role"] || "CLIENT", // Assuming you store role in a custom attribute
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { isAuthenticated: false };
  }
};

// Middleware to require authentication
export const requireAuth = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult | null> => {
  const context = await verifyToken(event);
  
  if (!context.isAuthenticated) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
  
  return null; // Continue to the handler
};

// Middleware to require admin role
export const requireAdmin = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult | null> => {
  const context = await verifyToken(event);
  
  if (!context.isAuthenticated) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
  
  if (context.userRole !== "ADMIN") {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ message: "Forbidden: Admin access required" }),
    };
  }
  
  return null; // Continue to the handler
};

// Middleware to require coach role
export const requireCoach = async (
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult | null> => {
  const context = await verifyToken(event);
  
  if (!context.isAuthenticated) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
  
  if (context.userRole !== "COACH" && context.userRole !== "ADMIN") {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ message: "Forbidden: Coach access required" }),
    };
  }
  
  return null; // Continue to the handler
};

// Get user context from token (for use in handlers)
export const getUserContext = async (
  event: APIGatewayProxyEvent
): Promise<MiddlewareContext> => {
  return await verifyToken(event);
};
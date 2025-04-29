// src/services/cognitoService.ts
import { 
  CognitoIdentityProviderClient, 
  AdminInitiateAuthCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminGetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

// Create a client
const client = new CognitoIdentityProviderClient({ 
  region: process.env.AWS_REGION || 'ap-southeast-1'
});

// Get User Pool ID and Client ID from environment variables
const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

if (!USER_POOL_ID || !CLIENT_ID) {
  console.error('USER_POOL_ID and CLIENT_ID environment variables must be set');
}

export const authenticateUser = async (
  email: string,
  password: string
) => {
  try {
    console.log(`Authenticating user: ${email}`);
    console.log(`Using USER_POOL_ID: ${USER_POOL_ID}`);
    console.log(`Using CLIENT_ID: ${CLIENT_ID}`);
    
    const params = {
      UserPoolId: USER_POOL_ID!,
      ClientId: CLIENT_ID!,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    
    console.log('Calling adminInitiateAuth with params:', JSON.stringify({
      ...params,
      AuthParameters: { USERNAME: email, PASSWORD: '***' } // Don't log the actual password
    }));
    
    const command = new AdminInitiateAuthCommand(params);
    return await client.send(command);
  } catch (error) {
    console.error('Error authenticating user in Cognito:', error);
    throw error;
  }
};

export const registerUserInCognito = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    // First, create the user with a temporary password
    const createParams = {
      UserPoolId: USER_POOL_ID!,
      Username: email,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS', // Don't send welcome email
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

    const createCommand = new AdminCreateUserCommand(createParams);
    const createResult = await client.send(createCommand);
    
    // Then, set the permanent password
    const setPasswordParams = {
      UserPoolId: USER_POOL_ID!,
      Username: email,
      Password: password,
      Permanent: true
    };
    
    const setPasswordCommand = new AdminSetUserPasswordCommand(setPasswordParams);
    await client.send(setPasswordCommand);
    
    return createResult;
  } catch (error) {
    console.error('Error registering user in Cognito:', error);
    throw error;
  }
};

export const getUserFromCognito = async (
  email: string
) => {
  try {
    const params = {
      UserPoolId: USER_POOL_ID!,
      Username: email
    };
    
    const command = new AdminGetUserCommand(params);
    return await client.send(command);
  } catch (error) {
    console.error('Error getting user from Cognito:', error);
    throw error;
  }
};
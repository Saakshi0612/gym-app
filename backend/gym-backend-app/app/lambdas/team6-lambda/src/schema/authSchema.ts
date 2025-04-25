// src/schemas/authSchema.ts
export const registerSchema = {
    type: 'object',
    required: ['email', 'firstName', 'lastName', 'password', 'confirmPassword'],
    properties: {
      email: {
        type: 'string',
        format: 'email'
      },
      firstName: {
        type: 'string',
        minLength: 1
      },
      lastName: {
        type: 'string',
        minLength: 1
      },
      password: {
        type: 'string',
        minLength: 8
      },
      confirmPassword: {
        type: 'string',
        minLength: 8
      },
      target: {
        type: 'string'
      },
      activity: {
        type: 'string'
      }
    }
  };
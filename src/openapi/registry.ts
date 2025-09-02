
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { UserSchema } from '../model/UserSchema.ts';

export { z };
// Create OpenAPI registry
export const registry = new OpenAPIRegistry();

// Register schemas
registry.register('User', UserSchema);

// Register paths 
//Create user Path
registry.registerPath({
  method: 'post',
  path: '/api/users/signup',
  summary: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully.',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: 'Bad request.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
  security: [{ apiKey: [] }] //Apply Basic Authentication
});
//Login user path
registry.registerPath({
  method: 'post',
  path: '/api/users/login',
  summary: 'Log in user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().openapi({ example: 'example@email.com' }),
            password: z.string().openapi({ example: 'password123' })
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Logged in User successfully.',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: 'Bad request.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
  security: [{ apiKey: [] }] //Apply Basic Authentication
});

//Get user path
registry.registerPath({
  method: 'get',
  summary: 'Get user by ID',
  path: '/api/users/',
  request: {
    query: z.object({id: z.string()}),
  },
  responses: {
    201: {
      description: 'Object with User data',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    400: {
      description: 'Bad request.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
  security: [{ BearerAuth: [] }] //Apply Basic Authentication
});
registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  name: 'JWT',
});
// Add to endpoint: security: [{ apiKey: [] }]

// Utility to generate the OpenAPI document
export const generateOpenApiDoc = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'HR-ERP API',
      description: 'This is the API',
    },
  servers: [{ url: '/' }], // Set to root to avoid double /api/api
  });
}

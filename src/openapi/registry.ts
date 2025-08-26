
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
extendZodWithOpenApi(z);
// Guarantor schemas (inlined to avoid import/export issues)
export const guarantorSchema = z.object({
  applicant: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  address: z.string(),
  relationship: z.string(),
  filledAt: z.string().datetime().optional(),
});

export const guarantorInvitationSchema = z.object({
  applicant: z.string(),
  email: z.string().email(),
  token: z.string(),
  link: z.string().url(),
  status: z.enum(["pending", "completed", "expired"]),
  sentAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});
// Extend Zod with OpenAPI support (call once in your entrypoint)

export { z };

// Define Zod schema for a generic resource (e.g., User)
export const UserSchema = z
  .object({
    id: z.string().openapi({ example: '1212121' }),
    name: z.string().openapi({ example: 'John Doe' }),
    age: z.number().openapi({ example: 42 }),
  })
  .openapi('User');

// Create OpenAPI registry
export const registry = new OpenAPIRegistry();

// Register schemas
registry.register('User', UserSchema);
registry.register('Guarantor', guarantorSchema);
registry.register('GuarantorInvitation', guarantorInvitationSchema);

// Guarantor API paths
registry.registerPath({
  method: 'post',
  path: '/guarantors/send-invite',
  summary: 'Send a guarantor invitation',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ email: z.email() }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Invitation sent',
      content: {
        'application/json': {
          schema: guarantorInvitationSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/guarantors/submit-form',
  summary: 'Submit a guarantor form',
  request: {
    query: z.object({ token: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: guarantorSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Guarantor form submitted',
      content: {
        'application/json': {
          schema: guarantorSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

// Register API paths
registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  summary: 'Get a single user',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Object with user data.',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
    404: {
      description: 'User not found.',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/users',
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
});


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
    servers: [{ url: '/api' }], // Set to match your API base path
  });
}

// import type { password } from 'bun';
import { z } from '../openapi/registry.ts';
import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

// Define Zod schema for a generic resource (e.g., User)
export const UserSchema = z
  .object({
    name: z.string().openapi({ example: 'John Doe' }),
    email: z.string().openapi({ example: 'example@email.com' }),
    password: z.string().openapi({ example: 'password123' }),
    age: z.number().openapi({ example: 42 }),
  })
  .openapi('User');
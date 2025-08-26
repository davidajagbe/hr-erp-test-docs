import express from 'express';
import { z } from 'zod';
import User from '../model/UserModel.ts';
import mongoose from 'mongoose';
import { UserSchema } from '../openapi/registry.ts';

const router = express.Router();

// Parse Zod schema for validation
const UserInputSchema = UserSchema.omit({ id: true }); // Exclude id for POST

router.post('/', async (req, res) => {
  try {
    // Validate request body with Zod
    const validatedData = UserInputSchema.parse(req.body);
    const user = new User({ ...validatedData, id: new mongoose.Types.ObjectId().toString() });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
    res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      res.status(400).json({ message: 'Error creating user', error });
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Validate params with Zod
    const params = z.object({ id: z.string() }).parse(req.params);
    const user = await User.findOne({ id: params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }
});

export default router;
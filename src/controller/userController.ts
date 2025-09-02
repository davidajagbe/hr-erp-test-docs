import { z } from 'zod';
import User from '../model/UserModel.ts';
import mongoose from 'mongoose';
// import { Request, Response } from 'express';
import { UserSchema } from '../model/UserSchema.ts';
import { generateToken } from '../token.ts';
import type { Request,Response } from 'express';
import type { TypePayload } from '../token.ts'; 

interface LoginDTO {
	email: string;
	password: string;
}
// Parse Zod schema for validation
// const UserInputSchema = UserSchema.omit({ id: true }); 
export const createUser = async (req:Request, res:Response) => {
    try {
        // Validate request body with Zod
        const validatedData = (req.body);
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
}
export const loginUser = async (req: Request, res:Response) => {

    try {
        console.log("Entered loginUser controller");
        // Validate request body with Zod
        const validatedData = req.body as LoginDTO;
        console.log(validatedData);
        const user = await User.findOne({ email: validatedData.email, password: validatedData.password });
        console.log("User found:", user);
        
        const token = generateToken({ 
            id: user?._id,
            role: user?.role
        } as TypePayload);
        if (!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful',token });
    } catch (error) {
        if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation error', errors: error.issues });
        } else {
        res.status(400).json({ message: 'Error logging in', error });
        }
    }
}
export const getUser = async (req:Request, res:Response) => {
  try {
    // Access JWT payload from middleware
    const userPayload = (req as any).user;
    const params = req.query;
    const user = await User.findOne({ _id: params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Example: you can check userPayload.role or userPayload.id here
    res.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }
}
import jwt, {
	type SignOptions,
    type VerifyOptions,
} from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import type {  ObjectId } from "mongoose";
import type { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = 24 * 60 * 60; // 24 hours

export interface TypePayload {
    id: string | ObjectId;
    role:string;
}
export const generateToken = (payload:TypePayload) =>{
    const options:SignOptions = { expiresIn: JWT_EXPIRES }
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }   
    return jwt.sign(payload,JWT_SECRET,options);
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const options: VerifyOptions = {};
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }
        const payload = jwt.verify(token, JWT_SECRET, options);
        (req as any).user = payload; // Attach payload to req
        next();
    } catch (error) { 
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired." });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token." });
        }
        return res.status(401).json({ message: "Authentication failed." });
    }
}

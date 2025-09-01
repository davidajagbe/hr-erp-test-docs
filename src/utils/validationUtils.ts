import crypto from "crypto";
import mongoose from "mongoose";
import { OnboardingToken } from "../modules/onboarding/onboarding.model";
import { ApiError } from "./response-handler";

// Hash password
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw ApiError.badRequest("Please provide a password");
  }
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
  return hashedPassword;
}

/**
 * Compares an incoming password with an existing hashed password.
 *
 * @param incomingPassword - The password to verify.
 * @param existingPassword - The hashed password to compare against.
 * @throws {ApiError} If either password is not provided or if the passwords do not match.
 */
export async function comparePassword(
  incomingPassword: string,
  existingPassword: string
): Promise<void> {
  if (!incomingPassword || !existingPassword) {
    throw ApiError.badRequest("Please provide a password");
  }
  const isMatch = await Bun.password.verify(incomingPassword, existingPassword);
  if (!isMatch) {
    throw ApiError.unauthorized("Password or email is incorrect");
  }
}

// Checks if an id is a valid mongoose Id
export function validateMongoId(id: string): void {
  const isValid = mongoose.isValidObjectId(id);
  if (!isValid) {
    throw ApiError.badRequest("Invalid Id");
  }
}

export async function validateOnboardingToken(token: string, email: string) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const record = await OnboardingToken.findOne({ email, token: hashedToken });
  if (!record || record.expiresAt < new Date()) {
    throw ApiError.unauthorized("Onboarding link is invalid or expired");
  }

  return true;
}

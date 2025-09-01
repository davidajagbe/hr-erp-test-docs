import { randomBytes } from "crypto";

/**
 * Generate a cryptographically secure token.
 * @param length The number of random bytes (not characters).
 * @param prefix Optional prefix (e.g., "pk", "sk")
 */
export function generateSecureToken(length: number = 32, prefix = ""): string {
	const token = randomBytes(length).toString("hex");
	return prefix ? `${prefix}_${token}` : token;
}

import crypto from "crypto";

export function generateHmacSignature(secret: string, data: string): string {
	return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

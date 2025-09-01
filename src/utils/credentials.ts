import { generateSecureToken } from "./token";

function createModuleAccess(env: "dev" | "prod") {
	const createdAt = new Date();
	const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
	return {
		apiKey: generateSecureToken(16, env === "prod" ? "pk" : "pk_test"),
		apiSecret: generateSecureToken(32, env === "prod" ? "sk" : "sk_test"),
		createdAt,
		expiresAt,
		lastIssuedAt: undefined,
	};
}

export default createModuleAccess;

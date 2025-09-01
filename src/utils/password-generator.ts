import crypto from "crypto";

interface PasswordOptions {
	length?: number;
	includeUppercase?: boolean;
	includeLowercase?: boolean;
	includeNumbers?: boolean;
	includeSymbols?: boolean;
	excludeSimilarChars?: boolean;
	customCharset?: string;
}

interface GeneratedPassword {
	password: string;
	strength: "weak" | "medium" | "strong" | "very-strong";
	expiresAt?: Date;
}

export class PasswordGenerator {
	private static readonly DEFAULT_OPTIONS: Required<PasswordOptions> = {
		length: 12,
		includeUppercase: true,
		includeLowercase: true,
		includeNumbers: true,
		includeSymbols: true,
		excludeSimilarChars: true,
		customCharset: "",
	};

	private static readonly CHARSET = {
		uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		lowercase: "abcdefghijklmnopqrstuvwxyz",
		numbers: "0123456789",
		symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
		similarChars: "0O1lI|`",
	};

	/**
	 * Generates a secure default password for user onboarding
	 * @param options - Password generation options
	 * @returns Generated password with metadata
	 */
	public static generateDefaultPassword(
		options: PasswordOptions = {},
	): GeneratedPassword {
		const opts = { ...PasswordGenerator.DEFAULT_OPTIONS, ...options };

		// Build character set
		let charset = "";
		if (opts.customCharset) {
			charset = opts.customCharset;
		} else {
			if (opts.includeUppercase) charset += PasswordGenerator.CHARSET.uppercase;
			if (opts.includeLowercase) charset += PasswordGenerator.CHARSET.lowercase;
			if (opts.includeNumbers) charset += PasswordGenerator.CHARSET.numbers;
			if (opts.includeSymbols) charset += PasswordGenerator.CHARSET.symbols;
		}

		// Remove similar characters if requested
		if (opts.excludeSimilarChars && !opts.customCharset) {
			for (const char of PasswordGenerator.CHARSET.similarChars) {
				charset = charset.replace(new RegExp(char, "g"), "");
			}
		}

		if (charset.length === 0) {
			throw new Error(
				"Character set is empty. Please enable at least one character type.",
			);
		}

		// Generate password using crypto.randomBytes for security
		const password = PasswordGenerator.generateSecurePassword(
			charset,
			opts.length,
		);

		// Ensure password meets requirements
		const validatedPassword = PasswordGenerator.ensurePasswordComplexity(
			password,
			opts,
		);

		return {
			password: validatedPassword,
			strength: PasswordGenerator.calculatePasswordStrength(validatedPassword),
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
		};
	}

	/**
	 * Batch generate passwords for multiple users
	 * @param count - Number of passwords to generate
	 * @param options - Password generation options
	 * @returns Array of generated passwords
	 */
	public static generateBatchPasswords(
		count: number,
		options: PasswordOptions = {},
	): GeneratedPassword[] {
		return Array.from({ length: count }, () =>
			PasswordGenerator.generateDefaultPassword(options),
		);
	}

	private static generateSecurePassword(
		charset: string,
		length: number,
	): string {
		const randomBytes = crypto.randomBytes(length * 2); // Extra bytes for better randomness
		let password = "";

		for (let i = 0; i < length; i++) {
			const randomIndex = randomBytes[i]! % charset.length;
			password += charset[randomIndex];
		}

		return password;
	}

	private static ensurePasswordComplexity(
		password: string,
		options: Required<PasswordOptions>,
	): string {
		let result = password;
		const checks = [];

		// Ensure at least one character from each required type
		if (options.includeUppercase && !/[A-Z]/.test(result)) {
			checks.push(() => {
				const pos = Math.floor(Math.random() * result.length);
				const char =
					PasswordGenerator.CHARSET.uppercase[
						Math.floor(
							Math.random() * PasswordGenerator.CHARSET.uppercase.length,
						)
					];
				result = result.substring(0, pos) + char + result.substring(pos + 1);
			});
		}

		if (options.includeLowercase && !/[a-z]/.test(result)) {
			checks.push(() => {
				const pos = Math.floor(Math.random() * result.length);
				const char =
					PasswordGenerator.CHARSET.lowercase[
						Math.floor(
							Math.random() * PasswordGenerator.CHARSET.lowercase.length,
						)
					];
				result = result.substring(0, pos) + char + result.substring(pos + 1);
			});
		}

		if (options.includeNumbers && !/[0-9]/.test(result)) {
			checks.push(() => {
				const pos = Math.floor(Math.random() * result.length);
				const char =
					PasswordGenerator.CHARSET.numbers[
						Math.floor(Math.random() * PasswordGenerator.CHARSET.numbers.length)
					];
				result = result.substring(0, pos) + char + result.substring(pos + 1);
			});
		}

		if (
			options.includeSymbols &&
			!/[!@#$%^&*()_+\-=\\[\]{}|;:,.<>?]/.test(result)
		) {
			checks.push(() => {
				const pos = Math.floor(Math.random() * result.length);
				const char =
					PasswordGenerator.CHARSET.symbols[
						Math.floor(Math.random() * PasswordGenerator.CHARSET.symbols.length)
					];
				result = result.substring(0, pos) + char + result.substring(pos + 1);
			});
		}

		// Execute all checks
		checks.forEach((check) => check());

		return result;
	}

	private static calculatePasswordStrength(
		password: string,
	): "weak" | "medium" | "strong" | "very-strong" {
		let score = 0;

		// Length scoring
		if (password.length >= 8) score += 1;
		if (password.length >= 12) score += 1;
		if (password.length >= 16) score += 1;

		// Character variety scoring
		if (/[a-z]/.test(password)) score += 1;
		if (/[A-Z]/.test(password)) score += 1;
		if (/[0-9]/.test(password)) score += 1;
		if (/[^a-zA-Z0-9]/.test(password)) score += 1;

		// Pattern checking (reduce score for common patterns)
		if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
		if (/123|abc|qwe/i.test(password)) score -= 1; // Sequential patterns

		if (score <= 2) return "weak";
		if (score <= 4) return "medium";
		if (score <= 6) return "strong";
		return "very-strong";
	}
}

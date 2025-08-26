import { z } from 'zod';

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
	phoneNumber: z.string(),
	address: z.string(),
	relationship: z.string(),
	filledAt: z.string().datetime().optional(),
});

// export const guarantorInvitationSchema = z.object({
// 	applicant: z.string(),
// 	email: z.string().email(),
// 	token: z.string(),
// 	link: z.string().url(),
// 	status: z.enum(["pending", "completed", "expired"]),
// 	sentAt: z.string().datetime(),
// 	completedAt: z.string().datetime().optional(),
// 	expiresAt: z.date().optional(),
// });
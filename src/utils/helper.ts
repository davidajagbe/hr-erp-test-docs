import Campaign from "../modules/campaign/campaign.model";
import Sla from "../modules/staff/crystal-checks/cci.models";
import {
	type AuthenticatedUser,
	UserRolesEnum,
} from "../modules/user/user.interface";

export async function generateCampaignId(clientId: string): Promise<string> {
	const prefix = "CAM";

	const lastCampaign = await Campaign.findOne(
		{ clientId, campaignId: { $regex: `^${prefix}\\d+$` } },
		{ campaignId: 1 },
	).sort({ campaignId: -1 });

	let nextNumber = 1;

	if (lastCampaign && lastCampaign.campaignId) {
		const lastNumber = parseInt(lastCampaign.campaignId.replace(prefix, ""));
		nextNumber = lastNumber + 1;
	}

	return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
}

export async function generateSlaRequestId(): Promise<string> {
	const prefix = "RQ";

	const lastSla = await Sla.findOne(
		{ requestId: { $regex: `^${prefix}\\d+$` } },
		{ requestId: 1 },
	).sort({ requestId: -1 });

	let nextNumber = 1;

	if (lastSla && lastSla.requestId) {
		const lastNumber = parseInt(lastSla.requestId.replace(prefix, ""));
		if (!isNaN(lastNumber)) {
			nextNumber = lastNumber + 1;
		}
	}

	return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
}

export function buildProjection(
	fields?: string,
	allowedFields?: string[],
): Record<string, 1> {
	if (!fields) return {};

	return fields
		.split(",")
		.map((field) => field.trim())
		.filter((field) => allowedFields?.includes(field))
		.reduce(
			(projection, field) => {
				projection[field.trim()] = 1;
				return projection;
			},
			{} as Record<string, 1>,
		);
}

/**
 * Restrict a MongoDB filter to only allow admins to bypass the filter.
 *
 * @param {Record<string, any>} filter - The MongoDB filter to be restricted.
 * @param {AuthenticatedUser} user - The authenticated user.
 * @param {boolean} [adminBypass=true] - Whether to allow admins to bypass the filter.
 * @returns {Record<string, any>} - The restricted filter.
 *
 * @example
 * // Usage Example:
 * const client = await Client.findOne(restrictIfNotAdmin({_id: req.params.id, adminEmail: req.user.email}, req.user))
 */
export function restrictIfNotAdmin(
	filter: Record<string, any>,
	user: AuthenticatedUser,
	adminBypass: boolean = true,
) {
	if (
		adminBypass &&
		(user.role === UserRolesEnum.SUPER_ADMIN ||
			user.role === UserRolesEnum.ADMIN ||
			user.role === UserRolesEnum.STAFF)
	) {
		return { _id: filter._id };
	}

	return filter;
}

/**
 * Omits the specified fields from the given object.
 *
 * @param {Record<string, any>} obj - The object to be processed.
 * @param {string[]} forbiddenFields - The names of the fields to be omitted.
 * @returns {Partial<T>} - A partial version of the given object with the specified fields omitted.
 *
 * @example
 * // Usage Example:
 * const user = {id: 1, name: 'John Doe', password: 'secret'};
 * const userWithoutPassword = omitFields(user, ['password']);
 * // userWithoutPassword is {id: 1, name: 'John Doe'}
 */
export function omitFields<T extends Record<string, any>>(
	obj: T,
	forbiddenFields: string[],
): Partial<T> {
	const result = { ...obj };
	for (const field of forbiddenFields) {
		if (field in result) {
			delete result[field];
		}
	}
	return result;
}

export function pickFields<T extends Record<string, any>>(
	obj: T,
	allowedFields: string[],
): Partial<T> {
	const result = { ...obj };
	for (const field in result) {
		if (!allowedFields.includes(field)) {
			delete result[field];
		}
	}
	return result;
}

export function getFileExtension(fileName: string): string | null {
	const lastDotIndex = fileName.lastIndexOf(".");
	if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
		return null;
	}
	return fileName.slice(lastDotIndex);
}

export function redactSensitiveFields(data: Record<string, any>) {
  const redacted = {...data};
  ["password", "confirmPassword"].forEach((field) => {
    if (field in redacted) redacted[field] = "***";
  });
  return redacted;
}

export function normalizeSkill(s: string) {
  return s.trim();
}
export function keyOf(s: string) {
  return normalizeSkill(s).toLowerCase();
}
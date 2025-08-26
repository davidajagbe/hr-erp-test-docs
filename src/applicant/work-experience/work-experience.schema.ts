import { z } from "zod/v4";

export class WorkExperienceSchemas {
  static addWorkExperience = z.object({
    workExperience: z.array(
      z
        .object({
          jobTitle: z.string().min(2).max(100),
          employmentType: z.enum([
            "full-time",
            "part-time",
            "contract",
            "internship",
          ]),
          company: z.string().min(2).max(100),
          startDate: z.coerce.date(),
          endDate: z.coerce.date().optional(),
          location: z.string().min(2).max(100),
          workType: z.enum(["remote", "on-site", "hybrid"]),
          description: z.string().min(10).max(500),
          currentlyWorking: z.boolean().optional().default(false),
        })
        .refine(
          (data) => {
            if (data.currentlyWorking && data.endDate) {
              return false;
            }
            if (!data.endDate && !data.currentlyWorking) {
              return false;
            }
            return true;
          },
          {
            path: ["endDate"],
            error: "endDate is required when not currently working",
          }
        )
    ),
  });
  static updateWorkExperience = z
    .object({
      jobTitle: z.string().min(2).max(100).optional(),
      employmentType: z
        .enum(["full-time", "part-time", "contract", "internship"])
        .optional(),
      company: z.string().min(2).max(100).optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      location: z.string().min(2).max(100).optional(),
      workType: z.enum(["remote", "on-site", "hybrid"]).optional(),
      description: z.string().min(10).max(500).optional(),
      currentlyWorking: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      const touchedCW = Object.prototype.hasOwnProperty.call(
        data,
        "currentlyWorking"
      );
      const touchedEnd = Object.prototype.hasOwnProperty.call(data, "endDate");

      if (touchedCW) {
        if (data.currentlyWorking === true && touchedEnd && data.endDate) {
          ctx.addIssue({
            code: "custom",
            path: ["endDate"],
            message: "endDate must be omitted when currently working",
          });
        }
        if (data.currentlyWorking === false && !touchedEnd) {
          ctx.addIssue({
            code: "custom",
            path: ["endDate"],
            message:
              "endDate is required when setting currentlyWorking to false",
          });
        }
      }

      if (data.startDate && data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "endDate cannot be before startDate",
        });
      }
    });

  static applicantParams = z.object({
    workExperienceId: z
      .string()
      .min(1, "Experience id is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid workExperienceId id"),
  });
}

export type AddWorkExperienceDTO = z.infer<
  typeof WorkExperienceSchemas.addWorkExperience
>["workExperience"][number];
export type UpdateWorkExperienceDTO = Partial<AddWorkExperienceDTO>;
export type DeleteWorkExperienceDTO = z.infer<
  typeof WorkExperienceSchemas.applicantParams
>;

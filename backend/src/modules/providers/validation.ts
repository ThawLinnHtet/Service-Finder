import { z } from "zod";
import { NRC_TYPES } from "../../common/constants/nrc";
import { MAX_SERVICE_AREAS_PER_SERVICE } from "../../common/constants/service-areas";
import { coordinateLocationSchema } from "../../common/validation/location";
import {
  parseJsonObjectInput,
  parseRequiredNumberInput,
  parseStringArrayInput,
} from "../../common/validation/preprocess";

const stringArrayFromUnknown = z.preprocess(parseStringArrayInput, z.array(z.string()));

export const resubmitProviderSchema = z.object({
  body: z
    .object({
      location: z.preprocess(parseJsonObjectInput, coordinateLocationSchema),
      about: z
        .string({ error: "About is required" })
        .trim()
        .min(10, "About must be at least 10 characters")
        .max(1500, "About must be less than 1500 characters"),
      nrcStateCode: z
        .string({ error: "NRC state code is required" })
        .trim()
        .min(1, "NRC state code is required")
        .max(20, "NRC state code is too long"),
      nrcTownshipCode: z
        .string({ error: "NRC township code is required" })
        .trim()
        .min(1, "NRC township code is required")
        .max(20, "NRC township code is too long"),
      nrcType: z.enum(NRC_TYPES, {
        error: "NRC type is required",
      }),
      nrcNumber: z
        .string({ error: "NRC number is required" })
        .trim()
        .regex(/^\d{6}$/, "NRC number must be exactly 6 digits"),
      categoryId: z.string({ error: "Category is required" }).uuid("Invalid category ID"),
      title: z
        .string({ error: "Service title is required" })
        .trim()
        .min(3, "Service title must be at least 3 characters")
        .max(120, "Service title must be less than 120 characters"),
      price: z.preprocess(
        parseRequiredNumberInput,
        z
          .coerce
          .number({ error: "Price is required" })
          .min(10000, "Price must be at least 10,000 MMK")
          .max(1000000, "Price must be at most 1,000,000 MMK"),
      ),
      experienceYears: z.preprocess(
        parseRequiredNumberInput,
        z
          .coerce
          .number({ error: "Experience years is required" })
          .int("Experience years must be a whole number")
          .min(0, "Experience years cannot be negative")
          .max(70, "Experience years is too high"),
      ),
      predefinedSkillIds: z
        .preprocess(parseStringArrayInput, z.array(z.string().uuid("Invalid skill ID")))
        .default([]),
      customSkills: stringArrayFromUnknown
        .pipe(
          z.array(
            z
              .string()
              .trim()
              .min(1, "Custom skill cannot be empty")
              .max(80, "Custom skill must be less than 80 characters"),
          ),
        )
        .default([]),
      serviceAreas: stringArrayFromUnknown.pipe(
        z
          .array(
            z
              .string()
              .trim()
              .min(2, "Service area must be at least 2 characters")
              .max(80, "Service area must be less than 80 characters"),
          )
          .min(1, "At least one service area is required")
          .max(
            MAX_SERVICE_AREAS_PER_SERVICE,
            `You can select up to ${MAX_SERVICE_AREAS_PER_SERVICE} service areas`,
          ),
      ),
    })
    .strict(),
});

export type ResubmitProviderInput = z.infer<typeof resubmitProviderSchema>["body"];

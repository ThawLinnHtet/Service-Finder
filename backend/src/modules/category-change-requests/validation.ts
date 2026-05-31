import { z } from "zod";
import {
  parseRequiredNumberInput,
  parseStringArrayInput,
} from "../../common/validation/preprocess";

const stringArrayFromUnknown = z.preprocess(parseStringArrayInput, z.array(z.string()));

const REQUEST_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export const createCategoryChangeRequestSchema = z.object({
  body: z
    .object({
      requestedCategoryId: z
        .string({ error: "Requested category is required" })
        .uuid("Invalid category ID"),
      title: z
        .string({ error: "Service title is required" })
        .trim()
        .min(3, "Service title must be at least 3 characters")
        .max(120, "Service title must be less than 120 characters"),
      reason: z
        .string({ error: "Reason is required" })
        .trim()
        .min(10, "Reason must be at least 10 characters")
        .max(500, "Reason must be less than 500 characters"),
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
    })
    .strict(),
});

export const listCategoryChangeRequestsSchema = z.object({
  query: z
    .object({
      status: z.enum(REQUEST_STATUSES).optional(),
      cursor: z.string().uuid("Invalid cursor").optional(),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export const categoryChangeRequestIdParamSchema = z.object({
  params: z
    .object({
      requestId: z
        .string({ error: "Request ID is required" })
        .uuid("Invalid request ID"),
    })
    .strict(),
});

export const rejectCategoryChangeRequestSchema = z.object({
  params: z
    .object({
      requestId: z
        .string({ error: "Request ID is required" })
        .uuid("Invalid request ID"),
    })
    .strict(),
  body: z
    .object({
      rejectionReason: z
        .string({ error: "Rejection reason is required" })
        .trim()
        .min(5, "Rejection reason must be at least 5 characters")
        .max(500, "Rejection reason must be less than 500 characters"),
    })
    .strict(),
});

export type CreateCategoryChangeRequestInput = z.infer<
  typeof createCategoryChangeRequestSchema
>["body"];
export type ListCategoryChangeRequestsQuery = z.infer<
  typeof listCategoryChangeRequestsSchema
>["query"];
export type RejectCategoryChangeRequestInput = z.infer<
  typeof rejectCategoryChangeRequestSchema
>["body"];

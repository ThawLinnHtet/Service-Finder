import { z } from "zod";

const PROVIDER_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export const listProvidersSchema = z.object({
  query: z
    .object({
      status: z.enum(PROVIDER_STATUSES).optional(),
      cursor: z.string().uuid("Invalid cursor").optional(),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export const providerIdParamSchema = z.object({
  params: z
    .object({
      providerId: z.string({ error: "Provider ID is required" }).uuid("Invalid provider ID"),
    })
    .strict(),
});

export const rejectProviderSchema = z.object({
  params: z
    .object({
      providerId: z.string({ error: "Provider ID is required" }).uuid("Invalid provider ID"),
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

export type ListProvidersQuery = z.infer<typeof listProvidersSchema>["query"];
export type RejectProviderInput = z.infer<typeof rejectProviderSchema>["body"];

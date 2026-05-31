import { z } from "zod";

const emptyStringToUndefined = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();
  return value ? value : undefined;
};

export const createBookingReviewSchema = z.object({
  params: z
    .object({
      bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    })
    .strict(),
  body: z
    .object({
      rating: z
        .coerce
        .number({ error: "Rating is required" })
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    })
    .strict(),
});

export const listServiceReviewsSchema = z.object({
  params: z
    .object({
      serviceId: z.string({ error: "Service ID is required" }).uuid("Invalid service ID"),
    })
    .strict(),
  query: z
    .object({
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export const listProviderReviewsSchema = z.object({
  query: z
    .object({
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export const listCustomerReviewsSchema = z.object({
  query: z
    .object({
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export type CreateBookingReviewInput = z.infer<typeof createBookingReviewSchema>["body"];
export type ListServiceReviewsQuery = z.infer<typeof listServiceReviewsSchema>["query"];
export type ListProviderReviewsQuery = z.infer<typeof listProviderReviewsSchema>["query"];
export type ListCustomerReviewsQuery = z.infer<typeof listCustomerReviewsSchema>["query"];

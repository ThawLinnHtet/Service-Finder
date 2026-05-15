import { z } from "zod";

const BOOKING_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
] as const;

const emptyStringToUndefined = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();
  return value ? value : undefined;
};

const optionalDateString = z.preprocess(
  emptyStringToUndefined,
  z.string().datetime("Scheduled date must be a valid ISO datetime").optional(),
);

export const createBookingSchema = z.object({
  body: z
    .object({
      serviceId: z.string({ error: "Service ID is required" }).uuid("Invalid service ID"),
      note: z
        .preprocess(
          emptyStringToUndefined,
          z
            .string()
            .trim()
            .min(1, "Booking note cannot be empty")
            .max(500, "Booking note must be less than 500 characters")
            .optional(),
        ),
      scheduledAt: optionalDateString,
    })
    .strict(),
});

export const listBookingsSchema = z.object({
  query: z
    .object({
      status: z.enum(BOOKING_STATUSES).optional(),
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export const bookingIdParamSchema = z.object({
  params: z
    .object({
      bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    })
    .strict(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
export type ListBookingsQuery = z.infer<typeof listBookingsSchema>["query"];

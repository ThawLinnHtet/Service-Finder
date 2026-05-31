import { z } from "zod";
import {
  AppError,
  ForbiddenError,
  ValidationError,
} from "../../common/errors/app-error";
import {
  createReviewAndRefreshProviderAggregate,
  findBookingForReviewById,
  hasServiceById,
  listReviewsByCustomerId,
  listReviewsByProviderId,
  listReviewsByServiceId,
  type ReviewListCursor,
  type ReviewRecord,
} from "./repository";
import type {
  CreateBookingReviewInput,
  ListCustomerReviewsQuery,
  ListProviderReviewsQuery,
  ListServiceReviewsQuery,
} from "./validation";

const cursorSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .strict();

const COMPLETED_BOOKING_STATUS = "COMPLETED";

const toReviewResponse = (review: ReviewRecord) => {
  return {
    id: review.id,
    bookingId: review.bookingId,
    serviceId: review.serviceId,
    providerId: review.providerId,
    customerId: review.customerId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    service: review.service,
    customer: review.customer,
  };
};

const decodeCursor = (cursor: string | undefined): ReviewListCursor | undefined => {
  if (!cursor) {
    return undefined;
  }

  let decoded: unknown;

  try {
    decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as unknown;
  } catch {
    throw new ValidationError([
      {
        field: "cursor",
        message: "Invalid cursor",
      },
    ]);
  }

  const parsed = cursorSchema.safeParse(decoded);

  if (!parsed.success) {
    throw new ValidationError([
      {
        field: "cursor",
        message: "Invalid cursor",
      },
    ]);
  }

  return {
    id: parsed.data.id,
    createdAt: new Date(parsed.data.createdAt),
  };
};

const encodeCursor = (review: { id: string; createdAt: Date }): string => {
  return Buffer.from(
    JSON.stringify({
      id: review.id,
      createdAt: review.createdAt.toISOString(),
    }),
  ).toString("base64url");
};

const paginateReviews = <T extends { id: string; createdAt: Date }>(
  records: T[],
  limit: number,
) => {
  const hasNextPage = records.length > limit;
  const data = hasNextPage ? records.slice(0, limit) : records;
  const nextCursor = hasNextPage
    ? encodeCursor(data[data.length - 1] as { id: string; createdAt: Date })
    : null;

  return {
    data,
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const createReviewForBooking = async (
  customerUserId: string,
  bookingId: string,
  input: CreateBookingReviewInput,
) => {
  const booking = await findBookingForReviewById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.customerId !== customerUserId) {
    throw new ForbiddenError("You can only review your own bookings");
  }

  if (booking.status !== COMPLETED_BOOKING_STATUS) {
    throw new AppError("Only completed bookings can be reviewed", 409);
  }

  if (booking.review) {
    throw new AppError("This booking has already been reviewed", 409);
  }

  const review = await createReviewAndRefreshProviderAggregate({
    bookingId: booking.id,
    serviceId: booking.serviceId,
    providerId: booking.providerId,
    customerId: customerUserId,
    rating: input.rating,
  });

  return toReviewResponse(review);
};

export const listCustomerReviews = async (
  customerUserId: string,
  query: ListCustomerReviewsQuery,
) => {
  const cursor = decodeCursor(query.cursor);
  const records = await listReviewsByCustomerId(customerUserId, {
    cursor,
    take: query.limit + 1,
  });

  const paginated = paginateReviews(records, query.limit);

  return {
    data: paginated.data.map((review) => toReviewResponse(review)),
    meta: paginated.meta,
  };
};

export const listServiceReviews = async (
  serviceId: string,
  query: ListServiceReviewsQuery,
) => {
  const serviceExists = await hasServiceById(serviceId);

  if (!serviceExists) {
    throw new AppError("Service not found", 404);
  }

  const cursor = decodeCursor(query.cursor);
  const records = await listReviewsByServiceId(serviceId, {
    cursor,
    take: query.limit + 1,
  });

  const paginated = paginateReviews(records, query.limit);

  return {
    data: paginated.data.map((review) => toReviewResponse(review)),
    meta: paginated.meta,
  };
};

export const listProviderReviews = async (
  providerUserId: string,
  query: ListProviderReviewsQuery,
) => {
  const cursor = decodeCursor(query.cursor);
  const records = await listReviewsByProviderId(providerUserId, {
    cursor,
    take: query.limit + 1,
  });

  const paginated = paginateReviews(records, query.limit);

  return {
    data: paginated.data.map((review) => toReviewResponse(review)),
    meta: paginated.meta,
  };
};

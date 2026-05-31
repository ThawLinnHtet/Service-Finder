import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import {
  createReviewForBooking,
  listCustomerReviews,
  listProviderReviews,
  listServiceReviews,
} from "./service";
import type {
  CreateBookingReviewInput,
  ListCustomerReviewsQuery,
  ListProviderReviewsQuery,
  ListServiceReviewsQuery,
} from "./validation";

const getAuthUserId = (req: Request): string => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return userId;
};

export const createBookingReviewController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customerUserId = getAuthUserId(req);
  const { bookingId } = req.params as { bookingId: string };
  const review = await createReviewForBooking(
    customerUserId,
    bookingId,
    req.body as CreateBookingReviewInput,
  );

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: review,
  });
};

export const listServiceReviewsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { serviceId } = req.params as { serviceId: string };
  const query = req.validated?.query as ListServiceReviewsQuery;
  const result = await listServiceReviews(serviceId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const listProviderReviewsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const providerUserId = getAuthUserId(req);
  const query = req.validated?.query as ListProviderReviewsQuery;
  const result = await listProviderReviews(providerUserId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const listCustomerReviewsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customerUserId = getAuthUserId(req);
  const query = req.validated?.query as ListCustomerReviewsQuery;
  const result = await listCustomerReviews(customerUserId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

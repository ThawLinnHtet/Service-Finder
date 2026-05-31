import type { Request, Response } from "express";
import { UnauthorizedError } from "../../common/errors/app-error";
import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  createBooking,
  getBookingById,
  listBookings,
  rejectBooking,
  rescheduleBooking,
} from "./service";
import type {
  CreateBookingInput,
  ListBookingsQuery,
  RescheduleBookingInput,
} from "./validation";

const getAuthContext = (req: Request): { userId: string; role: string } => {
  const auth = req.auth;

  if (!auth?.userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return {
    userId: auth.userId,
    role: auth.role,
  };
};

export const createBookingController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuthContext(req);
  const booking = await createBooking(userId, req.body as CreateBookingInput);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

export const listBookingsController = async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = getAuthContext(req);
  const query = req.validated?.query as ListBookingsQuery;
  const result = await listBookings(userId, role, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const getBookingController = async (req: Request, res: Response): Promise<void> => {
  const { userId, role } = getAuthContext(req);
  const { bookingId } = req.params as { bookingId: string };
  const booking = await getBookingById(userId, role, bookingId);

  res.status(200).json({
    success: true,
    data: booking,
  });
};

export const acceptBookingController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuthContext(req);
  const { bookingId } = req.params as { bookingId: string };
  const booking = await acceptBooking(userId, bookingId);

  res.status(200).json({
    success: true,
    message: "Booking accepted successfully",
    data: booking,
  });
};

export const rejectBookingController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuthContext(req);
  const { bookingId } = req.params as { bookingId: string };
  const booking = await rejectBooking(userId, bookingId);

  res.status(200).json({
    success: true,
    message: "Booking rejected successfully",
    data: booking,
  });
};

export const cancelBookingController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuthContext(req);
  const { bookingId } = req.params as { bookingId: string };
  const booking = await cancelBooking(userId, bookingId);

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
};

export const completeBookingController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = getAuthContext(req);
  const { bookingId } = req.params as { bookingId: string };
  const booking = await completeBooking(userId, bookingId);

  res.status(200).json({
    success: true,
    message: "Booking completed successfully",
    data: booking,
  });
};

export const rescheduleBookingController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = getAuthContext(req);
  const { bookingId } = req.params as { bookingId: string };
  const booking = await rescheduleBooking(
    userId,
    bookingId,
    req.body as RescheduleBookingInput,
  );

  res.status(200).json({
    success: true,
    message: "Booking rescheduled successfully",
    data: booking,
  });
};

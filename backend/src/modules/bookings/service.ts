import { z } from "zod";
import {
  AppError,
  BadRequestError,
  ForbiddenError,
  ValidationError,
} from "../../common/errors/app-error";
import {
  createBookingRecord,
  ensureChatRoomForBooking,
  findBookingByIdForActor,
  findServiceForBookingById,
  listBookingsForActor,
  updateBookingStatusById,
  type BookingListCursor,
} from "./repository";
import type { CreateBookingInput, ListBookingsQuery } from "./validation";

type BookingRecord = NonNullable<Awaited<ReturnType<typeof findBookingByIdForActor>>>;

const listCursorSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .strict();

const toBookingResponse = (booking: BookingRecord) => {
  return {
    id: booking.id,
    serviceId: booking.serviceId,
    customerId: booking.customerId,
    providerId: booking.providerId,
    status: booking.status,
    note: booking.note,
    scheduledAt: booking.scheduledAt,
    completedAt: booking.completedAt,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    service: {
      id: booking.service.id,
      title: booking.service.title,
      price: booking.service.price.toString(),
      isAvailable: booking.service.isAvailable,
      category: booking.service.category,
    },
    customer: booking.customer,
    provider: booking.provider,
  };
};

const decodeListCursor = (cursor: string | undefined): BookingListCursor | undefined => {
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

  const parsed = listCursorSchema.safeParse(decoded);

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

const encodeListCursor = (booking: { id: string; createdAt: Date }): string => {
  return Buffer.from(
    JSON.stringify({
      id: booking.id,
      createdAt: booking.createdAt.toISOString(),
    }),
  ).toString("base64url");
};

const parseOptionalScheduledAt = (scheduledAt: string | undefined): Date | undefined => {
  if (!scheduledAt) {
    return undefined;
  }

  const parsedDate = new Date(scheduledAt);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new ValidationError([
      {
        field: "scheduledAt",
        message: "Scheduled date must be a valid ISO datetime",
      },
    ]);
  }

  return parsedDate;
};

const assertBookingLifecycleStatus = (
  currentStatus: string,
  allowedStatuses: string[],
  message: string,
): void => {
  if (!allowedStatuses.includes(currentStatus)) {
    throw new AppError(message, 409);
  }
};

const getBookingForActorOrThrow = async (bookingId: string, userId: string) => {
  const booking = await findBookingByIdForActor(bookingId, userId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
};

const assertActorRoleForBookings = (role: string): "CUSTOMER" | "PROVIDER" => {
  if (role === "CUSTOMER" || role === "PROVIDER") {
    return role;
  }

  throw new ForbiddenError("Only customers and providers can access bookings");
};

export const createBooking = async (customerUserId: string, input: CreateBookingInput) => {
  const service = await findServiceForBookingById(input.serviceId);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  if (service.providerId === customerUserId) {
    throw new BadRequestError("You cannot book your own service");
  }

  const providerStatus = service.provider.providerProfile?.status;
  const canBeBooked =
    service.isActive &&
    service.isVisible &&
    service.isAvailable &&
    providerStatus === "APPROVED";

  if (!canBeBooked) {
    throw new BadRequestError("Service is not available for booking");
  }

  const scheduledAt = parseOptionalScheduledAt(input.scheduledAt);

  if (scheduledAt && scheduledAt.getTime() <= Date.now()) {
    throw new ValidationError([
      {
        field: "scheduledAt",
        message: "Scheduled date must be in the future",
      },
    ]);
  }

  const booking = await createBookingRecord({
    serviceId: service.id,
    customerId: customerUserId,
    providerId: service.providerId,
    note: input.note,
    scheduledAt,
  });

  return toBookingResponse(booking);
};

export const listBookings = async (
  actorUserId: string,
  actorRole: string,
  query: ListBookingsQuery,
) => {
  const normalizedRole = assertActorRoleForBookings(actorRole);
  const cursor = decodeListCursor(query.cursor);
  const records = await listBookingsForActor({
    userId: actorUserId,
    role: normalizedRole,
    status: query.status,
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const data = hasNextPage ? records.slice(0, query.limit) : records;
  const nextCursor = hasNextPage ? encodeListCursor(data[data.length - 1] as BookingRecord) : null;

  return {
    data: data.map((booking) => toBookingResponse(booking)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const getBookingById = async (actorUserId: string, actorRole: string, bookingId: string) => {
  assertActorRoleForBookings(actorRole);
  const booking = await getBookingForActorOrThrow(bookingId, actorUserId);
  return toBookingResponse(booking);
};

export const acceptBooking = async (providerUserId: string, bookingId: string) => {
  const booking = await getBookingForActorOrThrow(bookingId, providerUserId);

  if (booking.providerId !== providerUserId) {
    throw new ForbiddenError("You can only accept bookings for your own services");
  }

  assertBookingLifecycleStatus(
    booking.status,
    ["PENDING"],
    "Only pending bookings can be accepted",
  );

  const updated = await updateBookingStatusById(bookingId, "ACCEPTED", null);
  await ensureChatRoomForBooking(bookingId);
  return toBookingResponse(updated);
};

export const rejectBooking = async (providerUserId: string, bookingId: string) => {
  const booking = await getBookingForActorOrThrow(bookingId, providerUserId);

  if (booking.providerId !== providerUserId) {
    throw new ForbiddenError("You can only reject bookings for your own services");
  }

  assertBookingLifecycleStatus(
    booking.status,
    ["PENDING"],
    "Only pending bookings can be rejected",
  );

  const updated = await updateBookingStatusById(bookingId, "REJECTED", null);
  return toBookingResponse(updated);
};

export const cancelBooking = async (customerUserId: string, bookingId: string) => {
  const booking = await getBookingForActorOrThrow(bookingId, customerUserId);

  if (booking.customerId !== customerUserId) {
    throw new ForbiddenError("You can only cancel your own bookings");
  }

  assertBookingLifecycleStatus(
    booking.status,
    ["PENDING"],
    "Only pending bookings can be cancelled",
  );

  const updated = await updateBookingStatusById(bookingId, "CANCELLED", null);
  return toBookingResponse(updated);
};

export const completeBooking = async (providerUserId: string, bookingId: string) => {
  const booking = await getBookingForActorOrThrow(bookingId, providerUserId);

  if (booking.providerId !== providerUserId) {
    throw new ForbiddenError("You can only complete bookings for your own services");
  }

  assertBookingLifecycleStatus(
    booking.status,
    ["ACCEPTED"],
    "Only accepted bookings can be completed",
  );

  const updated = await updateBookingStatusById(bookingId, "COMPLETED", new Date());
  return toBookingResponse(updated);
};

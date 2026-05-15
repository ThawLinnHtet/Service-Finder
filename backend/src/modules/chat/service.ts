import { z } from "zod";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "../../common/errors/app-error";
import {
  createChatMessage,
  findBookingForChatById,
  listChatMessagesByRoomId,
  upsertChatRoomByBookingId,
  type BookingForChat,
  type ChatMessageCursor,
  type ChatMessageRecord,
} from "./repository";
import type { ListChatMessagesQuery, SocketChatMessageInput } from "./validation";

const listCursorSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .strict();

const ACCEPTED_ONLY_STATUSES = ["ACCEPTED"] as const;
const READABLE_STATUSES = ["ACCEPTED", "COMPLETED"] as const;

type ChatActorRole = "CUSTOMER" | "PROVIDER";

type ChatActor = {
  userId: string;
  role: ChatActorRole;
};

const toMessageResponse = (message: ChatMessageRecord) => {
  return {
    id: message.id,
    roomId: message.roomId,
    content: message.content,
    createdAt: message.createdAt,
    sender: message.sender,
  };
};

export const getChatRoomChannel = (bookingId: string): string => `booking:${bookingId}`;

const parseChatActorRole = (role: string): ChatActorRole => {
  if (role === "CUSTOMER" || role === "PROVIDER") {
    return role;
  }

  throw new ForbiddenError("Only customers and providers can access chat");
};

export const resolveChatActorFromAuth = (
  auth: { userId: string; role: string } | undefined,
): ChatActor => {
  if (!auth?.userId) {
    throw new UnauthorizedError("Authentication required");
  }

  return {
    userId: auth.userId,
    role: parseChatActorRole(auth.role),
  };
};

const assertBookingParticipant = (booking: BookingForChat, actor: ChatActor): void => {
  const isParticipant = booking.customerId === actor.userId || booking.providerId === actor.userId;

  if (!isParticipant) {
    throw new ForbiddenError("You can only access chat for your own bookings");
  }
};

const assertReadableBookingStatus = (status: string): void => {
  if (!READABLE_STATUSES.includes(status as (typeof READABLE_STATUSES)[number])) {
    throw new AppError("Chat is available only for accepted or completed bookings", 409);
  }
};

const assertSendableBookingStatus = (status: string): void => {
  if (!ACCEPTED_ONLY_STATUSES.includes(status as (typeof ACCEPTED_ONLY_STATUSES)[number])) {
    throw new AppError("Messages can be sent only for accepted bookings", 409);
  }
};

const decodeListCursor = (cursor: string | undefined): ChatMessageCursor | undefined => {
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

const encodeListCursor = (message: { id: string; createdAt: Date }): string => {
  return Buffer.from(
    JSON.stringify({
      id: message.id,
      createdAt: message.createdAt.toISOString(),
    }),
  ).toString("base64url");
};

const findBookingForChatOrThrow = async (bookingId: string): Promise<BookingForChat> => {
  const booking = await findBookingForChatById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
};

const getOrCreateRoomForBooking = async (booking: BookingForChat) => {
  if (booking.chatRoom) {
    return booking.chatRoom;
  }

  return upsertChatRoomByBookingId(booking.id);
};

export const getChatRoomByBooking = async (actor: ChatActor, bookingId: string) => {
  const booking = await findBookingForChatOrThrow(bookingId);
  assertBookingParticipant(booking, actor);
  assertReadableBookingStatus(booking.status);

  const room = await getOrCreateRoomForBooking(booking);

  return {
    id: room.id,
    bookingId: room.bookingId,
    bookingStatus: booking.status,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
};

export const listChatMessages = async (
  actor: ChatActor,
  bookingId: string,
  query: ListChatMessagesQuery,
) => {
  const booking = await findBookingForChatOrThrow(bookingId);
  assertBookingParticipant(booking, actor);
  assertReadableBookingStatus(booking.status);

  const room = await getOrCreateRoomForBooking(booking);
  const cursor = decodeListCursor(query.cursor);
  const records = await listChatMessagesByRoomId({
    roomId: room.id,
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const data = hasNextPage ? records.slice(0, query.limit) : records;
  const nextCursor = hasNextPage ? encodeListCursor(data[data.length - 1] as ChatMessageRecord) : null;

  return {
    data: data.map((message) => toMessageResponse(message)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const sendChatMessage = async (
  actor: ChatActor,
  bookingId: string,
  content: string,
) => {
  const booking = await findBookingForChatOrThrow(bookingId);
  assertBookingParticipant(booking, actor);
  assertSendableBookingStatus(booking.status);
  const room = await getOrCreateRoomForBooking(booking);

  const message = await createChatMessage({
    roomId: room.id,
    senderId: actor.userId,
    content,
  });

  return {
    bookingId,
    roomId: room.id,
    message: toMessageResponse(message),
  };
};

export const sendChatMessageFromSocket = async (
  actor: ChatActor,
  input: SocketChatMessageInput,
) => {
  return sendChatMessage(actor, input.bookingId, input.content);
};

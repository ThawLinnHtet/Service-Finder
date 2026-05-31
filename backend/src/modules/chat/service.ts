import { z } from "zod";
import {
  AppError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "../../common/errors/app-error";
import {
  countUnreadMessagesByRoomIdsForActor,
  createChatMessage,
  findBookingForChatById,
  listChatRoomsByActor,
  listChatMessagesByRoomId,
  markChatRoomAsReadByUser,
  upsertChatRoomByBookingId,
  type BookingForChat,
  type ChatMessageCursor,
  type ChatMessageRecord,
  type ChatRoomCursor,
  type ChatRoomListRecord,
} from "./repository";
import type {
  ListChatMessagesQuery,
  ListChatRoomsQuery,
  SocketChatMessageInput,
} from "./validation";

const listCursorSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .strict();

const roomListCursorSchema = z
  .object({
    id: z.string().uuid(),
    updatedAt: z.string().datetime(),
  })
  .strict();

const SENDABLE_STATUSES = ["PENDING", "ACCEPTED"] as const;
const READABLE_STATUSES = ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"] as const;

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

const toChatRoomSummary = (
  actor: ChatActor,
  room: ChatRoomListRecord,
  unreadCount: number,
) => {
  const otherUser = actor.role === "CUSTOMER" ? room.booking.provider : room.booking.customer;
  const lastMessage = room.messages[0] ?? null;

  return {
    id: room.id,
    bookingId: room.bookingId,
    bookingStatus: room.booking.status,
    scheduledAt: room.booking.scheduledAt,
    service: {
      id: room.booking.service.id,
      title: room.booking.service.title,
      price: room.booking.service.price.toString(),
      category: room.booking.service.category,
    },
    otherUser,
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          sender: lastMessage.sender,
        }
      : null,
    unreadCount,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
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
    throw new AppError("Chat is not available for this booking", 409);
  }
};

const assertSendableBookingStatus = (status: string): void => {
  if (!SENDABLE_STATUSES.includes(status as (typeof SENDABLE_STATUSES)[number])) {
    throw new AppError("Messages can be sent only for pending or accepted bookings", 409);
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

const decodeRoomListCursor = (cursor: string | undefined): ChatRoomCursor | undefined => {
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

  const parsed = roomListCursorSchema.safeParse(decoded);

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
    updatedAt: new Date(parsed.data.updatedAt),
  };
};

const encodeRoomListCursor = (room: { id: string; updatedAt: Date }): string => {
  return Buffer.from(
    JSON.stringify({
      id: room.id,
      updatedAt: room.updatedAt.toISOString(),
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

export const listChatRooms = async (actor: ChatActor, query: ListChatRoomsQuery) => {
  const cursor = decodeRoomListCursor(query.cursor);
  const records = await listChatRoomsByActor({
    userId: actor.userId,
    role: actor.role,
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const data = hasNextPage ? records.slice(0, query.limit) : records;
  const unreadCounts = await countUnreadMessagesByRoomIdsForActor(
    data.map((room) => room.id),
    actor.userId,
  );
  const nextCursor = hasNextPage ? encodeRoomListCursor(data[data.length - 1] as ChatRoomListRecord) : null;

  return {
    data: data.map((room) => toChatRoomSummary(actor, room, unreadCounts.get(room.id) ?? 0)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const markChatRoomAsRead = async (actor: ChatActor, bookingId: string) => {
  const booking = await findBookingForChatOrThrow(bookingId);
  assertBookingParticipant(booking, actor);
  assertReadableBookingStatus(booking.status);

  const room = await getOrCreateRoomForBooking(booking);
  const readState = await markChatRoomAsReadByUser({
    roomId: room.id,
    userId: actor.userId,
  });

  return {
    bookingId,
    roomId: room.id,
    lastReadAt: readState.lastReadAt,
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

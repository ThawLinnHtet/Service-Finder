import { prisma } from "../../database/prisma";

type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type ChatMessageCursor = {
  id: string;
  createdAt: Date;
};

type ListChatMessagesOptions = {
  roomId: string;
  cursor?: ChatMessageCursor;
  take: number;
};

const messageSelect = {
  id: true,
  roomId: true,
  content: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      username: true,
      role: true,
    },
  },
} as const;

export const findBookingForChatById = (bookingId: string) => {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      providerId: true,
      status: true,
      chatRoom: {
        select: {
          id: true,
          bookingId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

export const upsertChatRoomByBookingId = (bookingId: string) => {
  return prisma.chatRoom.upsert({
    where: { bookingId },
    update: {},
    create: { bookingId },
    select: {
      id: true,
      bookingId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const listChatMessagesByRoomId = ({ roomId, cursor, take }: ListChatMessagesOptions) => {
  const cursorWhere = cursor
    ? {
        OR: [
          {
            createdAt: {
              lt: cursor.createdAt,
            },
          },
          {
            createdAt: cursor.createdAt,
            id: {
              gt: cursor.id,
            },
          },
        ],
      }
    : undefined;

  return prisma.message.findMany({
    where: {
      roomId,
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take,
    select: messageSelect,
  });
};

export const createChatMessage = (input: {
  roomId: string;
  senderId: string;
  content: string;
}) => {
  return prisma.message.create({
    data: {
      roomId: input.roomId,
      senderId: input.senderId,
      content: input.content,
    },
    select: messageSelect,
  });
};

export type BookingForChat = NonNullable<Awaited<ReturnType<typeof findBookingForChatById>>>;
export type ChatRoomRecord = Awaited<ReturnType<typeof upsertChatRoomByBookingId>>;
export type ChatMessageRecord = Awaited<ReturnType<typeof createChatMessage>>;
export type ChatMessageStatus = BookingStatus;

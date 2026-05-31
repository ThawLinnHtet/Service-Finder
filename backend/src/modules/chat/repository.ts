import { prisma } from "../../database/prisma";
import { Prisma } from "../../generated/prisma/client";

type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
type ChatActorRole = "CUSTOMER" | "PROVIDER";

export type ChatMessageCursor = {
  id: string;
  createdAt: Date;
};

export type ChatRoomCursor = {
  id: string;
  updatedAt: Date;
};

type ListChatMessagesOptions = {
  roomId: string;
  cursor?: ChatMessageCursor;
  take: number;
};

type ListChatRoomsOptions = {
  userId: string;
  role: ChatActorRole;
  cursor?: ChatRoomCursor;
  take: number;
};

type MarkChatRoomReadOptions = {
  roomId: string;
  userId: string;
  readAt?: Date;
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

const buildChatRoomListSelect = (userId: string) => {
  return {
    id: true,
    bookingId: true,
    createdAt: true,
    updatedAt: true,
    booking: {
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        service: {
          select: {
            id: true,
            title: true,
            price: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            username: true,
          },
        },
        provider: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
    messages: {
      orderBy: { createdAt: "desc" },
      take: 1,
      select: messageSelect,
    },
    readStates: {
      where: {
        userId,
      },
      take: 1,
      select: {
        userId: true,
        lastReadAt: true,
      },
    },
  } as const;
};

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

export const listChatRoomsByActor = ({ userId, role, cursor, take }: ListChatRoomsOptions) => {
  const cursorWhere = cursor
    ? {
        OR: [
          {
            updatedAt: {
              lt: cursor.updatedAt,
            },
          },
          {
            updatedAt: cursor.updatedAt,
            id: {
              gt: cursor.id,
            },
          },
        ],
      }
    : undefined;

  return prisma.chatRoom.findMany({
    where: {
      booking: {
        status: {
          in: ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"],
        },
        ...(role === "CUSTOMER" ? { customerId: userId } : { providerId: userId }),
      },
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take,
    select: buildChatRoomListSelect(userId),
  });
};

export const countUnreadMessagesByRoomIdsForActor = async (
  roomIds: string[],
  userId: string,
) => {
  if (roomIds.length === 0) {
    return new Map<string, number>();
  }

  const rows = await prisma.$queryRaw<Array<{ roomId: string; unreadCount: bigint }>>(
    Prisma.sql`
      SELECT
        m."roomId" AS "roomId",
        COUNT(*)::bigint AS "unreadCount"
      FROM "Message" m
      LEFT JOIN "ChatRoomReadState" rs
        ON rs."roomId" = m."roomId"
       AND rs."userId" = ${userId}
      WHERE
        m."roomId" IN (${Prisma.join(roomIds)})
        AND m."senderId" <> ${userId}
        AND (
          rs."lastReadAt" IS NULL
          OR m."createdAt" > rs."lastReadAt"
        )
      GROUP BY m."roomId"
    `,
  );

  const result = new Map<string, number>();

  for (const row of rows) {
    result.set(row.roomId, Number(row.unreadCount));
  }

  return result;
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
  return prisma.$transaction(async (tx) => {
    const message = await tx.message.create({
      data: {
        roomId: input.roomId,
        senderId: input.senderId,
        content: input.content,
      },
      select: messageSelect,
    });

    await tx.chatRoom.update({
      where: { id: input.roomId },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  });
};

export const markChatRoomAsReadByUser = ({ roomId, userId, readAt }: MarkChatRoomReadOptions) => {
  return prisma.chatRoomReadState.upsert({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },
    update: {
      lastReadAt: readAt ?? new Date(),
    },
    create: {
      roomId,
      userId,
      lastReadAt: readAt ?? new Date(),
    },
    select: {
      roomId: true,
      userId: true,
      lastReadAt: true,
    },
  });
};

export type BookingForChat = NonNullable<Awaited<ReturnType<typeof findBookingForChatById>>>;
export type ChatRoomRecord = Awaited<ReturnType<typeof upsertChatRoomByBookingId>>;
export type ChatRoomListRecord = Awaited<ReturnType<typeof listChatRoomsByActor>>[number];
export type ChatMessageRecord = Awaited<ReturnType<typeof createChatMessage>>;
export type ChatMessageStatus = BookingStatus;

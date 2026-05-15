import { prisma } from "../../database/prisma";

type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type BookingListCursor = {
  id: string;
  createdAt: Date;
};

type ListBookingsOptions = {
  userId: string;
  role: "CUSTOMER" | "PROVIDER";
  status?: BookingStatus;
  cursor?: BookingListCursor;
  take: number;
};

export const findServiceForBookingById = (serviceId: string) => {
  return prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      providerId: true,
      isActive: true,
      isVisible: true,
      isAvailable: true,
      provider: {
        select: {
          providerProfile: {
            select: {
              status: true,
            },
          },
        },
      },
    },
  });
};

const bookingSelect = {
  id: true,
  serviceId: true,
  customerId: true,
  providerId: true,
  status: true,
  note: true,
  scheduledAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: {
      id: true,
      title: true,
      price: true,
      isAvailable: true,
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
      city: true,
      township: true,
    },
  },
  provider: {
    select: {
      id: true,
      username: true,
      city: true,
      township: true,
    },
  },
} as const;

export const createBookingRecord = (input: {
  serviceId: string;
  customerId: string;
  providerId: string;
  note?: string;
  scheduledAt?: Date;
}) => {
  return prisma.booking.create({
    data: {
      serviceId: input.serviceId,
      customerId: input.customerId,
      providerId: input.providerId,
      status: "PENDING",
      note: input.note,
      scheduledAt: input.scheduledAt,
    },
    select: bookingSelect,
  });
};

export const findBookingByIdForActor = (bookingId: string, userId: string) => {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
      OR: [{ customerId: userId }, { providerId: userId }],
    },
    select: bookingSelect,
  });
};

export const listBookingsForActor = ({
  userId,
  role,
  status,
  cursor,
  take,
}: ListBookingsOptions) => {
  const roleWhere = role === "CUSTOMER" ? { customerId: userId } : { providerId: userId };

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

  return prisma.booking.findMany({
    where: {
      ...roleWhere,
      ...(status ? { status } : {}),
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take,
    select: bookingSelect,
  });
};

export const updateBookingStatusById = (
  bookingId: string,
  status: BookingStatus,
  completedAt?: Date | null,
) => {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      completedAt,
    },
    select: bookingSelect,
  });
};

export const ensureChatRoomForBooking = (bookingId: string) => {
  return prisma.chatRoom.upsert({
    where: { bookingId },
    update: {},
    create: { bookingId },
    select: {
      id: true,
      bookingId: true,
    },
  });
};

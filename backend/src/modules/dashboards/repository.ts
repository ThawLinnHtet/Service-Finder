import { prisma } from "../../database/prisma";

type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type DashboardCursor = {
  id: string;
  createdAt: Date;
};

export type UpcomingBookingsCursor = {
  id: string;
  scheduledAt: Date;
};

type ListCustomerBookingsOptions = {
  customerId: string;
  statuses?: BookingStatus[];
  cursor?: DashboardCursor;
  take: number;
};

type ListCustomerUpcomingBookingsOptions = {
  customerId: string;
  statuses: BookingStatus[];
  cursor?: UpcomingBookingsCursor;
  take: number;
};

type ListProviderBookingsOptions = {
  providerId: string;
  statuses?: BookingStatus[];
  pinnedOnly?: boolean;
  cursor?: DashboardCursor;
  take: number;
};

type ListProviderClientStatusCountsOptions = {
  providerId: string;
  customerIds: string[];
};

type ListSavedServicesOptions = {
  customerId: string;
  cursor?: DashboardCursor;
  take: number;
};

const serviceSummarySelect = {
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
} as const;

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
    select: serviceSummarySelect,
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

const providerPinnedBookingSelect = {
  ...bookingSelect,
  customer: {
    select: {
      id: true,
      username: true,
      city: true,
      township: true,
      pinnedByProviders: {
        select: {
          id: true,
        },
      },
    },
  },
} as const;

const savedServiceSelect = {
  id: true,
  createdAt: true,
  service: {
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      isActive: true,
      isVisible: true,
      isAvailable: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provider: {
        select: {
          id: true,
          username: true,
          city: true,
          township: true,
          providerProfile: {
            select: {
              status: true,
              ratingAverage: true,
              ratingCount: true,
            },
          },
        },
      },
    },
  },
} as const;

const toCursorWhere = (cursor: DashboardCursor | undefined) => {
  if (!cursor) {
    return undefined;
  }

  return {
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
  };
};

export const getCustomerDashboardCounts = async (customerId: string) => {
  const now = new Date();

  const [allBookings, completedBookings, cancelledBookings, upcomingBookings, savedServices] =
    await prisma.$transaction([
      prisma.booking.count({
        where: { customerId },
      }),
      prisma.booking.count({
        where: { customerId, status: "COMPLETED" },
      }),
      prisma.booking.count({
        where: { customerId, status: "CANCELLED" },
      }),
      prisma.booking.count({
        where: {
          customerId,
          status: { in: ["PENDING", "ACCEPTED"] },
          scheduledAt: {
            gte: now,
          },
        },
      }),
      prisma.customerSavedService.count({
        where: { customerId },
      }),
    ]);

  return {
    allBookings,
    completedBookings,
    cancelledBookings,
    upcomingBookings,
    savedServices,
  };
};

export const findCustomerDashboardProfile = (customerId: string) => {
  return prisma.user.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
      username: true,
    },
  });
};

export const findCustomerUpcomingBookings = (customerId: string, take: number) => {
  const now = new Date();

  return prisma.booking.findMany({
    where: {
      customerId,
      status: { in: ["PENDING", "ACCEPTED"] },
      scheduledAt: {
        gte: now,
      },
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }, { id: "asc" }],
    take,
    select: bookingSelect,
  });
};

export const listCustomerBookings = ({
  customerId,
  statuses,
  cursor,
  take,
}: ListCustomerBookingsOptions) => {
  const cursorWhere = toCursorWhere(cursor);

  return prisma.booking.findMany({
    where: {
      customerId,
      ...(statuses ? { status: { in: statuses } } : {}),
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take,
    select: bookingSelect,
  });
};

export const listCustomerUpcomingBookings = ({
  customerId,
  statuses,
  cursor,
  take,
}: ListCustomerUpcomingBookingsOptions) => {
  const now = new Date();

  const cursorWhere = cursor
    ? {
        OR: [
          {
            scheduledAt: {
              gt: cursor.scheduledAt,
            },
          },
          {
            scheduledAt: cursor.scheduledAt,
            id: {
              gt: cursor.id,
            },
          },
        ],
      }
    : undefined;

  return prisma.booking.findMany({
    where: {
      customerId,
      status: {
        in: statuses,
      },
      scheduledAt: {
        gte: now,
      },
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ scheduledAt: "asc" }, { id: "asc" }],
    take,
    select: bookingSelect,
  });
};

export const listCustomerSavedServices = ({
  customerId,
  cursor,
  take,
}: ListSavedServicesOptions) => {
  const cursorWhere = toCursorWhere(cursor);

  return prisma.customerSavedService.findMany({
    where: {
      customerId,
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take,
    select: savedServiceSelect,
  });
};

export const findServiceForSaveById = (serviceId: string) => {
  return prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      isActive: true,
      isVisible: true,
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

export const saveServiceForCustomer = (customerId: string, serviceId: string) => {
  return prisma.customerSavedService.upsert({
    where: {
      customerId_serviceId: {
        customerId,
        serviceId,
      },
    },
    update: {},
    create: {
      customerId,
      serviceId,
    },
    select: {
      id: true,
      customerId: true,
      serviceId: true,
      createdAt: true,
    },
  });
};

export const unsaveServiceForCustomer = (customerId: string, serviceId: string) => {
  return prisma.customerSavedService.deleteMany({
    where: {
      customerId,
      serviceId,
    },
  });
};

export const getProviderDashboardCounts = async (providerId: string) => {
  const [
    totalJobs,
    requestedBookings,
    ongoingBookings,
    completedBookings,
    cancelledBookings,
    pinnedCustomers,
    providerUser,
    providerProfile,
  ] =
    await prisma.$transaction([
      prisma.booking.count({
        where: {
          providerId,
        },
      }),
      prisma.booking.count({
        where: {
          providerId,
          status: "PENDING",
          providerArchivedEntries: {
            none: {
              providerId,
            },
          },
        },
      }),
      prisma.booking.count({
        where: {
          providerId,
          status: "ACCEPTED",
          providerArchivedEntries: {
            none: {
              providerId,
            },
          },
        },
      }),
      prisma.booking.count({
        where: {
          providerId,
          status: "COMPLETED",
          providerArchivedEntries: {
            none: {
              providerId,
            },
          },
        },
      }),
      prisma.booking.count({
        where: {
          providerId,
          status: "CANCELLED",
          providerArchivedEntries: {
            none: {
              providerId,
            },
          },
        },
      }),
      prisma.providerPinnedCustomer.count({
        where: {
          providerId,
        },
      }),
      prisma.user.findUnique({
        where: {
          id: providerId,
        },
        select: {
          id: true,
          username: true,
        },
      }),
      prisma.providerProfile.findUnique({
        where: {
          userId: providerId,
        },
        select: {
          ratingAverage: true,
          ratingCount: true,
        },
      }),
    ]);

  return {
    totalJobs,
    requestedBookings,
    ongoingBookings,
    completedBookings,
    cancelledBookings,
    pinnedCustomers,
    providerUser,
    ratingAverage: providerProfile?.ratingAverage ?? null,
    reviewsBy: providerProfile?.ratingCount ?? 0,
  };
};

export const listProviderBookingsChunk = ({
  providerId,
  statuses,
  pinnedOnly,
  cursor,
  take,
}: ListProviderBookingsOptions) => {
  const cursorWhere = toCursorWhere(cursor);

  return prisma.booking.findMany({
    where: {
      providerId,
      ...(statuses ? { status: { in: statuses } } : {}),
      ...(pinnedOnly
        ? {
            customer: {
              pinnedByProviders: {
                some: {
                  providerId,
                },
              },
            },
          }
        : {}),
      providerArchivedEntries: {
        none: {
          providerId,
        },
      },
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take,
    select: providerPinnedBookingSelect,
  });
};

export const listProviderClientStatusCounts = async ({
  providerId,
  customerIds,
}: ListProviderClientStatusCountsOptions) => {
  if (customerIds.length === 0) {
    return [];
  }

  return prisma.booking.groupBy({
    by: ["customerId", "status"],
    where: {
      providerId,
      customerId: {
        in: customerIds,
      },
      providerArchivedEntries: {
        none: {
          providerId,
        },
      },
    },
    _count: {
      _all: true,
    },
  });
};

export const listProviderActiveJobs = ({
  providerId,
  cursor,
  take,
}: Omit<ListProviderBookingsOptions, "statuses">) => {
  const cursorWhere = toCursorWhere(cursor);
  const now = new Date();

  return prisma.booking.findMany({
    where: {
      providerId,
      status: "ACCEPTED",
      scheduledAt: {
        lte: now,
      },
      providerArchivedEntries: {
        none: {
          providerId,
        },
      },
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }, { id: "asc" }],
    take,
    select: providerPinnedBookingSelect,
  });
};

export const pinProviderCustomer = (providerId: string, customerId: string) => {
  return prisma.providerPinnedCustomer.upsert({
    where: {
      providerId_customerId: {
        providerId,
        customerId,
      },
    },
    update: {},
    create: {
      providerId,
      customerId,
    },
    select: {
      id: true,
      providerId: true,
      customerId: true,
      createdAt: true,
    },
  });
};

export const unpinProviderCustomer = (providerId: string, customerId: string) => {
  return prisma.providerPinnedCustomer.deleteMany({
    where: {
      providerId,
      customerId,
    },
  });
};

export const findProviderBookingIdsForHistoryArchive = (providerId: string) => {
  return prisma.booking.findMany({
    where: {
      providerId,
      status: {
        in: ["COMPLETED", "CANCELLED", "REJECTED"],
      },
      providerArchivedEntries: {
        none: {
          providerId,
        },
      },
    },
    select: {
      id: true,
    },
  });
};

export const archiveProviderBookings = async (providerId: string, bookingIds: string[]) => {
  if (bookingIds.length === 0) {
    return { count: 0 };
  }

  const result = await prisma.providerArchivedBooking.createMany({
    data: bookingIds.map((bookingId) => ({
      providerId,
      bookingId,
    })),
    skipDuplicates: true,
  });

  return result;
};

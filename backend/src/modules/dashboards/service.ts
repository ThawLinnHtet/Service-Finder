import { z } from "zod";
import { AppError, BadRequestError, ValidationError } from "../../common/errors/app-error";
import {
  archiveProviderBookings,
  findCustomerDashboardProfile,
  findProviderBookingIdsForHistoryArchive,
  findServiceForSaveById,
  getCustomerDashboardCounts,
  getProviderDashboardCounts,
  listCustomerBookings,
  listCustomerUpcomingBookings,
  listCustomerSavedServices,
  listProviderActiveJobs,
  listProviderBookingsChunk,
  listProviderClientStatusCounts,
  pinProviderCustomer,
  saveServiceForCustomer,
  unpinProviderCustomer,
  unsaveServiceForCustomer,
  type DashboardCursor,
  type UpcomingBookingsCursor,
} from "./repository";
import type {
  CustomerDashboardBookingsQuery,
  CustomerUpcomingBookingsQuery,
  DashboardPaginationQuery,
  ProviderDashboardClientsQuery,
} from "./validation";

type CustomerBookingRecord = Awaited<ReturnType<typeof listCustomerBookings>>[number];
type ProviderBookingRecord = Awaited<ReturnType<typeof listProviderBookingsChunk>>[number];
type ProviderActiveJobRecord = Awaited<ReturnType<typeof listProviderActiveJobs>>[number];
type SavedServiceRecord = Awaited<ReturnType<typeof listCustomerSavedServices>>[number];
type CustomerUpcomingBookingRecord = Awaited<
  ReturnType<typeof listCustomerUpcomingBookings>
>[number];

const cursorSchema = z
  .object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
  })
  .strict();

const upcomingCursorSchema = z
  .object({
    id: z.string().uuid(),
    scheduledAt: z.string().datetime(),
  })
  .strict();

const decodeCursor = (cursor: string | undefined): DashboardCursor | undefined => {
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

const encodeCursor = (record: { id: string; createdAt: Date }): string => {
  return Buffer.from(
    JSON.stringify({
      id: record.id,
      createdAt: record.createdAt.toISOString(),
    }),
  ).toString("base64url");
};

const decodeUpcomingCursor = (cursor: string | undefined): UpcomingBookingsCursor | undefined => {
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

  const parsed = upcomingCursorSchema.safeParse(decoded);

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
    scheduledAt: new Date(parsed.data.scheduledAt),
  };
};

const encodeUpcomingCursor = (record: { id: string; scheduledAt: Date | null }): string => {
  if (!record.scheduledAt) {
    throw new AppError("Unable to build pagination cursor for booking without scheduled time", 500);
  }

  return Buffer.from(
    JSON.stringify({
      id: record.id,
      scheduledAt: record.scheduledAt.toISOString(),
    }),
  ).toString("base64url");
};

const toBookingCard = (booking: CustomerBookingRecord) => {
  return {
    id: booking.id,
    serviceId: booking.serviceId,
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

const toProviderClientCard = (
  booking: ProviderBookingRecord,
  counts: {
    total: number;
    requested: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  },
) => {
  return {
    customer: {
      id: booking.customer.id,
      username: booking.customer.username,
      city: booking.customer.city,
      township: booking.customer.township,
      isPinned: booking.customer.pinnedByProviders.length > 0,
    },
    latestBooking: {
      id: booking.id,
      serviceId: booking.serviceId,
      status: booking.status,
      note: booking.note,
      scheduledAt: booking.scheduledAt,
      completedAt: booking.completedAt,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    },
    service: {
      id: booking.service.id,
      title: booking.service.title,
      price: booking.service.price.toString(),
      isAvailable: booking.service.isAvailable,
      category: booking.service.category,
    },
    stats: {
      totalBookings: counts.total,
      requestedBookings: counts.requested,
      ongoingBookings: counts.ongoing,
      completedBookings: counts.completed,
      cancelledBookings: counts.cancelled,
    },
  };
};

const toSavedServiceCard = (item: SavedServiceRecord) => {
  return {
    savedId: item.id,
    savedAt: item.createdAt,
    service: {
      id: item.service.id,
      title: item.service.title,
      description: item.service.description,
      price: item.service.price.toString(),
      isActive: item.service.isActive,
      isVisible: item.service.isVisible,
      isAvailable: item.service.isAvailable,
      category: item.service.category,
      provider: {
        id: item.service.provider.id,
        username: item.service.provider.username,
        city: item.service.provider.city,
        township: item.service.provider.township,
        providerStatus: item.service.provider.providerProfile?.status ?? null,
        ratingAverage:
          item.service.provider.providerProfile?.ratingAverage.toString() ?? "0",
        ratingCount: item.service.provider.providerProfile?.ratingCount ?? 0,
      },
    },
  };
};

const toActiveJobCard = (booking: ProviderActiveJobRecord) => {
  const elapsedMinutes = booking.scheduledAt
    ? Math.max(0, Math.floor((Date.now() - booking.scheduledAt.getTime()) / 60_000))
    : 0;

  return {
    id: booking.id,
    serviceId: booking.serviceId,
    status: booking.status,
    scheduledAt: booking.scheduledAt,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    elapsedMinutes,
    service: {
      id: booking.service.id,
      title: booking.service.title,
      price: booking.service.price.toString(),
      isAvailable: booking.service.isAvailable,
      category: booking.service.category,
    },
    customer: {
      id: booking.customer.id,
      username: booking.customer.username,
      city: booking.customer.city,
      township: booking.customer.township,
      isPinned: booking.customer.pinnedByProviders.length > 0,
    },
  };
};

const formatProviderRating = (
  ratingAverage: { toString(): string } | null,
): {
  average: string;
  display: string;
} => {
  const raw = ratingAverage ? Number(ratingAverage.toString()) : 0;
  const normalized = Number.isFinite(raw) ? Math.max(0, Math.min(raw, 5)) : 0;
  const rounded = Math.round(normalized * 10) / 10;
  const average = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);

  return {
    average,
    display: `${average}/5`,
  };
};

const sortPinnedFirst = <T extends { customer: { isPinned: boolean }; createdAt: Date; id: string }>(
  items: T[],
) => {
  return [...items].sort((a, b) => {
    if (a.customer.isPinned !== b.customer.isPinned) {
      return a.customer.isPinned ? -1 : 1;
    }

    const createdAtDiff = b.createdAt.getTime() - a.createdAt.getTime();

    if (createdAtDiff !== 0) {
      return createdAtDiff;
    }

    return a.id.localeCompare(b.id);
  });
};

const sortPinnedClientCards = <
  T extends { customer: { isPinned: boolean }; latestBooking: { createdAt: Date; id: string } },
>(
  items: T[],
) => {
  return [...items].sort((a, b) => {
    if (a.customer.isPinned !== b.customer.isPinned) {
      return a.customer.isPinned ? -1 : 1;
    }

    const createdAtDiff =
      b.latestBooking.createdAt.getTime() - a.latestBooking.createdAt.getTime();

    if (createdAtDiff !== 0) {
      return createdAtDiff;
    }

    return a.latestBooking.id.localeCompare(b.latestBooking.id);
  });
};

const customerFilterToStatuses = (
  filter: CustomerDashboardBookingsQuery["filter"],
): Array<"COMPLETED" | "CANCELLED"> | undefined => {
  if (filter === "COMPLETED") {
    return ["COMPLETED"];
  }

  if (filter === "CANCELLED") {
    return ["CANCELLED"];
  }

  return undefined;
};

const customerUpcomingStatusToBookingStatuses = (
  status: CustomerUpcomingBookingsQuery["status"],
): Array<"PENDING" | "ACCEPTED" | "CANCELLED"> => {
  if (status === "ASSIGNED") {
    return ["PENDING"];
  }

  if (status === "CONFIRMED") {
    return ["ACCEPTED"];
  }

  if (status === "CANCELLED") {
    return ["CANCELLED"];
  }

  return ["PENDING", "ACCEPTED", "CANCELLED"];
};

type ProviderClientListFilterOptions = {
  statuses?: Array<"PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED">;
  pinnedOnly: boolean;
};

const providerFilterToOptions = (
  filter: ProviderDashboardClientsQuery["filter"],
): ProviderClientListFilterOptions => {
  if (filter === "ONGOING") {
    return {
      statuses: ["ACCEPTED"],
      pinnedOnly: false,
    };
  }

  if (filter === "COMPLETED") {
    return {
      statuses: ["COMPLETED"],
      pinnedOnly: false,
    };
  }

  if (filter === "CANCELLED") {
    return {
      statuses: ["CANCELLED"],
      pinnedOnly: false,
    };
  }

  if (filter === "PINNED") {
    return {
      pinnedOnly: true,
    };
  }

  return {
    pinnedOnly: false,
  };
};

const paginateUniqueProviderClients = async (args: {
  providerId: string;
  statuses?: Array<"PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED">;
  pinnedOnly?: boolean;
  limit: number;
  cursor?: DashboardCursor;
}) => {
  const targetUniqueCount = args.limit + 1;
  const chunkSize = Math.min(200, Math.max(targetUniqueCount * 3, 30));
  const uniqueByCustomerId = new Map<string, ProviderBookingRecord>();
  let scanCursor = args.cursor;
  let exhausted = false;

  while (uniqueByCustomerId.size < targetUniqueCount && !exhausted) {
    const chunk = await listProviderBookingsChunk({
      providerId: args.providerId,
      statuses: args.statuses,
      pinnedOnly: args.pinnedOnly,
      cursor: scanCursor,
      take: chunkSize,
    });

    if (chunk.length === 0) {
      exhausted = true;
      break;
    }

    for (const booking of chunk) {
      if (!uniqueByCustomerId.has(booking.customerId)) {
        uniqueByCustomerId.set(booking.customerId, booking);
      }
    }

    const last = chunk[chunk.length - 1];

    if (!last) {
      exhausted = true;
      break;
    }

    scanCursor = {
      id: last.id,
      createdAt: last.createdAt,
    };

    if (chunk.length < chunkSize) {
      exhausted = true;
      break;
    }
  }

  const uniqueRows = Array.from(uniqueByCustomerId.values());
  const hasNextPage = uniqueRows.length > args.limit;
  const pageRows = hasNextPage ? uniqueRows.slice(0, args.limit) : uniqueRows;

  return {
    pageRows,
    hasNextPage,
    nextCursor: hasNextPage
      ? encodeCursor(pageRows[pageRows.length - 1] as ProviderBookingRecord)
      : null,
  };
};

const listProviderClientsWithFilter = async (
  providerId: string,
  filterOptions: ProviderClientListFilterOptions,
  limit: number,
  cursor: string | undefined,
) => {
  const page = await paginateUniqueProviderClients({
    providerId,
    statuses: filterOptions.statuses,
    pinnedOnly: filterOptions.pinnedOnly,
    cursor: decodeCursor(cursor),
    limit,
  });

  const countsRows = await listProviderClientStatusCounts({
    providerId,
    customerIds: page.pageRows.map((row) => row.customerId),
  });

  const countsByCustomerId = new Map<
    string,
    {
      total: number;
      requested: number;
      ongoing: number;
      completed: number;
      cancelled: number;
    }
  >();

  for (const row of countsRows) {
    const existing = countsByCustomerId.get(row.customerId) ?? {
      total: 0,
      requested: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0,
    };

    const next = { ...existing, total: existing.total + row._count._all };

    if (row.status === "PENDING") {
      next.requested += row._count._all;
    } else if (row.status === "ACCEPTED") {
      next.ongoing += row._count._all;
    } else if (row.status === "COMPLETED") {
      next.completed += row._count._all;
    } else if (row.status === "CANCELLED") {
      next.cancelled += row._count._all;
    }

    countsByCustomerId.set(row.customerId, next);
  }

  const sorted = sortPinnedClientCards(
    page.pageRows.map((booking) =>
      toProviderClientCard(
        booking,
        countsByCustomerId.get(booking.customerId) ?? {
          total: 0,
          requested: 0,
          ongoing: 0,
          completed: 0,
          cancelled: 0,
        },
      ),
    ),
  );

  return {
    data: sorted,
    meta: {
      nextCursor: page.nextCursor,
      hasNextPage: page.hasNextPage,
    },
  };
};

export const getCustomerDashboard = async (customerId: string) => {
  const [profile, counts] = await Promise.all([
    findCustomerDashboardProfile(customerId),
    getCustomerDashboardCounts(customerId),
  ]);

  if (!profile) {
    throw new AppError("Customer profile not found", 404);
  }

  return {
    customer: {
      id: profile.id,
      username: profile.username,
    },
    summary: {
      allBookings: counts.allBookings,
      completedBookings: counts.completedBookings,
      cancelledBookings: counts.cancelledBookings,
      savedServices: counts.savedServices,
      upcomingBookings: counts.upcomingBookings,
    },
  };
};

export const listCustomerUpcomingBookingsForDashboard = async (
  customerId: string,
  query: CustomerUpcomingBookingsQuery,
) => {
  const cursor = decodeUpcomingCursor(query.cursor);
  const records = await listCustomerUpcomingBookings({
    customerId,
    statuses: customerUpcomingStatusToBookingStatuses(query.status),
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const pageData = hasNextPage ? records.slice(0, query.limit) : records;
  const nextCursor = hasNextPage
    ? encodeUpcomingCursor(pageData[pageData.length - 1] as CustomerUpcomingBookingRecord)
    : null;

  return {
    data: pageData.map((booking) => toBookingCard(booking)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const listCustomerDashboardBookings = async (
  customerId: string,
  query: CustomerDashboardBookingsQuery,
) => {
  const cursor = decodeCursor(query.cursor);

  const records = await listCustomerBookings({
    customerId,
    statuses: customerFilterToStatuses(query.filter),
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const pageData = hasNextPage ? records.slice(0, query.limit) : records;
  const nextCursor = hasNextPage
    ? encodeCursor(pageData[pageData.length - 1] as CustomerBookingRecord)
    : null;

  return {
    mode: "bookings" as const,
    data: pageData.map((booking) => toBookingCard(booking)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const listCustomerSavedServicesForDashboard = async (
  customerId: string,
  query: DashboardPaginationQuery,
) => {
  const cursor = decodeCursor(query.cursor);
  const records = await listCustomerSavedServices({
    customerId,
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const pageData = hasNextPage ? records.slice(0, query.limit) : records;
  const nextCursor = hasNextPage
    ? encodeCursor(pageData[pageData.length - 1] as SavedServiceRecord)
    : null;

  return {
    data: pageData.map((item) => toSavedServiceCard(item)),
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const saveService = async (customerId: string, serviceId: string) => {
  const service = await findServiceForSaveById(serviceId);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  if (!service.isActive || !service.isVisible || service.provider.providerProfile?.status !== "APPROVED") {
    throw new BadRequestError("Only active public services can be saved");
  }

  const saved = await saveServiceForCustomer(customerId, serviceId);

  return {
    id: saved.id,
    serviceId: saved.serviceId,
    createdAt: saved.createdAt,
  };
};

export const unsaveService = async (customerId: string, serviceId: string) => {
  await unsaveServiceForCustomer(customerId, serviceId);
};

export const getProviderDashboard = async (providerId: string) => {
  const [counts, activeJobs] = await Promise.all([
    getProviderDashboardCounts(providerId),
    listProviderActiveJobs({
      providerId,
      take: 5,
    }),
  ]);

  if (!counts.providerUser) {
    throw new AppError("Provider profile not found", 404);
  }

  const activeCards = sortPinnedFirst(activeJobs.map((booking) => toActiveJobCard(booking)));
  const rating = formatProviderRating(counts.ratingAverage);

  return {
    provider: {
      id: counts.providerUser.id,
      username: counts.providerUser.username,
    },
    summary: {
      totalJobs: counts.totalJobs,
      reviewsBy: counts.reviewsBy,
      rating,
      requestedBookings: counts.requestedBookings,
      ongoingBookings: counts.ongoingBookings,
      completedBookings: counts.completedBookings,
      cancelledBookings: counts.cancelledBookings,
      pinnedCustomers: counts.pinnedCustomers,
    },
    activeNowJobs: activeCards,
  };
};

export const listProviderDashboardClients = async (
  providerId: string,
  query: ProviderDashboardClientsQuery,
) => {
  return listProviderClientsWithFilter(
    providerId,
    providerFilterToOptions(query.filter),
    query.limit,
    query.cursor,
  );
};

export const listProviderActiveNowJobs = async (
  providerId: string,
  query: DashboardPaginationQuery,
) => {
  const cursor = decodeCursor(query.cursor);
  const records = await listProviderActiveJobs({
    providerId,
    cursor,
    take: query.limit + 1,
  });

  const hasNextPage = records.length > query.limit;
  const pageData = hasNextPage ? records.slice(0, query.limit) : records;
  const sorted = sortPinnedFirst(pageData.map((booking) => toActiveJobCard(booking)));
  const nextCursor = hasNextPage
    ? encodeCursor(pageData[pageData.length - 1] as ProviderActiveJobRecord)
    : null;

  return {
    data: sorted,
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};

export const pinCustomer = async (providerId: string, customerId: string) => {
  if (providerId === customerId) {
    throw new BadRequestError("Provider cannot pin own account");
  }

  const pinned = await pinProviderCustomer(providerId, customerId);

  return {
    id: pinned.id,
    customerId: pinned.customerId,
    createdAt: pinned.createdAt,
  };
};

export const unpinCustomer = async (providerId: string, customerId: string) => {
  await unpinProviderCustomer(providerId, customerId);
};

export const clearProviderHistory = async (providerId: string) => {
  const rows = await findProviderBookingIdsForHistoryArchive(providerId);
  const bookingIds = rows.map((row) => row.id);

  if (bookingIds.length === 0) {
    return {
      archivedCount: 0,
    };
  }

  const result = await archiveProviderBookings(providerId, bookingIds);

  return {
    archivedCount: result.count,
  };
};

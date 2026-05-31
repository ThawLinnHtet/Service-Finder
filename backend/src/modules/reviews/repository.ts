import { prisma } from "../../database/prisma";

export type ReviewListCursor = {
  id: string;
  createdAt: Date;
};

type ListReviewsOptions = {
  cursor?: ReviewListCursor;
  take: number;
};

const reviewSelect = {
  id: true,
  bookingId: true,
  serviceId: true,
  providerId: true,
  customerId: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
  service: {
    select: {
      id: true,
      title: true,
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
} as const;

export const findBookingForReviewById = (bookingId: string) => {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      serviceId: true,
      customerId: true,
      providerId: true,
      status: true,
      review: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const createReviewAndRefreshProviderAggregate = (input: {
  bookingId: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  rating: number;
  comment?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId: input.bookingId,
        serviceId: input.serviceId,
        providerId: input.providerId,
        customerId: input.customerId,
        rating: input.rating,
        comment: input.comment,
      },
      select: reviewSelect,
    });

    const aggregate = await tx.review.aggregate({
      where: {
        providerId: input.providerId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await tx.providerProfile.updateMany({
      where: {
        userId: input.providerId,
      },
      data: {
        ratingAverage: aggregate._avg.rating ?? 0,
        ratingCount: aggregate._count.rating,
      },
    });

    return review;
  });
};

export const hasServiceById = async (serviceId: string): Promise<boolean> => {
  const count = await prisma.service.count({
    where: {
      id: serviceId,
    },
  });

  return count > 0;
};

const buildCursorWhere = (cursor: ReviewListCursor | undefined) => {
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

export const listReviewsByServiceId = (
  serviceId: string,
  options: ListReviewsOptions,
) => {
  const cursorWhere = buildCursorWhere(options.cursor);

  return prisma.review.findMany({
    where: {
      serviceId,
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: options.take,
    select: reviewSelect,
  });
};

export const listReviewsByProviderId = (
  providerId: string,
  options: ListReviewsOptions,
) => {
  const cursorWhere = buildCursorWhere(options.cursor);

  return prisma.review.findMany({
    where: {
      providerId,
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: options.take,
    select: reviewSelect,
  });
};

export const listReviewsByCustomerId = (
  customerId: string,
  options: ListReviewsOptions,
) => {
  const cursorWhere = buildCursorWhere(options.cursor);

  return prisma.review.findMany({
    where: {
      customerId,
      ...(cursorWhere ? { AND: [cursorWhere] } : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: options.take,
    select: reviewSelect,
  });
};

export type ReviewRecord = Awaited<
  ReturnType<typeof createReviewAndRefreshProviderAggregate>
>;

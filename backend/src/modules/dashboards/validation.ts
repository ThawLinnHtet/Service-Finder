import { z } from "zod";

const emptyStringToUndefined = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();
  return value ? value : undefined;
};

const paginationQuerySchema = z
  .object({
    cursor: z.preprocess(
      emptyStringToUndefined,
      z.string().max(1000, "Invalid cursor").optional(),
    ),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();

export const customerDashboardBookingsSchema = z.object({
  query: paginationQuerySchema.extend({
    filter: z.enum(["ALL", "COMPLETED", "CANCELLED"]).default("ALL"),
  }),
});

export const customerUpcomingBookingsSchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.enum(["ALL", "ASSIGNED", "CONFIRMED", "CANCELLED"]).default("ALL"),
  }),
});

export const providerDashboardClientsSchema = z.object({
  query: paginationQuerySchema.extend({
    filter: z
      .enum(["ALL", "ONGOING", "COMPLETED", "CANCELLED", "PINNED"])
      .default("ALL"),
  }),
});

export const dashboardPaginationSchema = z.object({
  query: paginationQuerySchema,
});

export const dashboardServiceParamSchema = z.object({
  params: z
    .object({
      serviceId: z.string({ error: "Service ID is required" }).uuid("Invalid service ID"),
    })
    .strict(),
});

export const dashboardCustomerParamSchema = z.object({
  params: z
    .object({
      customerId: z.string({ error: "Customer ID is required" }).uuid("Invalid customer ID"),
    })
    .strict(),
});

export type CustomerDashboardBookingsQuery = z.infer<
  typeof customerDashboardBookingsSchema
>["query"];
export type CustomerUpcomingBookingsQuery = z.infer<
  typeof customerUpcomingBookingsSchema
>["query"];
export type ProviderDashboardClientsQuery = z.infer<
  typeof providerDashboardClientsSchema
>["query"];
export type DashboardPaginationQuery = z.infer<typeof dashboardPaginationSchema>["query"];

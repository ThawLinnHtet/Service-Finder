import { z } from "zod";
import { MAX_SERVICE_AREAS_PER_SERVICE } from "../../common/constants/service-areas";
import {
  parseRequiredNumberInput,
  parseStringArrayInput,
} from "../../common/validation/preprocess";

const stringArrayFromUnknown = z.preprocess(parseStringArrayInput, z.array(z.string()));

const emptyStringToUndefined = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();
  return value ? value : undefined;
};

const optionalQueryNumber = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().optional(),
);

const serviceContentSchema = {
  categoryId: z.string({ error: "Category is required" }).uuid("Invalid category ID"),
  title: z
    .string({ error: "Service title is required" })
    .trim()
    .min(3, "Service title must be at least 3 characters")
    .max(120, "Service title must be less than 120 characters"),
  description: z
    .string({ error: "Service description is required" })
    .trim()
    .min(10, "Service description must be at least 10 characters")
    .max(1500, "Service description must be less than 1500 characters"),
  price: z.preprocess(
    parseRequiredNumberInput,
    z
      .coerce
      .number({ error: "Price is required" })
      .min(10000, "Price must be at least 10,000 MMK")
      .max(1000000, "Price must be at most 1,000,000 MMK"),
  ),
  experienceYears: z.preprocess(
    parseRequiredNumberInput,
    z
      .coerce
      .number({ error: "Experience years is required" })
      .int("Experience years must be a whole number")
      .min(0, "Experience years cannot be negative")
      .max(70, "Experience years is too high"),
  ),
  isAvailable: z.coerce.boolean().optional(),
  predefinedSkillIds: z
    .preprocess(parseStringArrayInput, z.array(z.string().uuid("Invalid skill ID")))
    .default([]),
  customSkills: stringArrayFromUnknown
    .pipe(
      z.array(
        z
          .string()
          .trim()
          .min(1, "Custom skill cannot be empty")
          .max(80, "Custom skill must be less than 80 characters"),
      ),
    )
    .default([]),
  serviceAreas: stringArrayFromUnknown.pipe(
    z
      .array(
        z
          .string()
          .trim()
          .min(2, "Service area must be at least 2 characters")
          .max(80, "Service area must be less than 80 characters"),
      )
      .min(1, "At least one service area is required")
      .max(
        MAX_SERVICE_AREAS_PER_SERVICE,
        `You can select up to ${MAX_SERVICE_AREAS_PER_SERVICE} service areas`,
      ),
  ),
};

export const listProviderServicesSchema = z.object({
  query: z
    .object({
      cursor: z.string().uuid("Invalid cursor").optional(),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict(),
});

export const publicServiceSortSchema = z.enum([
  "recent",
  "provider_recent",
  "price_asc",
  "price_desc",
  "nearest",
]);

export const listPublicServicesSchema = z.object({
  query: z
    .object({
      search: z
        .preprocess(
          emptyStringToUndefined,
          z.string().trim().min(1).max(120).optional(),
        ),
      categoryId: z
        .preprocess(
          emptyStringToUndefined,
          z.string().uuid("Invalid category ID").optional(),
        ),
      skillIds: z
        .preprocess(parseStringArrayInput, z.array(z.string().uuid("Invalid skill ID")))
        .default([]),
      township: z
        .preprocess(
          emptyStringToUndefined,
          z.string().trim().min(2).max(80).optional(),
        ),
      minPrice: optionalQueryNumber.pipe(
        z.number().min(0, "Minimum price cannot be negative").optional(),
      ),
      maxPrice: optionalQueryNumber.pipe(
        z.number().min(0, "Maximum price cannot be negative").optional(),
      ),
      minRating: optionalQueryNumber.pipe(
        z.number().min(0, "Minimum rating cannot be negative").max(5).optional(),
      ),
      isAvailable: z.coerce.boolean().optional(),
      noCompletedServices: z.coerce.boolean().optional(),
      latitude: optionalQueryNumber.pipe(
        z.number().min(-90, "Latitude must be at least -90").max(90).optional(),
      ),
      longitude: optionalQueryNumber.pipe(
        z.number().min(-180, "Longitude must be at least -180").max(180).optional(),
      ),
      sort: publicServiceSortSchema.default("recent"),
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    })
    .strict()
    .superRefine((query, ctx) => {
      if (
        query.minPrice !== undefined &&
        query.maxPrice !== undefined &&
        query.minPrice > query.maxPrice
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["minPrice"],
          message: "Minimum price cannot be greater than maximum price",
        });
      }

      const hasLatitude = query.latitude !== undefined;
      const hasLongitude = query.longitude !== undefined;

      if (hasLatitude !== hasLongitude) {
        ctx.addIssue({
          code: "custom",
          path: hasLatitude ? ["longitude"] : ["latitude"],
          message: "Both latitude and longitude are required for distance search",
        });
      }

      if (query.sort === "nearest" && (!hasLatitude || !hasLongitude)) {
        ctx.addIssue({
          code: "custom",
          path: ["sort"],
          message: "Nearest sorting requires latitude and longitude",
        });
      }
    }),
});

export const providerServiceIdParamSchema = z.object({
  params: z
    .object({
      serviceId: z.string({ error: "Service ID is required" }).uuid("Invalid service ID"),
    })
    .strict(),
});

export const createProviderServiceSchema = z.object({
  body: z.object(serviceContentSchema).strict(),
});

export const updateProviderServiceSchema = z.object({
  params: z
    .object({
      serviceId: z.string({ error: "Service ID is required" }).uuid("Invalid service ID"),
    })
    .strict(),
  body: z
    .object({
      title: serviceContentSchema.title.optional(),
      description: serviceContentSchema.description.optional(),
      price: serviceContentSchema.price.optional(),
      experienceYears: serviceContentSchema.experienceYears.optional(),
      isAvailable: serviceContentSchema.isAvailable,
      predefinedSkillIds: z
        .preprocess(parseStringArrayInput, z.array(z.string().uuid("Invalid skill ID")))
        .optional(),
      customSkills: stringArrayFromUnknown
        .pipe(
          z.array(
            z
              .string()
              .trim()
              .min(1, "Custom skill cannot be empty")
              .max(80, "Custom skill must be less than 80 characters"),
          ),
        )
        .optional(),
      serviceAreas: stringArrayFromUnknown
        .pipe(
          z
            .array(
              z
                .string()
                .trim()
                .min(2, "Service area must be at least 2 characters")
                .max(80, "Service area must be less than 80 characters"),
            )
            .min(1, "At least one service area is required")
            .max(
              MAX_SERVICE_AREAS_PER_SERVICE,
              `You can select up to ${MAX_SERVICE_AREAS_PER_SERVICE} service areas`,
            ),
        )
        .optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required for update",
    }),
});

export type ListProviderServicesQuery = z.infer<typeof listProviderServicesSchema>["query"];
export type ListPublicServicesQuery = z.infer<typeof listPublicServicesSchema>["query"];
export type PublicServiceSort = z.infer<typeof publicServiceSortSchema>;
export type CreateProviderServiceInput = z.infer<typeof createProviderServiceSchema>["body"];
export type UpdateProviderServiceInput = z.infer<typeof updateProviderServiceSchema>["body"];

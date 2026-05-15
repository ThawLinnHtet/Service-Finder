import { z } from "zod";

export const coordinateLocationSchema = z
  .object({
    latitude: z.coerce
      .number({ error: "Latitude must be a number" })
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z.coerce
      .number({ error: "Longitude must be a number" })
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    address: z
      .string({ error: "Address must be text" })
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be less than 200 characters")
      .optional(),
  })
  .strict();

import { z } from "zod";
import { NRC_TYPES } from "../../common/constants/nrc";

export const listNrcTownshipsSchema = z.object({
  params: z
    .object({
      stateCode: z
        .string({ error: "NRC state code is required" })
        .trim()
        .min(1, "NRC state code is required")
        .max(20, "NRC state code is too long"),
    })
    .strict(),
});

export const translateNrcSchema = z.object({
  body: z
    .object({
      stateCode: z
        .string({ error: "NRC state code is required" })
        .trim()
        .min(1, "NRC state code is required")
        .max(20, "NRC state code is too long"),
      townshipCode: z
        .string({ error: "NRC township code is required" })
        .trim()
        .min(1, "NRC township code is required")
        .max(20, "NRC township code is too long"),
      nrcType: z.enum(NRC_TYPES, {
        error: "NRC type is required",
      }),
      nrcNumber: z
        .string({ error: "NRC number is required" })
        .trim()
        .regex(/^\d{6}$/, "NRC number must be exactly 6 digits"),
    })
    .strict(),
});

export type TranslateNrcInput = z.infer<typeof translateNrcSchema>["body"];

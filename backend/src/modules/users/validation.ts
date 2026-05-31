import { z } from "zod";
import { coordinateLocationSchema } from "../../common/validation/location";
import { parseJsonObjectInput } from "../../common/validation/preprocess";

export const myanmarPhoneSchema = z
  .string({ error: "Phone number is required" })
  .trim()
  .regex(/^(\+?959|09)\d{7,9}$/, "Phone must be a valid Myanmar phone number");

export const usernameSchema = z
  .string({ error: "Username is required" })
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(50, "Username must be less than 50 characters");

export const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters")
  .toLowerCase();

export const passwordSchema = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/\d/, "Password must include at least one number");

export const updateCurrentUserProfileSchema = z.object({
  body: z
    .object({
      username: usernameSchema.optional(),
      email: emailSchema.optional(),
      phone: myanmarPhoneSchema.optional(),
      location: z.preprocess(parseJsonObjectInput, coordinateLocationSchema).optional(),
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required for update",
    }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string({ error: "Current password is required" })
        .min(1, "Current password is required")
        .max(72, "Current password is too long"),
      newPassword: passwordSchema,
    })
    .strict()
    .refine((value) => value.currentPassword !== value.newPassword, {
      path: ["newPassword"],
      message: "New password must be different from current password",
    }),
});

export type UpdateCurrentUserProfileInput = z.infer<
  typeof updateCurrentUserProfileSchema
>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];

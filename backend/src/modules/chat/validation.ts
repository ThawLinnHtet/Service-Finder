import { z } from "zod";
import { parseStringArrayInput } from "../../common/validation/preprocess";

const emptyStringToUndefined = (input: unknown): unknown => {
  if (typeof input !== "string") {
    return input;
  }

  const value = input.trim();
  return value ? value : undefined;
};

export const bookingIdParamSchema = z.object({
  params: z
    .object({
      bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    })
    .strict(),
});

export const listChatRoomsSchema = z.object({
  query: z
    .object({
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    })
    .strict(),
});

export const listChatPresenceSchema = z.object({
  query: z
    .object({
      userIds: z
        .preprocess(parseStringArrayInput, z.array(z.string().uuid("Invalid user ID")))
        .pipe(
          z
            .array(z.string().uuid("Invalid user ID"))
            .min(1, "At least one user ID is required")
            .max(100, "Too many user IDs"),
        ),
    })
    .strict(),
});

export const listChatMessagesSchema = z.object({
  params: z
    .object({
      bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    })
    .strict(),
  query: z
    .object({
      cursor: z.preprocess(
        emptyStringToUndefined,
        z.string().max(1000, "Invalid cursor").optional(),
      ),
      limit: z.coerce.number().int().min(1).max(100).default(30),
    })
    .strict(),
});

export const sendChatMessageSchema = z.object({
  params: z
    .object({
      bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    })
    .strict(),
  body: z
    .object({
      content: z
        .string({ error: "Message content is required" })
        .trim()
        .min(1, "Message content is required")
        .max(1000, "Message content must be less than 1000 characters"),
    })
    .strict(),
});

export const socketChatMessageSchema = z
  .object({
    bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    content: z
      .string({ error: "Message content is required" })
      .trim()
      .min(1, "Message content is required")
      .max(1000, "Message content must be less than 1000 characters"),
  })
  .strict();

export const socketJoinChatSchema = z
  .object({
    bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
  })
  .strict();

export const socketTypingSchema = z
  .object({
    bookingId: z.string({ error: "Booking ID is required" }).uuid("Invalid booking ID"),
    isTyping: z.boolean({ error: "isTyping is required" }),
  })
  .strict();

export type ListChatMessagesQuery = z.infer<typeof listChatMessagesSchema>["query"];
export type ListChatRoomsQuery = z.infer<typeof listChatRoomsSchema>["query"];
export type ListChatPresenceQuery = z.infer<typeof listChatPresenceSchema>["query"];
export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>["body"];
export type SocketChatMessageInput = z.infer<typeof socketChatMessageSchema>;
export type SocketTypingInput = z.infer<typeof socketTypingSchema>;

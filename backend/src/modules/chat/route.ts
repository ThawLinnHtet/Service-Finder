import { Router } from "express";
import { asyncHandler } from "../../common/middleware/async-handler";
import { authorizeRoles, requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  getChatPresenceController,
  getChatRoomController,
  listChatRoomsController,
  listChatMessagesController,
  markChatRoomReadController,
  sendChatMessageController,
} from "./controller";
import {
  bookingIdParamSchema,
  listChatPresenceSchema,
  listChatRoomsSchema,
  listChatMessagesSchema,
  sendChatMessageSchema,
} from "./validation";

const router = Router();

router.use(
  requireAuth,
  authorizeRoles("CUSTOMER", "PROVIDER", {
    message: "Only customers and providers can access chat",
  }),
);

router.get("/", validateRequest(listChatRoomsSchema), asyncHandler(listChatRoomsController));

router.get(
  "/presence",
  validateRequest(listChatPresenceSchema),
  asyncHandler(getChatPresenceController),
);

router.get(
  "/bookings/:bookingId",
  validateRequest(bookingIdParamSchema),
  asyncHandler(getChatRoomController),
);

router.get(
  "/bookings/:bookingId/messages",
  validateRequest(listChatMessagesSchema),
  asyncHandler(listChatMessagesController),
);

router.post(
  "/bookings/:bookingId/messages",
  validateRequest(sendChatMessageSchema),
  asyncHandler(sendChatMessageController),
);

router.patch(
  "/bookings/:bookingId/read",
  validateRequest(bookingIdParamSchema),
  asyncHandler(markChatRoomReadController),
);

export const chatRouter = router;

import type { Request, Response } from "express";
import {
  getChatRoomByBooking,
  getChatRoomChannel,
  listChatRooms,
  listChatMessages,
  markChatRoomAsRead,
  resolveChatActorFromAuth,
  sendChatMessage,
} from "./service";
import { getChatIo, getChatUsersPresence } from "./socket";
import type {
  ListChatMessagesQuery,
  ListChatPresenceQuery,
  ListChatRoomsQuery,
  SendChatMessageInput,
} from "./validation";

export const listChatRoomsController = async (req: Request, res: Response): Promise<void> => {
  const actor = resolveChatActorFromAuth(req.auth);
  const query = req.validated?.query as ListChatRoomsQuery;
  const result = await listChatRooms(actor, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const getChatRoomController = async (req: Request, res: Response): Promise<void> => {
  const actor = resolveChatActorFromAuth(req.auth);
  const { bookingId } = req.params as { bookingId: string };
  const room = await getChatRoomByBooking(actor, bookingId);

  res.status(200).json({
    success: true,
    data: room,
  });
};

export const getChatPresenceController = async (req: Request, res: Response): Promise<void> => {
  const query = req.validated?.query as ListChatPresenceQuery;
  const data = getChatUsersPresence(query.userIds);

  res.status(200).json({
    success: true,
    data,
  });
};

export const listChatMessagesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const actor = resolveChatActorFromAuth(req.auth);
  const { bookingId } = req.params as { bookingId: string };
  const query = req.validated?.query as ListChatMessagesQuery;
  const result = await listChatMessages(actor, bookingId, query);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
};

export const sendChatMessageController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const actor = resolveChatActorFromAuth(req.auth);
  const { bookingId } = req.params as { bookingId: string };
  const { content } = req.body as SendChatMessageInput;
  const result = await sendChatMessage(actor, bookingId, content);

  const io = getChatIo();
  if (io) {
    io.to(getChatRoomChannel(result.bookingId)).emit("chat:message", result.message);
  }

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: result.message,
  });
};

export const markChatRoomReadController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const actor = resolveChatActorFromAuth(req.auth);
  const { bookingId } = req.params as { bookingId: string };
  const result = await markChatRoomAsRead(actor, bookingId);

  res.status(200).json({
    success: true,
    message: "Chat marked as read",
    data: result,
  });
};

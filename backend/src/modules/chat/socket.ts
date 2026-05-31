import type { Server as HttpServer } from "node:http";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Server, type Socket } from "socket.io";
import { env } from "../../config/env";
import {
  getChatRoomByBooking,
  getChatRoomChannel,
  resolveChatActorFromAuth,
  sendChatMessageFromSocket,
} from "./service";
import { socketChatMessageSchema, socketJoinChatSchema, socketTypingSchema } from "./validation";

type SocketAuth = {
  userId: string;
  role: string;
};

type AccessTokenPayload = {
  sub: string;
  role: string;
  type: "access";
};

type ChatSocket = Socket;

type SocketAck = (response: { success: boolean; data?: unknown; error?: string }) => void;

type SocketRateLimitState = {
  count: number;
  windowStartMs: number;
};

let io: Server | null = null;

const socketSendRateState = new Map<string, SocketRateLimitState>();
const userSocketIds = new Map<string, Set<string>>();
const socketUserId = new Map<string, string>();
const userLastSeenAt = new Map<string, Date>();
const SOCKET_SEND_LIMIT_PER_MINUTE = 30;
const SOCKET_SEND_WINDOW_MS = 60_000;
const CHAT_ALLOWED_ROLES = new Set(["CUSTOMER", "PROVIDER"]);

const extractSocketToken = (socket: Socket): string | null => {
  const authToken = socket.handshake.auth?.token;

  if (typeof authToken === "string" && authToken.trim().length > 0) {
    return authToken;
  }

  const authorization = socket.handshake.headers.authorization;

  if (typeof authorization !== "string") {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const verifySocketAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

  if (payload.type !== "access" || typeof payload.sub !== "string") {
    throw new Error("Invalid access token");
  }

  return {
    sub: payload.sub,
    role: typeof payload.role === "string" ? payload.role : "",
    type: "access",
  };
};

const emitSocketError = (socket: ChatSocket, message: string) => {
  socket.emit("chat:error", {
    message,
  });
};

const respondAck = (
  ack: SocketAck | undefined,
  response: { success: boolean; data?: unknown; error?: string },
): void => {
  if (typeof ack === "function") {
    ack(response);
  }
};

const getSocketActor = (socket: ChatSocket): SocketAuth => {
  const auth = socket.data.auth as SocketAuth | undefined;

  if (!auth?.userId) {
    throw new Error("Authentication required");
  }

  return auth;
};

const checkSocketSendRateLimit = (socketId: string): boolean => {
  const now = Date.now();
  const state = socketSendRateState.get(socketId);

  if (!state) {
    socketSendRateState.set(socketId, {
      count: 1,
      windowStartMs: now,
    });
    return true;
  }

  if (now - state.windowStartMs >= SOCKET_SEND_WINDOW_MS) {
    socketSendRateState.set(socketId, {
      count: 1,
      windowStartMs: now,
    });
    return true;
  }

  if (state.count >= SOCKET_SEND_LIMIT_PER_MINUTE) {
    return false;
  }

  state.count += 1;
  socketSendRateState.set(socketId, state);
  return true;
};

export const getChatIo = (): Server | null => io;

const registerSocketPresence = (userId: string, socketId: string): boolean => {
  const existing = userSocketIds.get(userId);

  if (!existing) {
    userSocketIds.set(userId, new Set([socketId]));
    socketUserId.set(socketId, userId);
    userLastSeenAt.delete(userId);
    return true;
  }

  existing.add(socketId);
  socketUserId.set(socketId, userId);
  userLastSeenAt.delete(userId);
  return existing.size === 1;
};

const unregisterSocketPresence = (socketId: string): { userId: string; becameOffline: boolean } | null => {
  const userId = socketUserId.get(socketId);

  if (!userId) {
    return null;
  }

  socketUserId.delete(socketId);
  const set = userSocketIds.get(userId);

  if (!set) {
    return { userId, becameOffline: true };
  }

  set.delete(socketId);

  if (set.size === 0) {
    userSocketIds.delete(userId);
    userLastSeenAt.set(userId, new Date());
    return { userId, becameOffline: true };
  }

  return { userId, becameOffline: false };
};

const emitPresence = (payload: { userId: string; online: boolean; lastSeenAt: string | null }) => {
  io?.emit("chat:presence", payload);
};

export const getChatUsersPresence = (userIds: string[]) => {
  return userIds.map((userId) => {
    const isOnline = (userSocketIds.get(userId)?.size ?? 0) > 0;
    const lastSeenAt = isOnline ? null : userLastSeenAt.get(userId)?.toISOString() ?? null;

    return {
      userId,
      isOnline,
      lastSeenAt,
    };
  });
};

export const initializeChatSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
    },
    pingTimeout: 20_000,
    pingInterval: 25_000,
    maxHttpBufferSize: 10_000,
  });

  io.use((socket, next) => {
    try {
      const token = extractSocketToken(socket);

      if (!token) {
        throw new Error("Authentication required");
      }

      const payload = verifySocketAccessToken(token);

      if (!CHAT_ALLOWED_ROLES.has(payload.role.toUpperCase())) {
        throw new Error("Only customers and providers can access chat");
      }

      (socket as ChatSocket).data.auth = {
        userId: payload.sub,
        role: payload.role,
      };
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (rawSocket) => {
    const socket = rawSocket as ChatSocket;
    const auth = getSocketActor(socket);
    const becameOnline = registerSocketPresence(auth.userId, socket.id);

    if (becameOnline) {
      emitPresence({ userId: auth.userId, online: true, lastSeenAt: null });
    }

    socket.on("chat:join", async (payload: unknown, ack?: SocketAck) => {
      try {
        const parsed = socketJoinChatSchema.safeParse(payload);

        if (!parsed.success) {
          emitSocketError(socket, "Invalid join payload");
          respondAck(ack, { success: false, error: "Invalid join payload" });
          return;
        }

        const auth = getSocketActor(socket);
        const actor = resolveChatActorFromAuth(auth);
        const room = await getChatRoomByBooking(actor, parsed.data.bookingId);
        const channel = getChatRoomChannel(room.bookingId);

        await socket.join(channel);
        socket.emit("chat:joined", {
          bookingId: room.bookingId,
          roomId: room.id,
        });
        respondAck(ack, {
          success: true,
          data: {
            bookingId: room.bookingId,
            roomId: room.id,
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to join chat";
        emitSocketError(socket, message);
        respondAck(ack, { success: false, error: message });
      }
    });

    socket.on("chat:leave", async (payload: unknown, ack?: SocketAck) => {
      try {
        const parsed = socketJoinChatSchema.safeParse(payload);

        if (!parsed.success) {
          emitSocketError(socket, "Invalid leave payload");
          respondAck(ack, { success: false, error: "Invalid leave payload" });
          return;
        }

        await socket.leave(getChatRoomChannel(parsed.data.bookingId));
        socket.emit("chat:left", {
          bookingId: parsed.data.bookingId,
        });
        respondAck(ack, {
          success: true,
          data: {
            bookingId: parsed.data.bookingId,
          },
        });
      } catch {
        emitSocketError(socket, "Unable to leave chat");
        respondAck(ack, { success: false, error: "Unable to leave chat" });
      }
    });

    socket.on("chat:send", async (payload: unknown, ack?: SocketAck) => {
      try {
        if (!checkSocketSendRateLimit(socket.id)) {
          const message = "Too many messages. Please slow down";
          emitSocketError(socket, message);
          respondAck(ack, { success: false, error: message });
          return;
        }

        const parsed = socketChatMessageSchema.safeParse(payload);

        if (!parsed.success) {
          emitSocketError(socket, "Invalid message payload");
          respondAck(ack, { success: false, error: "Invalid message payload" });
          return;
        }

        const auth = getSocketActor(socket);
        const actor = resolveChatActorFromAuth(auth);
        const channel = getChatRoomChannel(parsed.data.bookingId);

        if (!socket.rooms.has(channel)) {
          const message = "Join chat before sending messages";
          emitSocketError(socket, message);
          respondAck(ack, { success: false, error: message });
          return;
        }

        const result = await sendChatMessageFromSocket(actor, parsed.data);
        io?.to(channel).emit("chat:message", result.message);
        respondAck(ack, { success: true, data: result.message });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to send message";
        emitSocketError(socket, message);
        respondAck(ack, { success: false, error: message });
      }
    });

    socket.on("chat:typing", async (payload: unknown, ack?: SocketAck) => {
      try {
        const parsed = socketTypingSchema.safeParse(payload);

        if (!parsed.success) {
          emitSocketError(socket, "Invalid typing payload");
          respondAck(ack, { success: false, error: "Invalid typing payload" });
          return;
        }

        const auth = getSocketActor(socket);
        const actor = resolveChatActorFromAuth(auth);
        const room = await getChatRoomByBooking(actor, parsed.data.bookingId);
        const channel = getChatRoomChannel(room.bookingId);

        if (!socket.rooms.has(channel)) {
          const message = "Join chat before sending typing updates";
          emitSocketError(socket, message);
          respondAck(ack, { success: false, error: message });
          return;
        }

        socket.to(channel).emit("chat:typing", {
          bookingId: room.bookingId,
          isTyping: parsed.data.isTyping,
          user: {
            id: actor.userId,
            role: actor.role,
          },
        });

        respondAck(ack, {
          success: true,
          data: {
            bookingId: room.bookingId,
            isTyping: parsed.data.isTyping,
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to send typing update";
        emitSocketError(socket, message);
        respondAck(ack, { success: false, error: message });
      }
    });

    socket.on("disconnect", () => {
      socketSendRateState.delete(socket.id);

      const result = unregisterSocketPresence(socket.id);

      if (result?.becameOffline) {
        emitPresence({
          userId: result.userId,
          online: false,
          lastSeenAt: userLastSeenAt.get(result.userId)?.toISOString() ?? null,
        });
      }
    });
  });

  return io;
};

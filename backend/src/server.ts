import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./database/prisma";
import { initializeChatSocket } from "./modules/chat/socket";

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

const io = initializeChatSocket(server);

const shutdown = async (): Promise<void> => {
  io.close(() => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

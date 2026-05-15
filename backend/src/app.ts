import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./common/middleware/error-handler";
import { notFoundHandler } from "./common/middleware/not-found";
import { authRouter } from "./modules/auth/route";
import { adminProvidersRouter } from "./modules/admin-providers/route";
import { adminCategoryChangeRequestsRouter } from "./modules/category-change-requests/admin-route";
import { bookingsRouter } from "./modules/bookings/route";
import { providerCategoryChangeRequestsRouter } from "./modules/category-change-requests/provider-route";
import { categoriesRouter } from "./modules/categories/route";
import { chatRouter } from "./modules/chat/route";
import { nrcRouter } from "./modules/nrc/route";
import { providersRouter } from "./modules/providers/route";
import { publicServicesRouter } from "./modules/services/public-route";
import { servicesRouter } from "./modules/services/route";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/admin/providers", adminProvidersRouter);
app.use("/api/admin/category-change-requests", adminCategoryChangeRequestsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/chats", chatRouter);
app.use("/api/nrc", nrcRouter);
app.use("/api/services", publicServicesRouter);
app.use("/api/provider", providersRouter);
app.use("/api/provider/category-change-requests", providerCategoryChangeRequestsRouter);
app.use("/api/provider/services", servicesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

import { createHash, randomUUID } from "node:crypto";

export const createOpaqueToken = (): string => randomUUID() + randomUUID();

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

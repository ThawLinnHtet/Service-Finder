-- CreateTable
CREATE TABLE "ChatRoomReadState" (
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoomReadState_pkey" PRIMARY KEY ("roomId","userId")
);

-- CreateIndex
CREATE INDEX "ChatRoomReadState_userId_updatedAt_idx" ON "ChatRoomReadState"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "ChatRoomReadState_roomId_lastReadAt_idx" ON "ChatRoomReadState"("roomId", "lastReadAt");

-- AddForeignKey
ALTER TABLE "ChatRoomReadState" ADD CONSTRAINT "ChatRoomReadState_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoomReadState" ADD CONSTRAINT "ChatRoomReadState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

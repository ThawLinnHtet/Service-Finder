-- CreateTable
CREATE TABLE "CustomerSavedService" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CustomerSavedService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPinnedCustomer" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProviderPinnedCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderArchivedBooking" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProviderArchivedBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSavedService_customerId_serviceId_key"
ON "CustomerSavedService"("customerId", "serviceId");

-- CreateIndex
CREATE INDEX "CustomerSavedService_customerId_createdAt_idx"
ON "CustomerSavedService"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "CustomerSavedService_serviceId_idx"
ON "CustomerSavedService"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPinnedCustomer_providerId_customerId_key"
ON "ProviderPinnedCustomer"("providerId", "customerId");

-- CreateIndex
CREATE INDEX "ProviderPinnedCustomer_providerId_createdAt_idx"
ON "ProviderPinnedCustomer"("providerId", "createdAt");

-- CreateIndex
CREATE INDEX "ProviderPinnedCustomer_customerId_idx"
ON "ProviderPinnedCustomer"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderArchivedBooking_providerId_bookingId_key"
ON "ProviderArchivedBooking"("providerId", "bookingId");

-- CreateIndex
CREATE INDEX "ProviderArchivedBooking_providerId_createdAt_idx"
ON "ProviderArchivedBooking"("providerId", "createdAt");

-- CreateIndex
CREATE INDEX "ProviderArchivedBooking_bookingId_idx"
ON "ProviderArchivedBooking"("bookingId");

-- AddForeignKey
ALTER TABLE "CustomerSavedService"
ADD CONSTRAINT "CustomerSavedService_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSavedService"
ADD CONSTRAINT "CustomerSavedService_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPinnedCustomer"
ADD CONSTRAINT "ProviderPinnedCustomer_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPinnedCustomer"
ADD CONSTRAINT "ProviderPinnedCustomer_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderArchivedBooking"
ADD CONSTRAINT "ProviderArchivedBooking_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderArchivedBooking"
ADD CONSTRAINT "ProviderArchivedBooking_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

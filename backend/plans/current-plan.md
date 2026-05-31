# Backend Implementation Plan

Updated: 2026-05-13

This plan supersedes the original 2026-05-12 backend plan. The old provider-profile-as-service direction is no longer current. The backend now follows the multi-service provider flow where one provider can own many service listings, and services are the primary searchable and bookable resource.

---

## Core Product Flow

- Customers can register, log in, search services, book services, chat after booking acceptance, and review completed bookings.
- Providers register through a frontend multi-step flow that is submitted as one backend registration request.
- Provider registration creates the provider account, provider profile, verification documents, and the provider's first service listing.
- Providers can create multiple service listings.
- Provider status defaults to `PENDING` until admin approval.
- Pending providers can create services, but those services are hidden from public search and cannot be booked.
- Approved providers' active services are publicly searchable and bookable.
- Public search is service-based, not provider-profile-based.
- Bookings link to a specific `serviceId`, customer, and provider.
- Chat is enabled only after a provider accepts a booking.
- Reviews are allowed only after completed bookings.

---

## Architecture Rules

- Use modular monolith architecture.
- Keep modules feature-based and independent.
- Use function-based controller, service, and repository layers.
- Controllers only handle HTTP request and response concerns.
- Services contain business logic.
- Repositories contain database access.
- Validate all external input with Zod.
- Use global `AppError`, async handler, and error middleware.
- Use cursor pagination for all list endpoints.
- Do not rely on text-only location for registration, search, or map features.

---

## Phase 1: Preserve Existing Foundation

- Keep Express application and server setup.
- Keep security middleware, CORS, Helmet, rate limiting, cookies, request logging, health endpoint, not-found handler, and global error handler.
- Keep environment validation pattern.
- Keep Prisma 7 PostgreSQL setup with driver adapter.
- Keep shared `AppError`, async handler, and Zod request validation middleware.
- Keep function-based auth module style.
- Add auth middleware and role authorization before protected/admin routes are implemented.

---

## Phase 2: Refactor Database Schema For Multi-Service Providers

- Keep `User` with roles `CUSTOMER`, `PROVIDER`, and `ADMIN`.
- Keep `RefreshToken`.
- Keep `ProviderProfile`, but store provider-level data only.
- Move service-specific fields out of `ProviderProfile` and into `Service`.
- Provider-level data includes approval status, rejection reason, verification state, provider bio if needed, and provider rating/completed-job aggregates if needed.
- Add or refactor `ProviderDocument` to store NRC front, NRC back, and selfie Cloudinary data.
- Add NRC reference tables for predefined state and township codes.
- Replace `ServiceCategory` enum with `Category` table.
- Add `Skill` table linked to `Category` for predefined skills.
- Refactor `Service` to include provider relation, category relation, title, description/about service, price, experience years, active status, and timestamps.
- Add service-to-skill relation for predefined skills.
- Add custom skill support per service.
- Add service area records for township filtering instead of storing township arrays.
- Make coordinates required for customer/provider location records.
- Add booking, chat, message, and review models before implementing those modules.
- Add indexes for provider status, service category, service price, service active/visibility status, service created date, service areas by city/township, rating fields, and booking status.

---

## Phase 3: Location And Mapbox Module

- Add `locations` module.
- Add `MAPBOX_ACCESS_TOKEN` environment validation.
- Add Mapbox reverse geocoding service.
- Customer registration sends coordinates; backend derives city and township.
- Provider registration sends pinned coordinates; backend derives city and township.
- Provider service area options must belong to the detected provider city.
- Nearby search must calculate distance from latitude and longitude.
- Do not trust frontend-provided city or township as the source of truth.
- Reject missing or invalid coordinates.

---

## Phase 4: Upload System

- Add Cloudinary environment validation.
- Add Cloudinary configuration module.
- Add multer middleware for multipart form handling.
- Add upload helper/service for provider verification images.
- Provider registration must upload NRC front image, NRC back image, and selfie photo.
- Store Cloudinary URL and public ID for each uploaded document.
- Validate file type and file size before upload.
- Return user-friendly validation errors for missing or invalid files.

---

## Phase 5: Customer Auth Refactor

- Keep `POST /api/auth/register/customer`.
- Change customer registration location input to require latitude and longitude.
- Backend derives city and township through Mapbox reverse geocoding.
- Reject text-only location as source of truth.
- Continue validating Myanmar phone numbers.
- Continue hashing passwords with bcrypt.
- Continue issuing access token and refresh token cookie.
- Continue returning safe user response without password hash.
- Add `POST /api/auth/refresh` to rotate refresh token cookie and issue a new access token.
- Add `POST /api/auth/logout` to revoke refresh token record and clear refresh token cookie.
- Add `POST /api/auth/login/admin` for admin email/password-only authentication.
- Add stricter rate limiting for `POST /api/auth/login/admin` than general API routes.

---

## Phase 6: Provider Registration

- Add `POST /api/auth/register/provider`.
- Accept multipart form data because verification images are uploaded during registration.
- Validate parsed multipart fields with Zod.
- Registration input includes username, email, Myanmar phone number, password, provider coordinates, first service category, first service predefined skills, first service custom skills if provided, service title, service description/about, price, experience years, service areas, NRC state code, NRC township code, NRC type, NRC number, NRC front image, NRC back image, and selfie photo.
- Create provider user, provider profile, provider documents, first service, service skills, custom skills, and service areas in one transaction where possible.
- Provider status defaults to `PENDING`.
- First service is created but hidden and unbookable until provider approval.
- Return safe auth response and set refresh token cookie.

---

## Phase 6.1: NRC Reference Data Module

- Add public NRC reference endpoints for frontend registration form options.
- Add `GET /api/nrc/types` for allowed NRC type values.
- Add `GET /api/nrc/states` for predefined NRC state codes.
- Add `GET /api/nrc/states/:stateCode/townships` for state-specific NRC township codes.
- Seed NRC reference coverage for all Myanmar NRC states and corresponding township codes (English for current phase).
- Enforce provider registration NRC validation against predefined references.
- Phase 6.1 bilingual extension:
  - Return Myanmar labels alongside English NRC type/state/township data.
  - Add `POST /api/nrc/translate` to return formatted English and Myanmar NRC strings from structured input.
  - Restrict supported NRC types to `N`, `E`, and `P` for consistent validation and translation behavior.

---

## Phase 7: Categories And Skills

- Add categories module.
- Add skills module.
- Seed initial MVP categories: Cleaning Services, Repair Services, Building Services, Education, Electrical Services, and Moving Services.
- Seed predefined skills from project docs where available.
- Add public endpoint to list categories.
- Add public endpoint to list skills by category.
- Services can use predefined skills and custom skills.

---

## Phase 8: Admin Provider Approval

- Add admin-only provider approval endpoints.
- Admin can approve provider registrations.
- Admin can reject provider registrations with rejection reason.
- Rejected provider services remain hidden and unbookable.
- Approved provider active services become eligible for public search and booking.
- Add admin provider review list/detail endpoints that include registration verification data (NRC fields, verification document URLs, service/category/skills, and service areas).
- Promote provider custom skills to global category skills only on approval.
- Do not promote custom skills when provider is rejected.
- Seed one admin account from environment variables (`ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PHONE`, `ADMIN_PASSWORD`).
- Provider login should include provider status context so frontend can show waiting/rejected states.
- Rejected providers can resubmit verification via same account (no duplicate re-registration).

---

## Phase 9: Services Module

- Add provider service profile management endpoints.
- Providers manage one current service profile for MVP.
- Providers can edit service profile fields (title, about/description, skills, price, experience, availability, and service areas) only after admin approval.
- Providers edit existing service profile only; new provider-created service profiles are disabled in current MVP flow.
- Enforce price range from 10,000 MMK to 1,000,000 MMK.
- Enforce category and skill validity.
- Enforce service areas belong to provider's detected city.
- Use cursor pagination for provider service lists.
- Enforce service area selection limit per service (`1` to `10`).
- Disallow direct category edits in provider service update; category/job changes must go through admin request workflow.
- Provider-owned service endpoints (legacy service module retained during Option A transition):
  - `GET /api/provider/services`
  - `GET /api/provider/services/:serviceId`
  - `PATCH /api/provider/services/:serviceId`
  - `PATCH /api/provider/services/:serviceId/activate`
  - `PATCH /api/provider/services/:serviceId/deactivate`
- Restrict provider service management to `APPROVED` providers only.
- Keep provider-created custom skills service-specific in Phase 9 (no automatic global promotion).

### Phase 9.1: Category/Job Change Request Workflow

- Providers cannot directly switch to a new category.
- Provider must submit category/job change request form with:
  - requested category,
  - requested service title,
  - predefined/custom skills for requested category,
  - experience years,
  - price,
  - reason for change.
- Requested category must be different from provider current primary category.
- Only one pending category change request is allowed per provider.
- Add provider endpoint:
  - `POST /api/provider/category-change-requests`
- Add admin review endpoints:
  - `GET /api/admin/category-change-requests`
  - `GET /api/admin/category-change-requests/:requestId`
  - `PATCH /api/admin/category-change-requests/:requestId/approve`
  - `PATCH /api/admin/category-change-requests/:requestId/reject`
- On approve: update provider primary category and apply requested skills/price/experience to provider service profile.
- On reject: keep current category unchanged and persist admin rejection reason.

---

## Phase 10: Public Service Search And Discovery

- Search public services, not raw provider profiles.
- Only include active services owned by approved providers.
- Support filters by category, skills, township/service area, price range, rating, availability, and providers with no completed services yet.
- Support search by provider name, category, and service title/description if useful.
- Support sorting by lowest price, highest price, most recent services/providers, and nearest provider/service distance.
- Use cursor pagination for all search responses.
- Return service cards with provider summary and location/distance where applicable.

---

## Phase 11: Bookings

- Add booking lifecycle endpoints.
- Booking must link to `serviceId`, customer, and provider.
- Customers can book approved providers' active services only.
- Booking creation must require scheduled date and time (`scheduledAt`).
- Provider can accept or reject bookings for their own services.
- Customers can reschedule accepted bookings with a new future `scheduledAt`.
- Support statuses `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, and `CANCELLED`.
- Restrict status transitions by role.
- Chat room is created when booking is requested (`PENDING`) so customer and provider can discuss job details before acceptance.

---

## Phase 12: Chat

- Add one chat room per booking request.
- Store messages in DB.
- Add Socket.IO real-time rooms by booking/chat ID.
- Only booking customer and provider can access the booking chat.
- Add chat inbox/list endpoint for customer and provider message tabs with cursor pagination and last-message summary.
- Allow chat read access for all booking lifecycle statuses.
- Allow message sending for `PENDING` and `ACCEPTED` bookings only.
- Add typing indicator events for joined booking chat rooms.
- Add online/offline presence events and presence lookup support for chat participant status badges.
- Add unread message count in chat inbox response.
- Add chat read-marker endpoint so opening a room can mark messages as read.

---

## Phase 13: Reviews

- Allow customers to review completed bookings only.
- Enforce one review per booking.
- Cancelled and rejected bookings cannot be reviewed.
- Keep review creation rating-focused for current MVP (star rating required, comment deferred for later phase).
- Update provider/service rating aggregates as needed.
- Track completed service count for filtering providers with no completed services yet.
- Add customer review list endpoint so customers can view reviews they submitted.

---

## Phase 13.1: Customer/Provider Dashboard APIs

- Add customer dashboard summary endpoint for top cards only (no large list payloads).
- Customer dashboard summary response should include customer greeting data (`id`, `username`).
- Add customer upcoming bookings list endpoint with cursor pagination and status filter (`ALL`, `ASSIGNED`, `CONFIRMED`, `CANCELLED`).
- Add customer dashboard booking filter endpoint with `ALL`, `COMPLETED`, and `CANCELLED` views.
- Add saved-service endpoints so customers can save/unsave services and list saved services.
- Add provider dashboard endpoint for summary cards and active-now jobs.
- Provider dashboard summary must include `totalJobs`, `reviewsBy`, and `rating` (`average`, `display`).
- Provider dashboard summary response should include provider greeting data (`id`, `username`).
- Add provider dashboard client filter endpoint with `ALL`, `ONGOING`, `COMPLETED`, `CANCELLED`, and `PINNED` views.
- Use booking module list endpoint (`GET /api/bookings?status=PENDING`) as the single source for provider requested booking cards with cursor pagination.
- Add provider active-now jobs endpoint for accepted bookings whose scheduled time has started.
- Add provider pin/unpin customer endpoints and prioritize pinned customers in dashboard booking views.
- Add provider history clear endpoint that archives provider-side historical bookings (completed/cancelled/rejected) from dashboard views.

---

## Phase 13.2: Customer And Provider Profile APIs

- Add current-user profile endpoints for authenticated account reads and customer account edits.
- Add `GET /api/users/me` for safe account/profile reads.
- Add `PATCH /api/users/me` for customer/admin account edits (`username`, `email`, `phone`, and coordinate-based `location`).
- Add `PATCH /api/users/me/password` for password changes with current-password verification and refresh-token revocation.
- Add provider-specific profile endpoints:
  - `GET /api/provider/profile`
  - `PATCH /api/provider/profile`
  - `PATCH /api/provider/profile/password`
- Provider profile read response should include account data, location, provider status/rejection context, provider `about`, rating summary, current service profile summary, and verification document previews.
- Provider profile updates may edit `username`, `email`, `phone`, `about`, and coordinate-based `location`.
- Provider location updates must reverse-geocode coordinates through Mapbox.
- If provider location city changes, require updated `serviceAreas` in the same request and validate those service areas against the new city.
- Keep provider NRC fields and verification documents read-only after approval; rejected providers continue using the existing resubmit flow.
- Keep category/job changes in the existing admin-reviewed category-change request workflow.
- Keep service profile fields in the existing provider service endpoints.

---

## Phase 14: Documentation And Tests

- Add OpenAPI/Swagger docs after route shapes stabilize.
- Add Jest + Supertest integration tests for auth, validation, protected routes, provider registration with uploads, admin approval, service CRUD, search/filtering, booking flow, and location APIs.

---

## Immediate Implementation Scope

- Do not add more APIs on the old provider-profile-as-service structure.
- First refactor Prisma schema to support multiple services per provider.
- Then implement Mapbox location flow.
- Then implement Cloudinary upload flow.
- Then implement provider registration that creates the first service listing.

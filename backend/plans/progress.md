# Backend Progress

## 2026-05-12

- Created initial backend phase plan.
- Confirmed existing backend only has empty `src/app.ts` and `src/server.ts`.
- Confirmed no existing `prisma/schema.prisma`.
- Confirmed `plans/current-plan.md` and `plans/progress.md` were missing before this entry.
- Started implementation scope: Phase 1 foundation, Phase 2 schema, Phase 3 customer auth.

## 2026-05-12 Implementation Update

- Added `plans/current-plan.md` with all backend phases from foundation through docs/tests.
- Added Express app/server foundation with security middleware, CORS, rate limiting, cookies, request logging, health endpoint, not-found handler, and global error handler.
- Added environment validation in `src/config/env.ts`.
- Added shared `AppError`, async handler, and Zod request validation middleware.
- Added Prisma 7 PostgreSQL config and generated client setup.
- Added Prisma schema models/enums for users, refresh tokens, provider profiles, provider documents, and services.
- Added customer auth endpoints:
  - `POST /api/auth/register/customer`
  - `POST /api/auth/login`
- Added Myanmar phone validation, bcrypt password hashing, JWT access token, and refresh token HTTP-only cookie support.
- Generated Prisma client successfully.
- Verified TypeScript build successfully with `npm run build`.
- Added backend `.gitignore` for dependencies, build output, logs, and local env files.
- Newly discovered task: configure real environment values for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `DATABASE_URL` before running the server or migrations.
- Newly discovered task: run `npm audit` review later; dependency install reported 3 moderate vulnerabilities.

## 2026-05-12 Refactor Update

- Refactored auth module from class-based controller/service/repository to function-based exports.
- Kept the same API behavior and route paths.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-12 Validation Update

- Added user-friendly validation messages for customer registration and login inputs.
- Changed request validation errors to return frontend-friendly `{ field, message }` arrays.
- Validation field paths now remove transport wrappers like `body`, `query`, and `params`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-12 Validation Limits Update

- Updated customer registration limits to product-specific values.
- Password now requires 8-72 characters with at least one uppercase letter, one lowercase letter, and one number.
- Special characters are not required for MVP usability.
- Updated bcrypt-aware password max length to 72 characters.
- Updated username, email, city, township, and address limits to more reasonable values.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-12 Password Message Update

- Split password validation into separate messages for uppercase, lowercase, and number requirements.
- Kept the internal bcrypt-aware 72-character limit, but changed the user-facing message to `Password is too long`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Plan Revision Update

- Reviewed updated project flow from `AGENTS.md`, `PROJECT.md`, `BUSINESS_RULES.md`, and `ARCHITECTURE.md`.
- Confirmed product direction changed to a multi-service provider model where one provider can own many service listings.
- Updated `plans/current-plan.md` with the revised Option B flow.
- Revised plan now treats services as the searchable/bookable unit instead of provider profiles.
- Revised plan moves service-specific fields such as category, skills, price, experience, and service description from `ProviderProfile` to `Service`.
- Revised plan keeps provider registration as a multi-step frontend flow submitted as one backend registration request that creates the provider account, verification records, and first service listing.
- Revised plan requires real `multer + Cloudinary` uploads for NRC front, NRC back, and selfie during provider registration.
- Revised plan requires Mapbox reverse geocoding from coordinates and rejects text-only location as source of truth.
- No source code, schema, package, or API implementation changes were made in this update.

## 2026-05-13 Current Plan Cleanup

- Cleaned `plans/current-plan.md` so it now contains only the current multi-service provider implementation plan.
- Removed the old pre-update phases from `plans/current-plan.md` to avoid accidentally implementing the outdated provider-profile-as-service flow.
- Preserved historical context in `plans/progress.md` instead of keeping obsolete implementation guidance in the current plan.
- No source code, schema, package, or API implementation changes were made in this update.

## 2026-05-13 Implementation Update (Option B Start)

- Refactored Prisma schema for multi-service provider flow:
  - Removed `ServiceCategory` enum in favor of data-driven category/skill models.
  - Added `Category`, `Skill`, `ServiceSkill`, `ServiceCustomSkill`, and `ServiceArea` models.
  - Expanded `Service` to own service-level fields (category, title, description, price, experience, visibility, availability).
  - Refactored `ProviderProfile` to keep provider-level fields and status.
  - Expanded `ProviderDocument` with Cloudinary public IDs.
  - Added booking/chat/review models (`Booking`, `ChatRoom`, `Message`, `Review`) for upcoming phases.
  - Made user coordinates required and added location/search indexes.
- Regenerated Prisma client successfully with `npm run prisma:generate`.
- Added required env validation keys for Mapbox and Cloudinary in `src/config/env.ts`.
- Added location reverse geocoding service in `src/modules/locations/service.ts`.
- Added real upload infrastructure:
  - Installed `multer`, `cloudinary`, and `@types/multer`.
  - Added Cloudinary config in `src/config/cloudinary.ts`.
  - Added multipart upload middleware in `src/common/middleware/upload.ts`.
  - Added Cloudinary buffer upload helper in `src/common/utils/cloudinary.ts`.
  - Updated global error handler for Multer errors.
- Refactored auth validation:
  - Customer registration now requires coordinate-based location input.
  - Added provider registration schema for multi-step provider submit payload.
  - Added robust array parsing for multipart string fields (`predefinedSkillIds`, `customSkills`, `serviceAreas`).
- Implemented provider registration endpoint:
  - Added `POST /api/auth/register/provider` route with multer + validation.
  - Added provider registration controller/service/repository flow.
  - Flow now creates provider user, provider profile, provider documents, and first service in a transaction.
  - First service is created hidden (`isVisible: false`) and unbookable to public until approval phase is added.
  - Validates category existence and category-skill consistency.
  - Uploads NRC front, NRC back, and selfie to Cloudinary.
- Refactored customer registration service to derive city/township via Mapbox reverse geocoding before user creation.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add seed script/data for initial `Category` and `Skill` records before provider registration can succeed in real usage.
- Newly discovered task: add admin approval module and visibility toggle workflow so approved providers/services become public.

## 2026-05-13 Mapbox Reverse Geocoding Fix

- Updated `src/modules/locations/service.ts` to use Mapbox Geocoding v6 reverse endpoint (`/search/geocode/v6/reverse`).
- Refactored Mapbox response parsing to match v6 feature shape (`properties.context.*`).
- Added city extraction from `context.place.name` and township extraction with locality/district/neighborhood fallbacks.
- Added clearer location error details by including Mapbox message when HTTP response is not OK.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Category/Skill Seed Setup

- Added Prisma seed script at `prisma/seed.ts` for initial categories and predefined skills.
- Seed data now includes:
  - Cleaning Services
  - Repair Services
  - Building Services
  - Education
  - Electrical Services
  - Moving Services
- Added predefined skills per category (including Math, English, IELTS, Physics, and repair skills from project docs).
- Updated `prisma.config.ts` migrations section with `seed: "tsx prisma/seed.ts"` for Prisma 7 seed execution.
- Added `prisma:seed` script in `package.json`.
- Executed seed successfully with `npm run prisma:seed`.

## 2026-05-13 Provider Registration Single About Field Update

- Updated provider registration validation to use a single `about` field and removed separate `description` input from `registerProviderSchema`.
- Updated provider first-service creation so `Service.description` now uses the same `about` value submitted by the provider.
- Custom provider-created skills remain supported through `customSkills` in provider registration.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Error Message Normalization Update

- Improved Cloudinary upload error normalization in `src/common/utils/cloudinary.ts` so provider image upload failures are converted into readable `AppError` messages instead of propagating raw objects.
- Improved unknown-error fallback handling in `src/common/middleware/error-handler.ts` to avoid returning `[object Object]` in development responses.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Cloudinary 503 Handling And Upload Cleanup Update

- Updated `src/common/utils/cloudinary.ts` to map Cloudinary `503` responses to a user-friendly temporary-unavailable message.
- Updated Cloudinary error mapping to avoid exposing raw upstream 5xx text while still preserving useful error details like `httpCode` and `name`.
- Added `deleteImageByPublicId` utility in `src/common/utils/cloudinary.ts` for cleanup support.
- Updated provider registration upload flow in `src/modules/auth/service.ts` to upload verification images sequentially and clean up already-uploaded images if a later upload fails, preventing orphaned Cloudinary assets.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Prisma/Network Connectivity Error Normalization Update

- Updated `src/common/middleware/error-handler.ts` to detect Prisma connectivity errors (`P1001`, `P1002`) and common network connectivity failures (`EAI_AGAIN`, `ENOTFOUND`, `ECONNREFUSED`, `ETIMEDOUT`).
- Added consistent user-friendly response for transient DB connectivity failures: `Database temporarily unavailable. Please try again shortly` with HTTP 503.
- Kept existing validation/app error behavior unchanged for non-connectivity failures.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Categories API + Provider Location/Validation Alignment Update

- Added new public categories module with endpoints:
  - `GET /api/categories`
  - `GET /api/categories/:categoryId/skills`
- Added category route parameter validation for `categoryId` UUID and `404` response when category is not found.
- Mounted categories router in `src/app.ts` under `/api/categories`.
- Updated provider registration request shape to nested `location` only (same shape as customer registration) by replacing flat `latitude`, `longitude`, and `address` fields in `registerProviderSchema`.
- Updated provider registration service/repository flow to use `input.location.latitude`, `input.location.longitude`, and `input.location.address`.
- Replaced generic duplicate conflict handling with field-specific validation errors for registration:
  - `email` => `Email is already registered`
  - `phone` => `Phone is already registered`
- Added backend service-area validation against city allowlist for provider registration and normalized township values before storage.
- Added service area constants/normalization utility in `src/common/constants/service-areas.ts`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Service Area Allowlist Expansion Update

- Expanded provider service-area allowlist beyond Yangon by adding Mandalay and Naypyidaw/Naypyitaw city coverage in `src/common/constants/service-areas.ts`.
- Added core township allowlists for Mandalay (`Aungmyethazan`, `Chanayethazan`, `Chanmyathazi`, `Mahaaungmye`, `Patheingyi`, `Pyigyidagun`, `Amarapura`).
- Added Naypyidaw/Naypyitaw township allowlists (`Ottarathiri`, `Pobbathiri`, `Zabuthiri`, `Zeyarthiri`, `Dakkhinathiri`, `Tatkon`, `Lewe`, `Pyinmana`).
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 NRC Reference Data And Validation Update

- Refactored provider NRC data model to structured fields:
  - Replaced free-text `nrcState` and `nrcTownship` with `nrcStateCode` and `nrcTownshipCode`.
  - Added `nrcType` enum (`N`, `E`, `P`, `A`, `F`, `THA`) to `ProviderProfile`.
  - Added Prisma relations from `ProviderProfile` to new NRC reference tables.
- Added new Prisma models and migration for NRC reference data:
  - `NrcState`
  - `NrcTownship` (composite key by `stateCode + code`)
  - Migration file: `prisma/migrations/20260513164000_add_nrc_reference_data/migration.sql`
- Added NRC seed data in `prisma/seed.ts`:
  - Seeded state codes `1` to `14`.
  - Seeded township codes for Yangon, Mandalay, and Naypyidaw-region coverage used in current MVP geography.
- Added public NRC module endpoints:
  - `GET /api/nrc/types`
  - `GET /api/nrc/states`
  - `GET /api/nrc/states/:stateCode/townships`
- Mounted NRC routes in `src/app.ts` under `/api/nrc`.
- Updated provider registration validation and business checks:
  - Updated auth validation fields to `nrcStateCode`, `nrcTownshipCode`, `nrcType`, and six-digit `nrcNumber`.
  - Added reference validation in auth service/repository to ensure selected state exists and township belongs to that state.
- Added shared NRC constants in `src/common/constants/nrc.ts`.
- Updated implementation plan in `plans/current-plan.md` to include structured NRC inputs and a dedicated NRC reference module phase.
- Verified Prisma client generation successfully with `npm run prisma:generate`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 NRC Full Township Coverage Update

- Replaced partial hardcoded NRC township seed data with complete all-state source data using `mm-nric`.
- Added `prisma/seed-data/nrc.ts` to centralize NRC seed generation and validation logic.
- Seed source now maps all Myanmar NRC states (`1` to `14`) and corresponding township codes (English-only for current phase).
- Added seed safety checks to ensure:
  - exactly 14 NRC states are present,
  - every township references an existing state,
  - each state has at least one township.
- Updated `prisma/seed.ts` to import NRC seed data from `prisma/seed-data/nrc.ts` and run validation before DB writes.
- Updated NRC state response ordering to numeric sort (`1..14`) in `src/modules/nrc/service.ts`.
- Added migration `prisma/migrations/20260513173200_drop_nrc_township_state_name_unique/migration.sql` to remove overly strict unique constraint on `(stateCode, name)` so real-world duplicate township names do not break seeding.
- Applied pending migrations successfully with `npx prisma migrate deploy`.
- Executed seed successfully with full NRC data using `npm run prisma:seed`.
- Verified Prisma client generation successfully with `npm run prisma:generate`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Provider Upload Hardening And Service Area Validation Fix

- Fixed provider registration validation so `serviceAreas` cannot be bypassed by defaulting to an empty array.
  - Removed `.default([])` from `serviceAreas` in `src/modules/auth/validation.ts`.
  - Field now remains required and still enforces `.min(1, "At least one service area is required")`.
- Hardened provider identity-document upload validation:
  - Installed `file-type` and added `src/common/utils/file-signature.ts` for magic-byte file signature checks.
  - Restricted accepted image formats to JPEG, PNG, and WebP by both declared MIME and detected file signature.
  - Updated multer file filter in `src/common/middleware/upload.ts` to allow only JPEG/PNG/WebP MIME types.
  - Added pre-upload signature verification in `src/modules/auth/service.ts` for:
    - `nrcFrontImage`
    - `nrcBackImage`
    - `selfieImage`
- Invalid signatures now return field-specific validation errors.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Provider Registration Skill Requirement Update

- Added provider registration business validation in `src/modules/auth/service.ts` to require at least one skill selection.
- Registration now rejects requests where both `predefinedSkillIds` and `customSkills` are empty after normalization.
- Added frontend-friendly validation error:
  - `field`: `skills`
  - `message`: `At least one predefined or custom skill is required`
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Provider Multipart Location Parsing Compatibility Update

- Added JSON-string object preprocessing helper in `src/modules/auth/validation.ts` so `location` can be parsed from multipart form-data text fields.
- Updated provider registration validation to parse `location` before applying coordinate schema validation.
- This now supports frontend provider registration payloads where multipart sends:
  - `location` as a JSON string (from `FormData.append("location", JSON.stringify(...))`)
- Kept the same coordinate validation rules and Mapbox reverse-geocoding flow.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Provider Required Number Validation Update

- Improved multipart form-data numeric validation in `src/modules/auth/validation.ts` for provider registration.
- Added required-number preprocessing so empty-string inputs are treated as missing values before numeric coercion.
- Updated `price` validation to return required-field message when missing/empty:
  - `Price is required`
- Updated `experienceYears` validation to return required-field message when missing/empty:
  - `Experience years is required`
- Kept existing numeric business constraints unchanged:
  - `price`: `10,000` to `1,000,000` MMK
  - `experienceYears`: whole number, `0` to `70`
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-13 Registration Race-Condition Handling And Cloudinary DB-Failure Cleanup Update

- Improved registration race-condition handling for database unique constraint conflicts (`P2002`) in `src/modules/auth/service.ts`.
- Added Prisma unique-conflict normalization so race-condition duplicates now return friendly field errors instead of generic server failures:
  - `email` => `Email is already registered`
  - `phone` => `Phone is already registered`
- Added provider-registration Cloudinary cleanup on database transaction failure after successful image uploads.
  - If provider creation transaction fails, backend now deletes uploaded `nrcFront`, `nrcBack`, and `selfie` assets via `Promise.allSettled` before re-throwing.
- Added global fallback handling for unhandled Prisma unique constraint errors (`P2002`) in `src/common/middleware/error-handler.ts` with HTTP `409` and `Resource already exists`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-14 NRC Myanmar Translation And Bilingual Reference Update

- Extended NRC reference schema for bilingual data:
  - Added `NrcState.nameMm`.
  - Added `NrcTownship.codeMm` and `NrcTownship.nameMm`.
  - Added migration `prisma/migrations/20260514101500_add_nrc_myanmar_fields/migration.sql` with safe backfill for existing rows.
- Refactored NRC seed source in `prisma/seed-data/nrc.ts` to map both English and Myanmar values from `mm-nric`:
  - States now include `name` + `nameMm`.
  - Townships now include `code` + `codeMm` and `name` + `nameMm`.
- Updated `prisma/seed.ts` upsert logic to persist bilingual NRC fields.
- Expanded NRC constants and type-label support in `src/common/constants/nrc.ts`:
  - Added `NRC_TRANSLATABLE_TYPES` (`N`, `E`, `P`) for `mm-nric` conversion support.
  - Added Myanmar labels for supported and fallback NRC types.
- Updated NRC public APIs:
  - `GET /api/nrc/types` now returns objects with `value`, `labelEn`, and `labelMm`.
  - `GET /api/nrc/states` now includes `nameMm`.
  - `GET /api/nrc/states/:stateCode/townships` now includes `codeMm` and `nameMm`.
  - Added `POST /api/nrc/translate` with validation for `stateCode`, `townshipCode`, `nrcType`, and six-digit `nrcNumber`.
- Implemented NRC translation flow in `src/modules/nrc/service.ts`:
  - Uses `mm-nric` conversion for `N`, `E`, `P`.
  - Uses deterministic fallback Myanmar formatter for currently allowed non-package types (`A`, `F`, `THA`).
- Moved `mm-nric` to runtime dependencies in `package.json` because translation now runs in API service code.
- Updated plan phase notes in `plans/current-plan.md` to include bilingual NRC responses and translation endpoint.
- Verified Prisma client generation successfully with `npm run prisma:generate`.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: align frontend NRC type UI with new `/api/nrc/types` object response shape and consume `labelMm` for display.
- Newly discovered task: run `npm run prisma:migrate` and `npm run prisma:seed` against target database environment to apply and populate bilingual NRC fields.

## 2026-05-14 NRC Type Restriction To N/E/P Update

- Restricted backend NRC type support from six values to three values for consistency with `mm-nric` conversion behavior.
  - Removed `A`, `F`, and `THA` from `NrcType` enum in `prisma/schema.prisma`.
  - Removed `A`, `F`, and `THA` from `NRC_TYPES` in `src/common/constants/nrc.ts`.
- Simplified NRC Myanmar translation flow in `src/modules/nrc/service.ts`:
  - Removed fallback translation branch for unsupported types.
  - Translation now uses `mm-nric` directly for all allowed types (`N`, `E`, `P`) and returns HTTP `422` when conversion fails unexpectedly.
- Added safe enum migration for existing databases:
  - `prisma/migrations/20260514112500_reduce_nrc_types_to_nep/migration.sql`.
  - Migration pre-check raises an explicit exception if any `ProviderProfile.nrcType` row still contains non-`N/E/P` values.
  - Migration then converts column enum type from old `NrcType` to new `NrcType` with only `N`, `E`, `P`.
- Updated plan guidance in `plans/current-plan.md` Phase 6.1 to explicitly restrict NRC types to `N`, `E`, and `P`.
- Verified Prisma client generation successfully with `npm run prisma:generate`.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: before applying migration on shared/staging/production databases, run a pre-check query for non-`N/E/P` `nrcType` rows and normalize data if any exists.

## 2026-05-14 Auth Refresh And Logout Endpoint Update

- Added refresh-token session management endpoints in auth module:
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- Implemented refresh token rotation flow in `src/modules/auth/service.ts`:
  - Reads refresh token from httpOnly cookie.
  - Verifies JWT signature and token type (`refresh`).
  - Confirms hashed token exists in DB and is not expired.
  - Rotates token by replacing old hash with new hash in one DB transaction.
  - Issues a new access token and sets a new refresh token cookie.
- Implemented logout flow in `src/modules/auth/service.ts`:
  - Deletes refresh token record by hashed cookie token if present.
  - Returns success response even when cookie is already missing.
- Added auth repository functions in `src/modules/auth/repository.ts`:
  - `findRefreshTokenByHash`
  - `deleteRefreshTokenByHash`
  - `rotateRefreshToken`
  - `findUserAuthById`
- Updated auth controllers in `src/modules/auth/controller.ts`:
  - Added `refreshController` and `logoutController`.
  - Added `clearRefreshCookie` helper with matching cookie options.
- Updated auth routes in `src/modules/auth/route.ts` to mount refresh/logout endpoints.
- Updated `plans/current-plan.md` Phase 5 to include refresh and logout endpoint tasks.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add integration tests for login -> refresh rotation -> logout -> refresh failure flow.

## 2026-05-14 Admin Provider Approval Module And Seeded Admin Update

- Added authentication and role-based authorization middleware in `src/common/middleware/auth.ts`:
  - `requireAuth` validates access token from `Authorization: Bearer ...` and attaches auth context to request.
  - `authorizeRoles("ADMIN")` enforces admin-only route access.
- Added `ForbiddenError` (HTTP 403) in `src/common/errors/app-error.ts` for permission-denied responses.
- Implemented Phase 8 admin provider review module under `src/modules/admin-providers/` with endpoints:
  - `GET /api/admin/providers`
  - `GET /api/admin/providers/:providerId`
  - `PATCH /api/admin/providers/:providerId/approve`
  - `PATCH /api/admin/providers/:providerId/reject`
- Mounted admin provider routes in `src/app.ts` under `/api/admin/providers`.
- Added admin provider list with cursor pagination (`limit`, `cursor`) and optional status filter (`PENDING`, `APPROVED`, `REJECTED`).
- Added admin provider detail response with registration review data:
  - account/location profile,
  - NRC state/township/type/number,
  - verification document URLs,
  - provider services including category, predefined skills, custom skills, and service areas.
- Implemented provider approval workflow:
  - Sets provider status to `APPROVED` and clears rejection reason.
  - Makes provider active services visible (`isVisible: true`).
  - Promotes provider custom skills into global category `Skill` records.
  - Creates missing `ServiceSkill` links and removes promoted `ServiceCustomSkill` rows.
- Implemented provider rejection workflow:
  - Requires `rejectionReason`.
  - Sets provider status to `REJECTED`.
  - Keeps provider services hidden (`isVisible: false`).
  - Does not promote custom skills.
- Updated seed flow in `prisma/seed.ts` for option-1 admin provisioning:
  - Added environment-driven admin seed (`ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PHONE`, `ADMIN_PASSWORD`).
  - Upserts admin user with role `ADMIN` and deterministic default location coordinates.
  - Validates that all admin env keys are provided together when any are set.
- Updated `plans/current-plan.md` Phase 8 notes to include admin detail review and custom-skill promotion behavior.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add auth/admin integration tests for protected admin endpoints and approval/rejection transitions.

## 2026-05-14 Express 5 Query Validation Compatibility Fix

- Fixed request validation middleware incompatibility with Express 5 getter-only `req.query`.
- Updated `src/common/middleware/validate-request.ts`:
  - Added request augmentation field `req.validated` to store parsed `body`, `params`, and `query` from Zod.
  - Removed direct assignment to `req.query` to avoid runtime error: `Cannot set property query of #<IncomingMessage> which has only a getter`.
- Updated admin provider list controller in `src/modules/admin-providers/controller.ts` to consume parsed query from `req.validated.query`.
- This preserves cursor pagination defaults from schema validation (for example `limit` defaults to `20` when omitted).
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-14 Admin Email-Only Login Endpoint Update

- Added dedicated admin authentication endpoint `POST /api/auth/login/admin` in `src/modules/auth/route.ts`.
- Added admin login validation schema in `src/modules/auth/validation.ts`:
  - Accepts `email` and `password` only.
  - No `emailOrPhone` field for admin login flow.
- Added `loginAdmin` service in `src/modules/auth/service.ts`:
  - Looks up user by email only.
  - Enforces user role must be `ADMIN`.
  - Verifies password and issues normal auth tokens.
- Added `findUserByEmail` repository helper in `src/modules/auth/repository.ts`.
- Added `adminLoginController` in `src/modules/auth/controller.ts` with same refresh-cookie behavior and response shape.
- Updated general `POST /api/auth/login` behavior to reject admin users and direct them to the admin login endpoint.
- Updated `plans/current-plan.md` to include admin email-only login endpoint.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-14 Admin Login Strict Rate-Limit Update

- Added dedicated strict rate limiter for `POST /api/auth/login/admin` in `src/modules/auth/route.ts`.
- Admin login limiter configuration:
  - `windowMs`: 15 minutes
  - `limit`: 5 attempts per IP per window
  - `standardHeaders`: `draft-8`
  - `legacyHeaders`: `false`
  - custom JSON message: `Too many admin login attempts. Please try again later`
- Kept existing global API rate limiter unchanged.
- Updated `plans/current-plan.md` to record strict admin-login rate limiting requirement.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-14 Phase 9 Services Module Implementation Update

- Added new provider-owned services module under `src/modules/services/`:
  - `route.ts`
  - `controller.ts`
  - `service.ts`
  - `repository.ts`
  - `validation.ts`
- Added provider-only protected service endpoints (Phase 9):
  - `GET /api/provider/services`
  - `POST /api/provider/services`
  - `GET /api/provider/services/:serviceId`
  - `PATCH /api/provider/services/:serviceId`
  - `PATCH /api/provider/services/:serviceId/activate`
  - `PATCH /api/provider/services/:serviceId/deactivate`
- Mounted services router in `src/app.ts` under `/api/provider/services`.
- Added role-protected service access with existing auth middleware (`requireAuth` + `authorizeRoles("PROVIDER")`).
- Implemented provider service business rules in `src/modules/services/service.ts`:
  - Only providers can manage own services.
  - `REJECTED` providers cannot create new services.
  - `PENDING` providers can create services but they remain hidden (`isVisible: false`).
  - `APPROVED` providers create/activate visible services.
  - Category existence and category-skill consistency are enforced.
  - At least one predefined or custom skill is required.
  - Service areas are validated against provider city.
  - Deactivate always sets `isActive: false` and `isVisible: false`.
  - Activate sets `isActive: true`; visibility depends on provider status.
- Added cursor pagination for provider service list with schema defaults (`limit` default 20, max 50).
- Added reusable service-area validation utility in `src/common/utils/service-areas.ts`.
- Refactored provider registration service (`src/modules/auth/service.ts`) to use the shared service-area validator.
- Kept Phase 9 custom-skill behavior service-specific for newly created services (no automatic global promotion in this phase).
- Updated `plans/current-plan.md` Phase 9 notes with concrete endpoint list and custom-skill rule.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add provider service integration tests for create/list/update/activate/deactivate ownership and visibility status behavior.

## 2026-05-14 Provider Approval-Gated Service Access And Resubmit Flow Update

- Extended auth response user shape for providers by adding optional provider review fields:
  - `providerStatus` (`PENDING`, `APPROVED`, `REJECTED`)
  - `rejectionReason`
- Updated auth data flow:
  - Added `findProviderProfileAuthByUserId` in `src/modules/auth/repository.ts`.
  - Updated `src/modules/auth/service.ts` login and provider registration responses to include provider status context.
  - Updated login message in `src/modules/auth/controller.ts`:
    - `PENDING` => waiting for admin approval
    - `REJECTED` => rejected, prompt resubmission
- Tightened provider service access control in `src/modules/services/service.ts`:
  - Added provider-status gate requiring `APPROVED` for service list/detail/create/update/activate/deactivate.
  - `PENDING` and `REJECTED` provider accounts now receive explicit forbidden messages for provider service management.
- Added rejected-provider resubmit module under `src/modules/providers/`:
  - `validation.ts`
  - `repository.ts`
  - `service.ts`
  - `controller.ts`
  - `route.ts`
- Added new endpoint:
  - `PATCH /api/provider/resubmit` (multipart, provider-authenticated)
- Resubmit behavior implemented:
  - Only `REJECTED` providers can resubmit.
  - Re-validates NRC/category/skills/service areas and location.
  - Requires NRC front/back/selfie images and validates signatures.
  - Updates provider profile, user location, and provider verification documents.
  - Updates or creates first service and replaces its skills/custom skills/service areas.
  - Resets provider status to `PENDING` and clears rejection reason.
  - Forces all provider services to remain hidden (`isVisible: false`) for re-review.
  - Cleans up old and replaced Cloudinary document assets safely.
- Mounted providers router in `src/app.ts` under `/api/provider`.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add resubmit integration tests for rejected-only access, status reset, and hidden-service behavior.

## 2026-05-14 Shared Validation And Rule Deduplication Refactor

- Refactored repeated parsing/validation logic into shared common utilities:
  - Added `src/common/validation/preprocess.ts` with:
    - `parseStringArrayInput`
    - `parseJsonObjectInput`
    - `parseRequiredNumberInput`
  - Added `src/common/validation/location.ts` with shared `coordinateLocationSchema`.
  - Added `src/common/utils/lists.ts` with shared `normalizeStringList`.
  - Added `src/common/utils/skills.ts` with shared `assertSkillSelection`.
- Refactored provider verification upload/signature logic into shared helper:
  - Added `src/common/utils/provider-verification.ts`.
  - Centralized file extraction, existence check, signature validation, and upload cleanup handling.
  - Updated both provider registration (`src/modules/auth/service.ts`) and rejected-provider resubmit (`src/modules/providers/service.ts`) to use shared helper.
- Added shared reference-data repository helpers in `src/common/repositories/reference.ts`:
  - `hasCategory`
  - `countSkillsByCategory`
  - `hasNrcState`
  - `hasNrcTownshipInState`
- Updated modules to consume shared helpers and removed duplicated local/repository implementations:
  - `src/modules/auth/validation.ts`
  - `src/modules/services/validation.ts`
  - `src/modules/providers/validation.ts`
  - `src/modules/auth/service.ts`
  - `src/modules/services/service.ts`
  - `src/modules/providers/service.ts`
  - Removed now-redundant duplicated functions from `src/modules/auth/repository.ts`, `src/modules/services/repository.ts`, and `src/modules/providers/repository.ts`.
- Removed unused `ProviderRegistrationFiles` type from `src/modules/auth/types.ts` after moving to shared provider-verification helper.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add unit tests around shared preprocess and provider-verification helpers to prevent regression across auth/providers/services modules.

## 2026-05-14 Service Area Count + Service Limit + Category Consistency Update

- Added shared service-area count cap constant in `src/common/constants/service-areas.ts`:
  - `MAX_SERVICE_AREAS_PER_SERVICE = 10`
- Hardened service-area normalization/validation in `src/common/utils/service-areas.ts`:
  - Normalizes and deduplicates selected areas before validation.
  - Enforces at least one service area.
  - Enforces max of 10 service areas with clear validation message.
  - Keeps city allowlist validation behavior unchanged.
- Applied service-area max validation at schema level for faster feedback in:
  - `src/modules/auth/validation.ts`
  - `src/modules/services/validation.ts`
  - `src/modules/providers/validation.ts`
- Added shared provider active-service cap constant in `src/common/constants/services.ts`:
  - `MAX_ACTIVE_SERVICES_PER_PROVIDER = 5`
- Added provider service constraints query in `src/modules/services/repository.ts`:
  - active service count,
  - primary category from earliest provider service.
- Enforced service business limits in `src/modules/services/service.ts`:
  - blocks create when provider already has 5 active services,
  - blocks create/update when category does not match provider primary category,
  - keeps existing approved-provider gate and other validation rules.
- Updated `plans/current-plan.md` Phase 9 to include:
  - service area count cap,
  - max active services,
  - single-category consistency.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add integration tests for active-service cap and category-consistency rejection paths.

## 2026-05-14 Option A Alignment: Primary Category + Category Change Requests

- Added schema support for provider primary category and admin-reviewed category/job changes:
  - Added `ProviderProfile.primaryCategoryId` with relation to `Category`.
  - Added `CategoryChangeRequestStatus` enum.
  - Added `ProviderCategoryChangeRequest` model with:
    - provider/current category/requested category links,
    - requested predefined/custom skills,
    - requested price/experience,
    - reason,
    - status and admin rejection reason,
    - review timestamps.
  - Added migration: `prisma/migrations/20260514173000_provider_primary_category_and_change_requests/migration.sql`.
  - Migration backfills `primaryCategoryId` from provider's earliest service category.
- Updated provider registration/resubmit to maintain primary category:
  - `registerProviderWithFirstService` now sets `primaryCategoryId` from initial category.
  - Resubmit flow now resets `primaryCategoryId` to submitted category when provider resubmits after rejection.
- Added provider login gating per updated flow in `src/modules/auth/service.ts`:
  - `PENDING` providers cannot login via normal provider login.
  - `APPROVED` providers can login normally.
  - `REJECTED` providers can login to resubmit flow context.
- Added provider category change request module under `src/modules/category-change-requests/`:
  - `validation.ts`
  - `repository.ts`
  - `service.ts`
  - `controller.ts`
  - `provider-route.ts`
  - `admin-route.ts`
- Added provider request endpoint:
  - `POST /api/provider/category-change-requests`
  - Rules enforced:
    - provider must be `APPROVED`,
    - requested category must differ from current primary category,
    - only one pending request at a time,
    - predefined skills must belong to requested category,
    - at least one predefined/custom skill required.
- Added admin review endpoints:
  - `GET /api/admin/category-change-requests`
  - `GET /api/admin/category-change-requests/:requestId`
  - `PATCH /api/admin/category-change-requests/:requestId/approve`
  - `PATCH /api/admin/category-change-requests/:requestId/reject`
- Approval behavior implemented:
  - sets request status to `APPROVED`,
  - updates provider `primaryCategoryId`,
  - updates provider's earliest service profile category/price/experience,
  - replaces service predefined/custom skills with request payload.
- Rejection behavior implemented:
  - sets request status to `REJECTED`,
  - persists admin rejection reason,
  - keeps provider current category unchanged.
- Mounted new routers in `src/app.ts`:
  - `/api/provider/category-change-requests`
  - `/api/admin/category-change-requests`
- Regenerated Prisma client with `npm run prisma:generate`.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: align frontend provider experience to new category change request flow and hide direct cross-category provider service edits.

## 2026-05-14 Active Service Cap Tuning Update

- Adjusted provider active-service cap from `5` to `3` for tighter MVP quality control.
- Updated shared constant in `src/common/constants/services.ts`:
  - `MAX_ACTIVE_SERVICES_PER_PROVIDER = 3`
- Updated Phase 9 plan note in `plans/current-plan.md` to reflect the new limit.

## 2026-05-14 Provider Resubmit Data Read Endpoint Update

- Added provider-only endpoint `GET /api/provider/resubmit-data` in `src/modules/providers/route.ts`.
- Endpoint access rules implemented in service layer:
  - Allows provider statuses `PENDING` and `REJECTED`.
  - Blocks `APPROVED` providers with `403`.
- Added new provider controller `getProviderResubmitDataController` in `src/modules/providers/controller.ts`.
- Added new service function `getProviderResubmitData` in `src/modules/providers/service.ts` that:
  - Loads provider registration/resubmit data from existing canonical tables.
  - Returns frontend-prefill response with `account`, `form`, `documents`, `providerStatus`, and `rejectionReason`.
  - Returns `404` when provider profile is missing and `409` when provider service profile is not configured.
- Added repository query `findProviderResubmitDataByUserId` in `src/modules/providers/repository.ts` that selects:
  - provider profile + status/NRC/about fields,
  - provider user account/location fields,
  - earliest provider service profile,
  - service predefined/custom skills and service areas,
  - provider verification document URLs.
- Response mapping normalizes numeric fields (`latitude`, `longitude`, `price`) and keeps document URLs nullable for preview-friendly frontend rendering.

## 2026-05-14 Category-Change Title Support And Service-Create Endpoint Disable Update

- Added category-change request title support in Prisma schema:
  - Added `ProviderCategoryChangeRequest.title` in `prisma/schema.prisma`.
  - Added migration `prisma/migrations/20260514193000_add_title_to_provider_category_change_request/migration.sql`.
  - Migration backfills existing request titles from each provider's earliest service profile title, with safe fallback value `Service Profile`.
- Updated category-change request validation in `src/modules/category-change-requests/validation.ts`:
  - `title` is now required (`3..120` characters) when provider submits category/job change request.
- Updated category-change request workflow logic:
  - `src/modules/category-change-requests/service.ts` now persists requested title from provider input.
  - `src/modules/category-change-requests/repository.ts` now stores/selects request title for admin list/detail reads.
  - Approval flow now applies requested title to provider service profile alongside category/skills/price/experience.
- Disabled provider add-service endpoint in current MVP flow:
  - Removed `POST /api/provider/services` route wiring from `src/modules/services/route.ts`.
  - Kept provider service read/update/activate/deactivate endpoints.
- Updated plan notes in `plans/current-plan.md` to reflect:
  - provider service edit-only behavior,
  - removal of provider add-service endpoint from active endpoint list,
  - category/job change request now includes requested service title.

## 2026-05-14 Phase 10 Public Service Search And Discovery Update

- Added public service discovery endpoint:
  - `GET /api/services`
- Implemented public search query validation in `src/modules/services/validation.ts` with support for:
  - text search (`q`),
  - category filter,
  - predefined skill filter,
  - township/service-area filter,
  - price range,
  - minimum provider rating,
  - availability,
  - providers with no completed services,
  - cursor pagination,
  - sorting by recent service, recent provider, lowest price, highest price, and nearest distance.
- Added `src/modules/services/public-route.ts` and mounted it in `src/app.ts` under `/api/services`.
- Implemented public search repository flow in `src/modules/services/repository.ts`:
  - Always filters to active and visible services.
  - Always requires provider profile status `APPROVED`.
  - Uses parameterized raw SQL for filter composition, distance sorting, and stable cursor pagination.
  - Hydrates selected services with Prisma selects for response shaping.
- Added public service-card mapping in `src/modules/services/service.ts` with:
  - provider summary,
  - category,
  - predefined/custom skills,
  - service areas,
  - optional `distanceKm` when coordinates are supplied.
- Hardened public search cursor handling so malformed/oversized cursors are rejected and pagination metadata never reports `hasNextPage: true` without a usable cursor.
- Fixed service update visibility preservation so ordinary provider service edits do not accidentally re-expose an intentionally hidden service.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add integration tests for public search filters, visibility/approval constraints, nearest sorting, and cursor pagination.

## 2026-05-15 Public Discovery Sort Verification + Admin Newest-First List Update

- Updated admin provider list default ordering to newest-first in `src/modules/admin-providers/repository.ts`:
  - Changed list ordering from `id ASC` to `createdAt DESC, id ASC`.
  - Kept existing cursor pagination shape (`cursor` UUID + `skip: 1`) for API compatibility.
- Updated admin category-change request list default ordering to newest-first in `src/modules/category-change-requests/repository.ts`:
  - Changed list ordering from `id ASC` to `createdAt DESC, id ASC`.
  - Kept existing cursor pagination shape (`cursor` UUID + `skip: 1`) for API compatibility.
- Added Jest-based test infrastructure:
  - Added `jest.config.cjs`.
  - Updated `package.json` test script to `jest`.
  - Added test dependencies (`jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`).
- Added targeted tests for requested sorting behavior:
  - `tests/modules/services/public-discovery-sorting.test.ts`
    - verifies default public sort is `recent`.
    - verifies lowest-price flow (`price_asc`).
    - verifies highest-price flow (`price_desc`).
    - verifies `provider_recent` and `nearest` sort flows are accepted and passed through.
    - verifies cursor-sort mismatch is rejected.
  - `tests/modules/admin-providers/repository-sort.test.ts`
    - verifies admin provider list uses `createdAt DESC, id ASC`.
    - verifies cursor pagination arguments remain applied.
  - `tests/modules/category-change-requests/repository-sort.test.ts`
    - verifies category-change request list uses `createdAt DESC, id ASC`.
    - verifies cursor pagination arguments remain applied.
- Verified test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-15 Public Search Param And Text-Matching Refinement Update

- Updated public services query parameter naming in `src/modules/services/validation.ts`:
  - Replaced `q` with `search` for clearer API semantics.
  - Kept strict query validation so unsupported keys (including legacy `q`) are rejected.
- Updated service-layer search wiring in `src/modules/services/service.ts`:
  - Forwarded `query.search` into repository search filters.
- Refined text-search matching behavior in `src/modules/services/repository.ts`:
  - Removed description/body text search from `Service.description`.
  - Kept matching by service title, provider username, and category name.
  - Added matching by predefined skill name (`ServiceSkill -> Skill.name`).
  - Added matching by custom skill name (`ServiceCustomSkill.name`).
- Updated public discovery tests in `tests/modules/services/public-discovery-sorting.test.ts`:
  - Added schema-level assertion that `search` is accepted and legacy `q` is rejected.
  - Added service-level assertion that `search` text is forwarded to repository filters.
- Updated existing listPublicServices input fixtures from `q` to `search`.
- Verified test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-15 Phase 11 Bookings Module Implementation Update

- Added new bookings module under `src/modules/bookings/`:
  - `route.ts`
  - `controller.ts`
  - `service.ts`
  - `repository.ts`
  - `validation.ts`
- Mounted bookings router in `src/app.ts` under `/api/bookings`.
- Added booking lifecycle endpoints:
  - `POST /api/bookings` (customer only)
  - `GET /api/bookings` (customer/provider own bookings with cursor pagination)
  - `GET /api/bookings/:bookingId` (customer/provider own booking detail)
  - `PATCH /api/bookings/:bookingId/accept` (provider only)
  - `PATCH /api/bookings/:bookingId/reject` (provider only)
  - `PATCH /api/bookings/:bookingId/cancel` (customer only)
  - `PATCH /api/bookings/:bookingId/complete` (provider only)
- Implemented booking creation rules:
  - Requires `serviceId`.
  - Optional `note` and optional `scheduledAt`.
  - Rejects booking own service.
  - Allows booking only when service is active, visible, available, and owned by an approved provider.
  - Rejects non-future `scheduledAt` values.
- Implemented role/ownership-restricted booking state transitions:
  - `PENDING -> ACCEPTED` (provider owner only)
  - `PENDING -> REJECTED` (provider owner only)
  - `PENDING -> CANCELLED` (customer owner only)
  - `ACCEPTED -> COMPLETED` (provider owner only)
  - Invalid transitions return HTTP `409`.
- Implemented chat bootstrap linkage for Phase 12 readiness:
  - On booking accept, creates chat room via `ChatRoom` upsert using `bookingId`.
- Added bookings list cursor pagination with stable newest-first ordering:
  - Order by `createdAt DESC, id ASC`.
  - Opaque base64 cursor carries `createdAt + id`.
- Verified existing test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-15 Phase 13 Reviews Module Implementation Update

- Added reviews module under `src/modules/reviews/`:
  - `validation.ts`
  - `repository.ts`
  - `service.ts`
  - `controller.ts`
  - `route.ts`
- Mounted review routes in `src/app.ts`:
  - `POST /api/bookings/:bookingId/review`
  - `GET /api/services/:serviceId/reviews`
  - `GET /api/provider/reviews`
- Implemented review creation business rules in service layer:
  - Only authenticated customers can create reviews.
  - Customer can review only own booking.
  - Booking must exist and be `COMPLETED`.
  - Enforced one review per booking (rejects duplicate review attempts).
  - Rejected/cancelled/pending/accepted bookings cannot be reviewed.
- Implemented review validation:
  - `rating` must be whole number between `1` and `5`.
  - `comment` optional, trimmed, max `1000` chars.
- Implemented review list endpoints with cursor pagination:
  - Service reviews list sorted by `createdAt DESC, id ASC`.
  - Provider reviews list sorted by `createdAt DESC, id ASC`.
  - Opaque base64 cursor uses `createdAt + id`.
  - Service reviews endpoint returns `404` when service is not found.
- Implemented provider rating aggregate updates after review creation:
  - Recomputes provider average rating and rating count from `Review` table.
  - Updates `ProviderProfile.ratingAverage` and `ProviderProfile.ratingCount` in transaction with review creation.
- Added role-specific authorization messages:
  - `Only customers can create reviews`
  - `Only providers can view provider reviews`
- Verified existing test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add integration tests later for review creation constraints, duplicate-review rejection, and provider aggregate update correctness.
- Newly discovered task: add booking integration tests later (customer booking, provider accept/reject, cancel/complete transitions, ownership checks, and chat-room creation on accept).

## 2026-05-15 Booking Authorization Message Clarity Update

- Improved role-denied error message readability for booking endpoints.
- Extended `authorizeRoles` middleware in `src/common/middleware/auth.ts` to accept an optional per-route custom forbidden message while preserving existing default behavior (`Insufficient permissions`) for routes that do not provide a custom message.
- Updated booking route role guards in `src/modules/bookings/route.ts` with action-specific messages:
  - `POST /api/bookings` => `Only customers can create bookings`
  - `GET /api/bookings` and `GET /api/bookings/:bookingId` => `Only customers and providers can view bookings`
  - `PATCH /api/bookings/:bookingId/accept` => `Only providers can accept bookings`
  - `PATCH /api/bookings/:bookingId/reject` => `Only providers can reject bookings`
  - `PATCH /api/bookings/:bookingId/cancel` => `Only customers can cancel bookings`
  - `PATCH /api/bookings/:bookingId/complete` => `Only providers can complete bookings`
- Confirmed booking list default sorting behavior remains unchanged for both customer and provider views:
  - `createdAt DESC, id ASC`
- Verified existing test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-15 Phase 12 Chat Module Implementation Update

- Added chat module under `src/modules/chat/`:
  - `validation.ts`
  - `repository.ts`
  - `service.ts`
  - `controller.ts`
  - `route.ts`
  - `socket.ts`
- Mounted chat router in `src/app.ts` under `/api/chats`.
- Added chat REST endpoints (customer/provider only):
  - `GET /api/chats/bookings/:bookingId`
  - `GET /api/chats/bookings/:bookingId/messages`
  - `POST /api/chats/bookings/:bookingId/messages`
- Implemented chat access controls:
  - Only booking participants (customer or provider) can access chat room/messages.
  - Read access allowed only when booking status is `ACCEPTED` or `COMPLETED`.
  - Send access allowed only when booking status is `ACCEPTED`.
- Implemented message persistence and pagination:
  - Messages stored in `Message` table.
  - Cursor pagination for message list with ordering `createdAt DESC, id ASC`.
  - Opaque base64 cursor uses `createdAt + id`.
- Implemented chat room lifecycle handling:
  - Uses existing booking-linked `ChatRoom` model.
  - Creates room on-demand via upsert if accepted/completed booking has no room.
- Integrated Socket.IO real-time chat:
  - Added `socket.io` dependency.
  - Initialized Socket.IO in `src/server.ts` with CORS aligned to API CORS origins.
  - Added socket auth using access token from handshake auth token or bearer header.
  - Added events:
    - `chat:join`
    - `chat:leave`
    - `chat:send`
    - `chat:message`
    - `chat:error`
  - Room naming uses booking channel pattern `booking:{bookingId}`.
  - HTTP message send endpoint also emits `chat:message` to Socket.IO room.
  - Added graceful Socket.IO shutdown in server shutdown flow.
- Verified existing test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.
- Newly discovered task: add chat integration tests later for participant-only access, accepted/completed status gates, and socket event flow.

## 2026-05-15 Chat Socket Hardening And WebSocket Best-Practice Cleanup

- Hardened Socket.IO server configuration in `src/modules/chat/socket.ts`:
  - Added explicit heartbeat/connection settings:
    - `pingTimeout: 20000`
    - `pingInterval: 25000`
  - Added websocket payload guard:
    - `maxHttpBufferSize: 10000`
- Tightened socket-role authorization at handshake:
  - Rejects non-chat roles before connection is established.
  - Allows only `CUSTOMER` and `PROVIDER` socket identities for chat.
- Added per-socket message rate limiting (MVP in-memory):
  - `30` `chat:send` events per minute per socket.
  - Emits `chat:error` and ack error message when exceeded.
  - Cleans per-socket limiter state on disconnect.
- Added acknowledgment support for socket events:
  - `chat:join`, `chat:leave`, and `chat:send` now support optional callback ack payloads:
    - success shape: `{ success: true, data: ... }`
    - failure shape: `{ success: false, error: ... }`
- Fixed send-flow reliability behavior:
  - `chat:send` now requires the socket to have joined the booking room first.
  - Returns clear error (`Join chat before sending messages`) if not joined.
  - This avoids silent UX mismatch where message persistence succeeds but sender is not room-subscribed to receive broadcast.
- Kept existing participant authorization and booking status checks intact in chat service:
  - Read: `ACCEPTED` / `COMPLETED`
  - Send: `ACCEPTED` only
- Verified existing test suite successfully with `npm test`.
- Verified TypeScript build successfully with `npm run build`.

## 2026-05-15 Provider Service Category Edit Restriction Alignment Update

- Aligned provider service edit flow with updated product rule: providers can edit all service profile fields except category.
- Updated provider service update validation in `src/modules/services/validation.ts`:
  - Removed `categoryId` from `updateProviderServiceSchema` so `PATCH /api/provider/services/:serviceId` cannot accept direct category changes.
- Updated provider service update business logic in `src/modules/services/service.ts`:
  - Removed category-change branch logic from normal service update flow.
  - Kept skill-category validation bound to the existing service category.
  - Kept category/job switching delegated to admin-reviewed category-change request workflow.
- Updated plan wording in `plans/current-plan.md` Phase 9 to reflect no direct category edit in provider service updates.

## 2026-05-15 Booking Schedule Requirement + Dashboard API Implementation Update

- Updated booking creation validation to require `scheduledAt` date-time in `src/modules/bookings/validation.ts`.
- Updated booking creation service flow in `src/modules/bookings/service.ts` to always parse and validate `scheduledAt` as future time.
- Added booking reschedule endpoint for customers:
  - `PATCH /api/bookings/:bookingId/reschedule`
  - Allowed only for booking owner customer and only when booking status is `ACCEPTED`.
  - Enforces new `scheduledAt` must be a valid future ISO datetime.
- Added booking reschedule controller/repository wiring in:
  - `src/modules/bookings/controller.ts`
  - `src/modules/bookings/repository.ts`
  - `src/modules/bookings/route.ts`
- Added new dashboard module under `src/modules/dashboards/`:
  - `validation.ts`
  - `repository.ts`
  - `service.ts`
  - `controller.ts`
  - `route.ts`
- Added customer dashboard endpoints:
  - `GET /api/customer/dashboard`
  - `GET /api/customer/dashboard/bookings` (filters: `ALL`, `SAVED`, `COMPLETED`, `CANCELLED`)
  - `GET /api/customer/saved-services`
  - `POST /api/customer/saved-services/:serviceId`
  - `DELETE /api/customer/saved-services/:serviceId`
- Added provider dashboard endpoints:
  - `GET /api/provider/dashboard`
  - `GET /api/provider/dashboard/bookings` (filters: `ALL`, `REQUESTED`, `ONGOING`, `COMPLETED`, `CANCELLED`)
  - `GET /api/provider/dashboard/active-jobs`
  - `POST /api/provider/dashboard/customers/:customerId/pin`
  - `DELETE /api/provider/dashboard/customers/:customerId/pin`
  - `DELETE /api/provider/dashboard/history`
- Added dashboard persistence models in Prisma schema and migration:
  - `CustomerSavedService`
  - `ProviderPinnedCustomer`
  - `ProviderArchivedBooking`
  - Migration: `prisma/migrations/20260515123000_add_dashboard_support_models/migration.sql`
- Mounted dashboard routers in `src/app.ts` under `/api/customer` and `/api/provider`.
- Updated current implementation plan with booking schedule/reschedule and dashboard phase additions in `plans/current-plan.md`.
- Regenerated Prisma client successfully with `npm run prisma:generate`.
- Verified TypeScript build successfully with `npm run build`.
- Verified test suite successfully with `npm test`.
- Newly discovered task: add integration tests for dashboard filters, saved-service flow, pinned-customer priority behavior, and provider history archive visibility.
- Newly discovered task: run `npm run prisma:migrate` against target database environments to apply dashboard support migration.

## 2026-05-15 Provider Dashboard Client-Centric Route And Response Alignment Update

- Aligned provider dashboard API semantics from booking-centric to client-centric flow.
- Kept booking resource endpoint design unchanged as best practice:
  - `GET /api/bookings/:bookingId` remains shared for customer/provider with strict ownership checks.
- Renamed provider dashboard list endpoint:
  - from `GET /api/provider/dashboard/bookings`
  - to `GET /api/provider/dashboard/clients`
- Renamed provider pin endpoints:
  - from `/api/provider/dashboard/customers/:customerId/pin`
  - to `/api/provider/dashboard/clients/:customerId/pin`
- Renamed provider history clear endpoint:
  - from `DELETE /api/provider/dashboard/history`
  - to `DELETE /api/provider/dashboard/clients/history`
- Refactored provider dashboard listing logic in `src/modules/dashboards/service.ts`:
  - Replaced booking-row response with one card per client.
  - Each client card now includes customer summary, latest booking summary, service summary, and per-status counts.
  - Added unique-client pagination flow that deduplicates by customer from newest provider bookings.
- Added grouped status-count query helper in `src/modules/dashboards/repository.ts`:
  - `listProviderClientStatusCounts` using Prisma `groupBy` for client-level counts.
- Updated provider dashboard route/controller/validation naming:
  - `providerDashboardClientsSchema`
  - `ProviderDashboardClientsQuery`
  - `listProviderDashboardClientsController`
  - `listProviderDashboardClients`
- Updated current plan wording in `plans/current-plan.md` to explicitly call this a provider dashboard client filter endpoint.

## 2026-05-15 Provider Dashboard Filter Alignment With Frontend Tabs Update

- Aligned provider dashboard client filters to frontend tabs by removing `REQUESTED` and adding `PINNED` in `src/modules/dashboards/validation.ts`.
- Updated provider client filter options to:
  - `ALL`
  - `ONGOING`
  - `COMPLETED`
  - `CANCELLED`
  - `PINNED`
- Refactored provider dashboard service in `src/modules/dashboards/service.ts`:
  - Replaced `REQUESTED` tab mapping logic with pinned-only filter behavior for `PINNED`.
  - Kept pending booking requests as separate dashboard data section.
  - Added `newBookingRequests` response section in `GET /api/provider/dashboard` from latest pending booking requests.
- Extended provider booking chunk repository query in `src/modules/dashboards/repository.ts` with optional `pinnedOnly` filtering.
- Kept provider client list route unchanged as client-focused endpoint:
  - `GET /api/provider/dashboard/clients`
- Kept booking resource detail endpoint unchanged as shared canonical endpoint:
  - `GET /api/bookings/:bookingId`
- Updated implementation plan in `plans/current-plan.md` to reflect:
  - provider client filter tabs including `PINNED`,
  - pending requests shown in separate new-booking-request section.

## 2026-05-15 Provider Reusable Client Listing Endpoint Update

- Added provider reusable client listing query schema in `src/modules/dashboards/validation.ts`:
  - `providerClientsSchema`
  - Supports query params:
    - `status` (`ONGOING`, `COMPLETED`, `CANCELLED`)
    - `pinned` (`true` or `false`)
    - `cursor`, `limit`
- Added provider reusable client listing service flow in `src/modules/dashboards/service.ts`:
  - `listProviderClients`
  - Reuses existing unique-client pagination and client-card response mapping.
  - Reuses grouped client status counts for `stats` fields in each client card.
- Added provider reusable client listing controller in `src/modules/dashboards/controller.ts`:
  - `listProviderClientsController`
- Added provider reusable endpoint route in `src/modules/dashboards/route.ts`:
  - `GET /api/provider/clients`
- Kept dashboard-specific endpoints unchanged for current frontend integration:
  - `GET /api/provider/dashboard`
  - `GET /api/provider/dashboard/clients`
  - `GET /api/provider/dashboard/active-jobs`
- Updated implementation plan in `plans/current-plan.md` to include `GET /api/provider/clients` as reusable provider client API.

## 2026-05-15 Provider Clients Endpoint Consolidation Update

- Consolidated provider client listing to a single frontend-aligned dashboard endpoint to avoid duplicate API shapes.
- Removed reusable provider clients endpoint `GET /api/provider/clients` from `src/modules/dashboards/route.ts`.
- Removed now-unused reusable provider clients validation and types from `src/modules/dashboards/validation.ts`:
  - `providerClientsSchema`
  - `ProviderClientsQuery`
- Removed now-unused reusable provider clients service/controller flow:
  - `listProviderClients` from `src/modules/dashboards/service.ts`
  - `providerStatusToOptions` helper from `src/modules/dashboards/service.ts`
  - `listProviderClientsController` from `src/modules/dashboards/controller.ts`
- Kept provider client filtering via the single dashboard endpoint:
  - `GET /api/provider/dashboard/clients?filter=ALL|ONGOING|COMPLETED|CANCELLED|PINNED`
- Kept pending customer booking requests in separate provider dashboard section:
  - `GET /api/provider/dashboard` returns `newBookingRequests`.
- Updated `plans/current-plan.md` to remove reusable `GET /api/provider/clients` scope.

## 2026-05-15 Provider Dashboard Summary Metrics Update

- Updated provider dashboard summary metrics in `GET /api/provider/dashboard` to include the requested top-level values:
  - `totalJobs` (all provider jobs/bookings in platform)
  - `reviewsBy` (review count, same source as `ProviderProfile.ratingCount`)
  - `rating.average`
  - `rating.display` (for example `4/5` or `4.4/5`)
- Extended dashboard summary repository query in `src/modules/dashboards/repository.ts`:
  - Added `totalJobs` count query by `providerId`.
  - Added provider profile aggregate lookup (`ratingAverage`, `ratingCount`).
  - Returned `reviewsBy` and `ratingAverage` in dashboard summary aggregate result.
- Updated provider dashboard service mapping in `src/modules/dashboards/service.ts`:
  - Added rating formatter for normalized `average` and `display` values.
  - Added `summary.totalJobs`, `summary.reviewsBy`, and `summary.rating` to response.
- Updated `plans/current-plan.md` Phase 13.1 notes to include required summary metrics.

## 2026-05-15 Provider Requested Bookings Source Consolidation Update

- Removed provider dashboard request-preview payload (`newBookingRequests`) from `GET /api/provider/dashboard` in `src/modules/dashboards/service.ts`.
- Provider dashboard now focuses on summary cards and active-now jobs only.
- Kept `summary.requestedBookings` count in provider dashboard summary for quick overview cards.
- Consolidated requested booking card source to booking module list endpoint with cursor pagination:
  - `GET /api/bookings?status=PENDING&limit=<n>&cursor=<cursor>`
- This removes overlap between dashboard payload and booking-list payload while keeping booking detail/actions unchanged.
- Updated `plans/current-plan.md` Phase 13.1 notes to state booking module pending-list endpoint is the single source for requested booking cards.

## 2026-05-15 Customer Upcoming Bookings Cursor Endpoint Update

- Refactored customer dashboard overview flow so `GET /api/customer/dashboard` returns summary-only data (no embedded upcoming booking list payload).
- Added dedicated customer upcoming booking list endpoint with cursor pagination in `src/modules/dashboards/route.ts`:
  - `GET /api/customer/dashboard/upcoming-bookings`
- Added upcoming booking query validation in `src/modules/dashboards/validation.ts`:
  - `status` supports `ALL`, `ASSIGNED`, `CONFIRMED`, `CANCELLED`.
  - `limit`/`cursor` cursor pagination is enforced.
- Added customer upcoming booking service flow in `src/modules/dashboards/service.ts`:
  - Added `listCustomerUpcomingBookingsForDashboard` with status mapping:
    - `ASSIGNED` -> `PENDING`
    - `CONFIRMED` -> `ACCEPTED`
    - `CANCELLED` -> `CANCELLED`
    - `ALL` -> `PENDING`, `ACCEPTED`, `CANCELLED`
  - Added dedicated upcoming cursor encoding/decoding (`scheduledAt` + `id`) for stable pagination by schedule time.
- Added repository query in `src/modules/dashboards/repository.ts`:
  - `listCustomerUpcomingBookings` ordered by `scheduledAt ASC, id ASC` and constrained to future bookings (`scheduledAt >= now`).
- Updated `plans/current-plan.md` Phase 13.1 notes to reflect summary-only dashboard + separate upcoming list endpoint.

## 2026-05-15 Customer Saved-List Source Consolidation Update

- Removed `SAVED` from customer dashboard booking filter options in `src/modules/dashboards/validation.ts`.
- Updated customer dashboard booking filter endpoint semantics:
  - `GET /api/customer/dashboard/bookings?filter=ALL|COMPLETED|CANCELLED`
- Removed saved-branch handling from `listCustomerDashboardBookings` in `src/modules/dashboards/service.ts`.
- Consolidated saved-service listing to dedicated endpoint only:
  - `GET /api/customer/saved-services`
  - `POST /api/customer/saved-services/:serviceId`
  - `DELETE /api/customer/saved-services/:serviceId`
- This removes overlap between dashboard booking filter response and saved-services response while keeping cursor pagination behavior.
- Updated `plans/current-plan.md` Phase 13.1 notes to remove `SAVED` from dashboard booking filter list.

## 2026-05-15 Customer Dashboard Greeting Profile Update

- Updated `GET /api/customer/dashboard` response to include customer greeting fields for frontend header usage.
- Added customer profile lookup in `src/modules/dashboards/repository.ts`:
  - `findCustomerDashboardProfile` returns `id` and `username`.
- Updated dashboard service mapping in `src/modules/dashboards/service.ts`:
  - `getCustomerDashboard` now returns:
    - `customer.id`
    - `customer.username`
    - existing `summary` counts.
- Added `404` guard in `getCustomerDashboard` when customer profile is missing.
- Updated `plans/current-plan.md` Phase 13.1 notes to include customer greeting data requirement.

## 2026-05-15 Provider Dashboard Greeting Profile Update

- Updated `GET /api/provider/dashboard` response to include provider greeting fields for frontend header usage.
- Extended provider dashboard summary repository query in `src/modules/dashboards/repository.ts`:
  - `getProviderDashboardCounts` now also fetches provider user `id` and `username`.
  - Added `providerUser` to returned aggregate result.
- Updated dashboard service mapping in `src/modules/dashboards/service.ts`:
  - `getProviderDashboard` now returns:
    - `provider.id`
    - `provider.username`
    - existing `summary` counts and `activeNowJobs`.
- Added `404` guard in `getProviderDashboard` when provider user data is missing.
- Updated `plans/current-plan.md` Phase 13.1 notes to include provider greeting data requirement.

## 2026-05-16 Customer And Provider Profile API Update

- Added Phase 13.2 profile/account management scope to `plans/current-plan.md`.
- Added new users module under `src/modules/users/`:
  - `validation.ts`
  - `repository.ts`
  - `service.ts`
  - `controller.ts`
  - `route.ts`
- Added authenticated current-user profile endpoints:
  - `GET /api/users/me`
  - `PATCH /api/users/me`
  - `PATCH /api/users/me/password`
- Current-user profile reads return safe account fields, coordinate-based location, and provider context when the authenticated user is a provider.
- Current-user account edits support `username`, `email`, `phone`, and coordinate-based `location` for non-provider accounts.
- Provider accounts are directed to provider-specific profile update endpoints to avoid unsafe service-area/location changes through the generic user route.
- Password changes now require `currentPassword`, validate the new password with existing auth rules, hash with bcrypt, revoke all refresh-token sessions for that user, and clear the refresh-token cookie.
- Added provider profile endpoints to the existing provider module:
  - `GET /api/provider/profile`
  - `PATCH /api/provider/profile`
  - `PATCH /api/provider/profile/password`
- Provider profile reads return account data, location, provider status/rejection context, provider `about`, rating summary, current service profile summary, NRC reference data, and verification document preview URLs.
- Provider profile updates support `username`, `email`, `phone`, `about`, and coordinate-based `location` for approved providers.
- Provider location updates reverse-geocode coordinates through Mapbox.
- If a provider location update changes detected city, backend now requires replacement `serviceAreas` and validates them against the new city before replacing provider service area records.
- Provider NRC fields and verification documents remain read-only in normal profile APIs; rejected-provider edits continue using the existing resubmit flow.
- Mounted the users router in `src/app.ts` under `/api/users`.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add integration tests for profile read/update/password flows, provider city-change service-area validation, and refresh-token revocation after password change.

## 2026-05-16 Login Contract Alignment Update (Email + Password)

- Updated normal login request validation in `src/modules/auth/validation.ts`:
  - Replaced `emailOrPhone` with `email`.
  - Added strict email format validation and lowercase normalization for login email input.
- Updated normal login service flow in `src/modules/auth/service.ts`:
  - Changed user lookup from mixed email/phone matching to email-only lookup.
  - Kept existing provider/admin role-gating and password verification behavior unchanged.
- Removed now-unused email-or-phone login repository helper from `src/modules/auth/repository.ts`.
- Kept admin login endpoint behavior unchanged (`POST /api/auth/login/admin` remains email + password).
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add auth integration tests for normal login payload validation and ensure legacy `emailOrPhone` payload is rejected with clear validation errors.

## 2026-05-16 Provider Profile NRC-Data Removal Update

- Removed NRC identity data and verification document preview fields from normal provider profile response (`GET /api/provider/profile`).
- Updated provider profile query selection in `src/modules/providers/repository.ts` so provider-profile reads no longer fetch NRC fields/documents for normal profile pages.
- Updated provider profile response mapping in `src/modules/providers/service.ts` by removing the `verification` section from the response payload.
- Kept NRC and verification document data in existing dedicated flows:
  - rejected/pending provider resubmit read endpoint (`GET /api/provider/resubmit-data`)
  - admin provider review endpoints.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.

## 2026-05-16 Chat Inbox Endpoint Update

- Added chat inbox/list endpoint for customer and provider message tabs:
  - `GET /api/chats`
- Added chat inbox query validation in `src/modules/chat/validation.ts`:
  - supports cursor pagination (`cursor`, `limit`).
- Added chat inbox repository query in `src/modules/chat/repository.ts`:
  - `listChatRoomsByActor` with role-based booking ownership filter.
  - Includes only chat-eligible bookings (`ACCEPTED`, `COMPLETED`).
  - Returns room summary with booking/service data, participant summaries, and latest message.
  - Uses stable cursor pagination ordering (`updatedAt DESC, id ASC`).
- Updated message persistence in `src/modules/chat/repository.ts`:
  - `createChatMessage` now also bumps chat-room `updatedAt` in the same transaction so inbox ordering tracks latest chat activity.
- Added chat inbox service/controller flow:
  - `listChatRooms` in `src/modules/chat/service.ts`
  - `listChatRoomsController` in `src/modules/chat/controller.ts`
- Wired the new route in `src/modules/chat/route.ts`:
  - `GET /api/chats`
- Updated plan scope in `plans/current-plan.md` Phase 12 to include a chat inbox/list endpoint requirement.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add chat integration tests for `GET /api/chats` pagination, participant scoping, and latest-message ordering by room activity.

## 2026-05-16 Booking-Request Chat Availability Update

- Updated booking/chat business flow so customer and provider can chat from booking request stage (`PENDING`).
- Updated booking creation flow in `src/modules/bookings/service.ts`:
  - `createBooking` now ensures a chat room is created immediately after booking creation.
  - Removed redundant chat-room creation from booking accept flow because room now exists from create step.
- Updated chat access rules in `src/modules/chat/service.ts`:
  - Readable statuses now include all booking lifecycle statuses (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, `CANCELLED`).
  - Sendable statuses now include `PENDING` and `ACCEPTED`.
  - Updated send/read status error messages to match new behavior.
- Updated chat inbox query scope in `src/modules/chat/repository.ts`:
  - `GET /api/chats` now includes room rows for `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, and `CANCELLED` bookings.
- Updated implementation plan guidance in `plans/current-plan.md`:
  - Phase 11 now states chat room is created on booking request (`PENDING`) for pre-accept discussion.
  - Phase 12 now states one chat room per booking request, read access across lifecycle statuses, and send access for `PENDING`/`ACCEPTED` only.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add integration tests for pending-booking chat send/read behavior and read-only behavior after booking reaches closed statuses.

## 2026-05-16 Chat Typing Indicator And Presence Update

- Added chat typing socket payload validation in `src/modules/chat/validation.ts`:
  - `socketTypingSchema` for `bookingId` + `isTyping` payloads.
- Added chat presence query validation in `src/modules/chat/validation.ts`:
  - `listChatPresenceSchema` for `GET /api/chats/presence` with validated `userIds` array input.
- Extended Socket.IO chat server in `src/modules/chat/socket.ts`:
  - Added in-memory connection presence tracking for chat users.
  - Added `chat:presence` broadcast events when users become online/offline.
  - Added presence state helpers and exported `getChatUsersPresence` for HTTP presence reads.
  - Added `chat:typing` socket event handling with participant/status validation via existing booking-chat authorization logic.
  - `chat:typing` now broadcasts typing state to other users in the joined booking room.
- Added new chat presence HTTP endpoint:
  - `GET /api/chats/presence`
  - Route wired in `src/modules/chat/route.ts`.
  - Controller added in `src/modules/chat/controller.ts`.
  - Endpoint returns per-user online status and `lastSeenAt` values.
- Updated implementation plan Phase 12 in `plans/current-plan.md` to include typing indicator and online/offline presence support.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add integration tests for `chat:typing` event authorization/join-room enforcement and presence transition broadcasts on connect/disconnect.

## 2026-05-16 Chat Unread Count And Mark-As-Read Update

- Added chat read-state persistence model in Prisma schema:
  - `ChatRoomReadState` with composite key (`roomId`, `userId`) and `lastReadAt` timestamp.
  - Added relation fields in `User` and `ChatRoom` models.
- Added SQL migration file:
  - `prisma/migrations/20260516170000_add_chat_room_read_state/migration.sql`
- Regenerated Prisma client successfully with `npm run prisma:generate`.
- Extended chat inbox data flow for unread counts:
  - Added per-actor room read-state selection in `src/modules/chat/repository.ts`.
  - Added unread-count aggregation query `countUnreadMessagesByRoomIdsForActor` in `src/modules/chat/repository.ts`.
  - Updated chat inbox service mapping in `src/modules/chat/service.ts` so `GET /api/chats` now includes `unreadCount` per room row.
- Added mark-as-read endpoint:
  - `PATCH /api/chats/bookings/:bookingId/read`
  - Route wired in `src/modules/chat/route.ts`.
  - Controller added in `src/modules/chat/controller.ts`.
  - Service added in `src/modules/chat/service.ts`.
  - Repository upsert helper added in `src/modules/chat/repository.ts` (`markChatRoomAsReadByUser`).
- Updated implementation plan Phase 12 in `plans/current-plan.md` to include unread count and read-marker endpoint requirements.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add integration tests for unread-count correctness and mark-as-read behavior across customer/provider actors.
- Newly discovered task: run `npm run prisma:migrate` on target database environments to apply chat read-state migration.

## 2026-05-16 Review Flow Alignment Update (Rating-Only + Customer Review List)

- Updated review-create input contract in `src/modules/reviews/validation.ts`:
  - `POST /api/bookings/:bookingId/review` now accepts rating-only payload for current MVP.
  - Deferred create-time comment input to later phase.
- Updated review create service flow in `src/modules/reviews/service.ts`:
  - Removed comment forwarding from create flow.
  - Kept all existing review guards unchanged (completed-only, ownership, one-review-per-booking).
- Added customer review list support:
  - Added repository query `listReviewsByCustomerId` in `src/modules/reviews/repository.ts`.
  - Added service function `listCustomerReviews` in `src/modules/reviews/service.ts`.
  - Added controller `listCustomerReviewsController` in `src/modules/reviews/controller.ts`.
  - Added route `GET /api/customer/reviews` in `src/modules/reviews/route.ts` (customer-only).
  - Added request schema `listCustomerReviewsSchema` in `src/modules/reviews/validation.ts`.
- Wired customer review routes in `src/app.ts` under `/api/customer/reviews`.
- Updated plan guidance in `plans/current-plan.md` Phase 13 to include:
  - rating-focused review creation in MVP,
  - customer review list endpoint scope.
- Verified TypeScript build successfully with `npm run build`.
- Verified existing test suite successfully with `npm test`.
- Newly discovered task: add review integration tests for customer review list pagination and rating-only create payload validation.

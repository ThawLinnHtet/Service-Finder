# AGENTS.md (Backend Only - Express Modular Architecture)

## Project Overview

Project Name:Services Finder (Myanmar Focus)

This document defines the **backend architecture only** using Node.js + Express + Typescript in a modular monolith structure.

The backend powers:

- Authentication (Customer & Provider)
- Service listing system
- Booking system
- Chat system
- Reviews & ratings
- Geo-based nearby provider search
- Mapbox integration
- Reverse geocoding system

---

## Workflow Rules

1. Before implementing:
   - Read `plans/current-plan.md`
   - Read `plans/progress.md`
   - Read all relevant files in `agents/skills`

2. After creating a plan:
   - Save the plan into `plans/current-plan.md`

3. After finishing a task:
   - Update `plans/progress.md`
   - Mark completed tasks
   - Add newly discovered tasks

4. Never overwrite history.
   Append updates instead.

5. Always check completed work before writing new code.

---

## Required Documents

Read these documents to understand the project.

- Read PROJECT.md
- Read ARCHITECTURE.md
- Read BUSINESS_RULES.md

---

## Skill Loading Rules

All skill files are stored in:

.agents/skills/

Before planning or coding, read the relevant skill files from `.agents/skills`.

---

# Backend Architecture Style

## Architecture Type

- Modular Monolith (NOT microservices)
- Feature-based modules
- Service layer pattern (function-based not class-based)

👉 Each feature is isolated inside its own module.

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma
- zod (validation)
- Socket.IO (chat system)
- JWT (access + refresh tokens)
- httpOnly cookies
- bcrypt for password hashing
- Helmet
- CORS
- Rate limiting
- multer + cloudinary(for photo upload)
- MapBox integration
- testing (jest + supertest)
- documentatin(openAPI + swagger)

---

# Folder Structure

```txt
src/
 ├── modules/
 │    ├── auth/
 │    ├── users/
 │    ├── providers/
 │    ├── categories/
 │    ├── skills/
 │    ├── locations/
 │    ├── services/
 │    ├── bookings/
 │    ├── chat/
 │    ├── reviews/
 │    └── recommendations/
 │
 ├── common/
 │    ├── middleware/
 │    ├── utils/
 │    ├── errors/
 │    ├── constants/
 │    └── helpers/
 │
 ├── config/
 ├── docs/
 ├── app.ts
 └── server.ts
```

---

## Code Standards

- Controllers only handle requests/responses
- Business logic in service layer
- Database logic in repository layer
- Keep modules independent
- Use DTO pattern
- Use global error handler, AppError class , global Async handler for clean code
- Keep controllers thin
- Avoid logic inside routes
- Avoid any type for typescript
- Clean and reusable code

---

## Security Rules

- Hash passwords with bcrypt
- JWT authentication required
- Validate all inputs
- Use rate limiting
- Use Helmet middleware
- Never trust frontend data
- Prevent SQL injection

---

# API Design Standards

## REST Principles

- Use nouns, not verbs
- Use proper HTTP methods
- Keep endpoints consistent
- Use versioning if needed (/api/v1)

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "optional message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "error message"
}
```

---

# Authentication Rules

-JWT Strategy
-Access Token (short-lived)
-Refresh Token (long-lived)
-Store tokens in httpOnly cookies

---

# Pagination Rules

-MUST use cursor pagination (preferred)
-Default limit: 10–20 items
-Use default sort as descending if need

Response Format:

```json
{
  "data": [],
  "meta": {
    "nextCursor": "abc123",
    "hasNextPage": true
  }
}
```

---

# Performance Rules

MUST FOLLOW:
-Use cursor pagination for all lists
-Add DB indexes if need:

# Optimization Rules

-Avoid N+1 queries
-Use selective fields (not SELECT \*)
-Cache frequent queries (future phase)

# MVP Success Criteria

Backend is considered complete when:

- Auth works
- Providers can register
- Services can be created
- Bookings work
- Chat works
- Reviews work
- Search works

# Testing Rules

Use:

-Jest
-Supertest

Must test:

-Auth
-Validation
-Protected routes
-Booking flow
-Search/filtering
-Location APIs

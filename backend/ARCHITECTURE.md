# ARCHITECTURE.md

## Overview

This project uses a **Modular Monolith Architecture** built with Node.js, Express, TypeScript, and PostgreSQL.

The system is designed to be:

- scalable
- maintainable
- feature-isolated
- easy to extend

---

## Core Design Principles

- Feature-based modular architecture
- Each module is fully independent
- Separation of concerns (Controller → Service → Repository)
- Stateless backend design
- Strong typing with TypeScript
- No business logic in controllers or routes

---

## High-Level Architecture

Client (Web/Mobile)
↓
Express API Layer
↓
Module Layer (Feature Modules)
↓
Service Layer (Business Logic)
↓
Repository Layer (DB Access)
↓
PostgreSQL Database

---

## Module Structure

Each module MUST follow this structure:

```txt
module/
 ├── controller.ts
 ├── service.ts
 ├── repository.ts
 ├── route.ts
 ├── validation.ts
 ├── dto.ts
 └── types.ts
```

---

##Core Modules

---

1. Auth Module

Handles:

-Registration (customer/provider)
-Login
-JWT authentication
-Refresh tokens
Logout

---

2. Users Module

Handles:

-User profile
-Settings
-Location storage

3. Providers Module

Handles:

-Provider registration
-Verification (NRC + selfie)
-Service areas
-Profile management

4.  Categories Module

Handles:

-Service categories
-Category listing

5. Skills Module

Handles:

-Predefined skills
-Custom skills
-Category-based skills

6. Locations Module (IMPORTANT)

Handles all geo operations:

-Mapbox integration
-Reverse geocoding
-Nearby search
-Distance calculation
-Location Flow:
-User sends lat/lng
-Backend calls Mapbox API
-Extract city + township
-Store structured location

7. Services Module

Handles:

-Service edit after admin approve
-Can change job like category with Change category request form(including Category , skill , experience years , price and reason for change)
-Service search
-Filtering
-Nearby search integration

8. Bookings Module

Handles:

-Booking lifecycle
-Status management
-Provider acceptance

9. Chat Module

Handles:

-Socket.IO chat
-Booking-based rooms
-Message history

10. Reviews Module

Handles:

-Ratings (1–5)
-Review creation after completed booking

11. Service Area System

-Service areas township come from base on providers locations
-Providers define service townships
-Must belong to same city
-Used for filtering search results

12. Geo Strategy

-NEVER rely on text-only location
-Always use lat/lng for:
-search
-filtering
-map rendering
-Use Mapbox for geocoding

13. Nearby Search Logic

-Uses latitude/longitude
-Calculates distance between user and provider
-Returns sorted providers by proximity

14. Location Data Model
    -location {
    city: string,
    township: string,
    address?: string,
    latitude: number,
    longitude: number
    }

15. System Goals

-Clean modular structure
-Easy to scale
-Strong separation of concerns
-Geo-aware marketplace system

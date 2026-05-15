# PROJECT.md

Local Services Finder (Myanmar Focus)

---

## Overview

This is a marketplace platform that connects customers with local service providers in Myanmar.

Users can:

- Search for services (plumber, tutor, cleaner, repair, etc.)
- Book providers
- Chat in real-time
- Leave reviews
- Search nearby providers on map

Providers can:

- Register services
- Manage bookings
- Chat with customers
- Set service areas and pricing
- Display provider location on map

---

## Core Problem

Myanmar currently has no centralized trusted platform for local service discovery. Most services are found through Facebook or word-of-mouth.

This project solves:

- Lack of structured service marketplace
- No trust/review system
- No booking system
- No service area filtering
- No nearby provider discovery system

---

## Service Categories

Initial categories:

- Cleaning Services
- Repair Services
- Building Services
- Education
- Electrical Services
- Moving Services

Each category contains predefined skills.

Examples:

### Education

- Math
- English
- IELTS
- Physics

### Repair Services

- Phone Repair
- Laptop Repair
- TV Repair

Providers can:

- Select multiple predefined skills
- Add custom skills

---

## MVP Scope

### Customer Features

- Register/Login
- Search services with:
  - category
  - provider name
  - skills
- Filter by:
  - township
  - category
  - price (highest/lowest)
  - availability
  - providers with no completed services yet
- Nearby provider search
- Map-based provider discovery
- Book services
- Chat with providers
- Leave reviews

---

## Customer Register Features

- Username
- Email
- Myanmar phone number
- Password
- Current location using Mapbox
- Pin location on map
- Auto-detect city and township from coordinates

Customer location is important for:

- Nearby provider search
- Distance filtering
- Map markers

---

## Provider Features

- Register/Login
- Cannot login until approval
- Can resubmit after rejected
- Can edit provider register information after approval
- Create service profile with by requesting admin with form
- Set service areas
- Accept/reject bookings
- Manage pricing
- Chat with customers
- Show provider location on map

---

## Provider Register Features

### Step by step

### Account Info

- Username
- Email
- Myanmar phone number
- Password

---

### Service Information

- Category
- Skills
  - Each category has related predefined skills
  - Provider can add custom skills

- Provider location using Mapbox
- Pin exact location on map
- Auto-detect city and township

- About You / Service Description

- Price
  - minimum = 10,000 MMK
  - maximum = 1,000,000 MMK

- Experience years

---

### Identity Verification

- NRC field (3-part input)
- NRC front image
- NRC back image
- Selfie photo

After registration:

- Admin reviews provider verification
- Provider account is approved or rejected

---

## Map & Location System

The platform uses Mapbox for:

- Current location detection
- Pinning location on map
- Reverse geocoding
- Nearby provider search
- Provider map markers

---

## Location Flow

### Customer

1. User allows location access
2. Browser returns latitude/longitude
3. Frontend sends coordinates to backend
4. Backend uses Mapbox reverse geocoding
5. System auto-detects:
   - city
   - township
6. User location stored in database

---

### Provider

1. Provider pins exact location on map
2. Backend detects city/township
3. Service areas are automatically filtered by detected city
4. Provider selects supported townships

Example:

- Current location = Yangon, Hlaing
- Service area options:
  - Hlaing
  - Kamayut
  - Insein
  - Mayangone

---

## Key Concepts

- Township-based filtering
- Geo-based nearby provider search
- Provider map markers
- Reverse geocoding
- Category + skill-based filtering
- Service area matching
- Booking lifecycle system
- Real-time chat linked to bookings

---

## Booking Flow

1. User selects provider
2. User creates booking
3. Provider accepts/rejects
4. Chat is enabled
5. Job completed
6. User leaves review

---

## System Design Principles

- Modular backend architecture
- Clean separation of concerns
- Scalable service-based modules
- Geo-aware backend system
- Keep MVP simple (no microservices)

---

## MVP Completion Criteria

Backend is complete when:

- Auth works
- Providers can register
- Services CRUD works
- Bookings lifecycle works
- Chat works
- Reviews work
- Search + filtering works

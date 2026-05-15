# BUSINESS_RULES.md

## Overview

This file defines all business logic for the Local Services Marketplace.

---

## User Roles

### CUSTOMER

- Can search providers
- Can book services
- Can leave reviews

### PROVIDER

- Can create services with different category but need to request for admin
- Can edit service under same service category (like add new skill or remove skill)
- Can accept/reject bookings
- Must be verified

### ADMIN

- Approves providers
- Manages system moderation
- Approve or reject for change jobs like change categroy
  Examples:
  -Change from Education to Moving Service or something

---

## Provider Rules

- Must complete verification before activation
- Must submit:
  - NRC information
  - NRC front
  - NRC back
  - Selfie photo
- Must be approved by admin
- Cannot receive bookings before approval
- Cannot login before approval
- Can resubmit after rejected

---

## Customer Rules

- Can search providers without restriction
- Can only review completed bookings
- Can book multiple providers
- Can chat with provider who accepted the booking

---

## Booking Rules

### Lifecycle

1. PENDING
2. ACCEPTED
3. REJECTED
4. COMPLETED
5. CANCELLED

---

### Rules

- Provider must accept booking before chat starts
- One booking = one chat room
- Only completed bookings can be reviewed
- Cancelled bookings cannot be reviewed

---

## Review Rules

- Rating: 1 to 5 stars
- Only allowed after COMPLETED booking
- One review per booking only

---

## Pricing Rules

- Minimum price: 10,000 MMK
- Maximum price: 1,000,000 MMK

---

## Location Rules

- Every user/provider MUST have coordinates
- City/township is auto-detected via Mapbox
- Text-only location is not valid for search

---

## Service Area Rules

- Providers define supported townships
- Must match provider city
- Used for filtering search results

---

## Search Rules

Users can filter by:

- category
- skills
- township
- price range
- rating
- available provider
- Provider who has never provide service

Can be sort by:

-lowest price
-highest price
-most recent post or most recent new providers

Can be search by:

-provider name and category

---

## Map Rules

- Providers shown as markers
- User sees nearby providers
- Distance-based ranking enabled

---

## Verification Rules

Each module MUST validate input using schema validation:

- Zod

- Reject missing required fields
- Reject invalid phone numbers
- Reject invalid price ranges
- Each field with reasonable validation message for better UX

Provider must submit:

- NRC images
- Selfie photo

Admin must:

- approve or reject provider

---

# Chat System Rules

- One chat per booking
- Messages stored in DB
- Real-time via Socket.IO
- Include timestamps

---

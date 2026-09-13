# RoomMateHub

> **"Find a room that feels like home."**

A production-style accommodation discovery and booking platform connecting **students and working professionals** with **property owners** and **administrators** for rooms, luxury PGs, hostels, and shared apartments across Chennai.

---

## Architecture

```
                    ROOMMATEHUB
                         │
                         ▼
               React Frontend (Vite)
                         │
                         │ Axios / REST API (JWT Header)
                         ▼
               Node.js + Express Backend
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
          MongoDB              Supabase Storage
             │                       │
      Application Data          Images / Files
   (Users, Properties,     (Property Images,
    Visits, Inquiries,       Profile Avatars)
    Favorites, Reviews)
```

---

## Features

### 👤 Tenant (Students / Professionals)
* **Discover Accommodations**: Real-time multi-filter search (Locality, Budget slider, Gender preference, Room sharing, Furnishing, Amenities, Verified status).
* **Property Details**: High-resolution image gallery, full pricing breakdown, security deposit, address, and amenities checklist.
* **Direct Communication**: Send inquiries directly to property owners without middleman brokers.
* **Visit Scheduling**: Pick convenient date and time slots to tour properties.
* **Favorites**: Save and shortlist accommodations for fast comparison.
* **Honest Reviews**: Rate properties from 1 to 5 stars with written reviews.
* **Trust & Safety**: Report suspicious, misleading, or outdated listings.

### 🏢 Property Owner
* **Listing Management**: Create, edit, and delete accommodation listings with multi-image uploads to Supabase Storage.
* **Inquiry Dashboard**: Receive questions from verified prospective tenants and reply directly.
* **Visit Request Manager**: Accept or decline scheduled physical tour requests.
* **Analytics**: Track total, approved, and pending listings.

### 🛡️ Platform Administrator
* **Executive Dashboard**: System KPI statistics (Total users, active owners, live properties, pending queue, active reports).
* **Moderation Queue**: 1-click Approve or Reject newly submitted listings.
* **Verification**: Toggle official Verified badges for vetted properties.
* **User Control**: Deactivate or activate user and host accounts.
* **Report Resolution**: Investigate tenant complaints, resolve issues, and take down non-compliant listings.

---

## Technology Stack

### Frontend
* **React 18** with **Vite**
* **React Router DOM v6**
* **Axios** (Centralized API client with JWT interceptors)
* **Ant Design (v5)** & **Lucide React Icons**
* **Vanilla Modern CSS** (Design system tokens, typography, glassmorphism, responsive grid)

### Backend
* **Node.js** & **Express.js**
* **MongoDB** with **Mongoose ODM**
* **JWT (JSON Web Tokens)** & **bcryptjs** (Password hashing)
* **Multer** (Memory buffer streaming)
* **@supabase/supabase-js** (Supabase Storage file management)
* **CORS**, **Morgan**, and **Dotenv**
* **mongodb-memory-server** (Automatic zero-friction fallback for instant development)

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/roommatehub
JWT_SECRET=super_secret_roommatehub_jwt_key_2026_dev_prod
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Security Note**: `MONGODB_URI`, `JWT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are stored strictly on the backend and are never exposed to the frontend.

---

## Test & Demo Credentials

Use the **1-Click Quick Login chips** on `/login` or enter the credentials below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Tenant** | `tenant@example.com` | `password123` |
| **Owner** | `owner@example.com` | `password123` |
| **Admin** | `admin@example.com` | `password123` |

---

## Quick Start Guide

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed      # Populates users and Chennai properties (OMR, Velachery, Guindy, Anna Nagar, Adyar, Tambaram)
npm run dev       # Starts Express backend on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## REST API Documentation

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register tenant or owner
* `POST /api/auth/login` — Sign in and receive JWT
* `GET /api/auth/me` — Get authenticated user details
* `PUT /api/auth/profile` — Update name, phone, or avatar

### Properties (`/api/properties`)
* `GET /api/properties` — Public search & filtering with pagination
* `GET /api/properties/:id` — Property details with reviews
* `GET /api/properties/my-properties` — Owner's properties *(Owner)*
* `POST /api/properties` — Create listing with images *(Owner)*
* `PUT /api/properties/:id` — Update listing *(Owner/Admin)*
* `DELETE /api/properties/:id` — Delete listing *(Owner/Admin)*
* `PATCH /api/properties/:id/approve` — Approve listing *(Admin)*
* `PATCH /api/properties/:id/reject` — Reject listing *(Admin)*

### Favorites (`/api/favorites`)
* `GET /api/favorites` — Tenant's saved properties *(Tenant)*
* `POST /api/favorites/:propertyId` — Save property *(Tenant)*
* `DELETE /api/favorites/:propertyId` — Remove property *(Tenant)*

### Inquiries (`/api/inquiries`)
* `POST /api/inquiries` — Send inquiry to owner *(Tenant)*
* `GET /api/inquiries/my` — Get tenant's inquiries *(Tenant)*
* `GET /api/inquiries/owner` — Get owner's inquiries *(Owner)*
* `PATCH /api/inquiries/:id/respond` — Reply to inquiry *(Owner)*
* `PATCH /api/inquiries/:id/close` — Close inquiry

### Visits (`/api/visits`)
* `POST /api/visits` — Schedule property tour *(Tenant)*
* `GET /api/visits/my` — Tenant's scheduled visits *(Tenant)*
* `GET /api/visits/owner` — Owner's visit requests *(Owner)*
* `PATCH /api/visits/:id/accept` — Accept visit request *(Owner)*
* `PATCH /api/visits/:id/reject` — Decline visit request *(Owner)*
* `PATCH /api/visits/:id/complete` — Mark tour complete
* `PATCH /api/visits/:id/cancel` — Cancel tour

### Reviews (`/api/reviews`)
* `POST /api/reviews` — Submit 1-5 star review *(Tenant)*
* `GET /api/properties/:propertyId/reviews` — Get property reviews

### Reports (`/api/reports`)
* `POST /api/reports` — Report listing
* `GET /api/reports` — View all reports *(Admin)*
* `PATCH /api/reports/:id/resolve` — Resolve report and optional take-down *(Admin)*
* `PATCH /api/reports/:id/reject` — Dismiss report *(Admin)*

### Admin (`/api/admin`)
* `GET /api/admin/stats` — KPI analytics *(Admin)*
* `GET /api/admin/users` — Directory of users & hosts *(Admin)*
* `PATCH /api/admin/users/:id/toggle-status` — Deactivate / activate user *(Admin)*
* `PATCH /api/admin/properties/:id/verify` — Toggle verified badge *(Admin)*

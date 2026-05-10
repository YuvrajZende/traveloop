# Traveloop - Personalized Travel Planning Platform

Traveloop is a premium, full-stack travel planning application designed to take users from inspiration to itinerary execution. The platform enables users to build complex trips, manage budgets, coordinate packing lists, and share adventures with a global community.

## Project Overview

The core objective of Traveloop is to provide a single source of truth for travel planning. Rather than relying on scattered notes, spreadsheets, and booking confirmation emails, Traveloop centralizes everything into an interactive dashboard.

### Core Features

* **Smart Trip Planning**
  * **Interactive Itinerary Builder:** Create distinct sections for travel, stays, and activities.
  * **Live Summary Dashboard:** Real-time calculation of trip duration, budget utilization, and total activity counts.
  * **Trip Notes and Journaling:** Centralized storage for booking IDs, contacts, and personal memories directly linked to specific trips.

* **Organized Preparation**
  * **Dynamic Packing Checklist:** Category-aware checklist system with live CRUD operations and optimistic UI updates for instantaneous feedback.
  * **Budget Tracking:** Granular expense management across the entire itinerary to monitor financial utilization.

* **Explore and Discover**
  * **Activity and City Search:** Global search functionality across thousands of activities and cities, featuring advanced filtering by type, duration, and cost.
  * **Top Regional Selections:** Curated, high-quality travel inspiration displayed directly on the user dashboard.

* **Community and Social**
  * **Community Hub:** A dedicated space to share trip experiences, ask questions, and interact with other travelers.
  * **Live Identity Integration:** Posts and replies are automatically linked to the authenticated user profile.

## Technical Architecture

The application is built on a modern, decoupled architecture ensuring high performance and maintainability.

### Frontend
* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS and Shadcn UI
* **State Management:** React Hooks (useState, useEffect, useCallback)
* **Icons:** Lucide React
* **Animations:** Framer Motion

### Backend
* **Environment:** Node.js with Express
* **Database:** PostgreSQL
* **Authentication:** JSON Web Tokens (JWT) with secure storage implementations
* **Security:** Helmet, CORS configuration, and strict Rate Limiting
* **Middleware:** Role-Based Access Control (RBAC) and unified Error Handling

## Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites
* Node.js (v18 or higher)
* PostgreSQL (v14 or higher)
* npm or yarn

### Database Setup
1. Create a new PostgreSQL database named `traveloop`:
   ```sql
   CREATE DATABASE traveloop;
   ```
2. Run the provided schema script to set up the necessary tables and seed the initial data:
   ```bash
   psql -d traveloop -f schema.sql
   ```

### Backend Configuration
1. Navigate to the project root directory.
2. Create a `.env` file with the following variables:
   ```env
   DB_USER=your_username
   DB_PASS=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=traveloop
   JWT_SECRET=your_super_secret_key
   ```
3. Install dependencies and start the backend server:
   ```bash
   npm install
   npm run dev
   ```

### Frontend Configuration
1. Navigate to the `frontend` directory.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the application interface at `http://localhost:3001` (or your assigned local port).

## Project Structure

```text
traveloop/
├── frontend/             # Next.js 15 Client Application
│   ├── app/              # App Router definitions (App, Auth, Trips, etc.)
│   ├── components/       # Reusable UI Components
│   └── lib/              # API Client and Utilities
├── routes/               # Express API Route Controllers
├── middleware/           # Authentication and Logic Middleware
├── utils/                # Backend Helper Functions
├── db.js                 # PostgreSQL Database Connection
├── schema.sql            # Core Database Schema
└── server.js             # API Entry Point and Configuration
```

## API Endpoints Summary

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Auth** | `POST /api/auth/login` | Authenticate user and generate JWT |
| **Trips**| `GET /api/trips` | Fetch all trips associated with the user |
| **Notes**| `GET /api/notes/:tripId` | Retrieve notes for a specific trip |
| **Search**| `GET /api/search/activities`| Query the global activities database |
| **Checklist**| `GET /api/checklist/:tripId`| Retrieve trip preparation items |

## License

This project is licensed under the MIT License.

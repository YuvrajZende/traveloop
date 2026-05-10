# 🌍 Traveloop — Personalized Travel Planning Platform

**Traveloop** is a premium, full-stack travel planning application designed to take you from inspiration to itinerary. Build complex trips, manage budgets, coordinate packing lists, and share your adventures with a global community.

![Traveloop Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80)

---

## 🚀 Features

### 📋 Smart Trip Planning
- **Interactive Itinerary Builder:** Create multiple sections for travel, stays, and activities.
- **Live Summary Dashboard:** Real-time calculation of trip duration, budget utilization, and activity counts.
- **Trip Notes & Journaling:** Keep track of booking IDs, contacts, and memories directly linked to your trips.

### 🎒 Organized Preparation
- **Dynamic Packing Checklist:** Category-aware checklist with live CRUD operations and optimistic UI updates.
- **Budget Tracking:** Manage estimated costs across your entire itinerary to stay on track.

### 🔍 Explore & Discover
- **Activity & City Search:** Search across thousands of activities and cities with advanced filtering by type, duration, and cost.
- **Top Regional Selections:** Curated, high-quality travel inspiration right on your dashboard.

### 🤝 Community & Social
- **Community Hub:** Share your trip experiences, ask questions, and interact with other travelers.
- **Live Identity Integration:** Posts and replies are automatically linked to your authenticated profile.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **Icons:** Lucide React
- **Animations:** Framer Motion

### **Backend**
- **Environment:** Node.js + Express
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) with Secure Storage
- **Middleware:** RBAC (Role-Based Access Control), Error Handling

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 2. Database Setup
1. Create a new database named `traveloop`:
   ```sql
   CREATE DATABASE traveloop;
   ```
2. Run the schema script to set up tables and seed initial data:
   ```bash
   psql -d traveloop -f schema.sql
   ```

### 3. Backend Configuration
1. Navigate to the root directory.
2. Create a `.env` file:
   ```env
   DB_USER=your_username
   DB_PASS=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=traveloop
   JWT_SECRET=your_super_secret_key
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 4. Frontend Configuration
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:3001` (or your local port).

---

## 📂 Project Structure

```bash
traveloop/
├── frontend/             # Next.js 15 Client
│   ├── app/              # App Router (App, Auth, Trips, etc.)
│   ├── components/       # Reusable UI Components
│   └── lib/              # API Client & Utilities
├── routes/               # Express API Routes
├── middleware/           # Auth & Logic Middleware
├── utils/                # Backend Helpers
├── db.js                 # Database Connection
├── schema.sql            # PostgreSQL Schema
└── server.js             # API Entry Point
```

---

## 🛡️ API Endpoints Summary

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Auth** | `POST /api/auth/login` | Authenticate & get JWT |
| **Trips**| `GET /api/trips` | Fetch all user trips |
| **Notes**| `GET /api/notes/:tripId` | Get notes for a trip |
| **Search**| `GET /api/search/activities`| Search global activities |
| **Checklist**| `GET /api/checklist/:tripId`| Get trip preparation items |

---

## 🤝 Contributing
This project was built as part of a high-intensity hackathon. Contributions, issues, and feature requests are welcome!

---

## 📄 License
This project is licensed under the MIT License.

---
*Created with ❤️ by the Traveloop Team*

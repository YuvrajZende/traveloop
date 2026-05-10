# Traveloop

A full-stack collaborative trip planning platform. Build multi-city itineraries, manage budgets, coordinate packing checklists, and share travel experiences with a community.

## Features

### Trip Planning
- Create trips with destination, dates, and budget
- Multi-section itinerary builder with activities and expenses
- Day-by-day itinerary view with expense tracking
- Trip summary with aggregated statistics

### Packing Checklists
- Category-based packing lists per trip
- Real-time progress tracking
- Add, remove, and toggle items with optimistic UI updates
- Share checklists via clipboard

### Search & Discovery
- Search activities across all trips with filters (type, duration, cost)
- Browse cities with popularity scores
- Group and sort results
- 40+ pre-seeded activities across 8 countries for demo purposes

### Community
- Post travel tips, questions, and experiences
- Like and reply to posts
- Share trip itineraries to community posts

### User Management
- Registration and login with JWT authentication
- Profile editing with avatar upload
- Account settings and preferences

### Admin Dashboard
- User analytics and statistics
- Popular cities and activities views
- System-level trip data

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons
- Recharts for data visualization
- date-fns for date formatting

### Backend
- Node.js with Express 5
- PostgreSQL with pg connection pooling
- JWT authentication with bcrypt password hashing
- Express rate limiting and Helmet security headers
- Transactional database operations

### Infrastructure
- Docker Compose for PostgreSQL
- dotenv for environment configuration

## Project Structure

```
traveloop/
├── .env.example              # Environment variable template
├── .gitignore
├── docker-compose.yml        # PostgreSQL container configuration
├── package.json              # Backend dependencies and scripts
├── README.md
│
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App Router pages
│   │   ├── (app)/            # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   ├── trips/
│   │   │   ├── search/
│   │   │   ├── notes/
│   │   │   ├── community/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── checklist/
│   │   ├── login/
│   │   └── register/
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # shadcn/ui primitives
│   │   ├── top-nav.tsx
│   │   ├── side-nav.tsx
│   │   ├── back-button.tsx
│   │   └── trip-flow-steps.tsx
│   ├── lib/
│   │   ├── api.ts            # API client with auth helpers
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── mock-data.ts
│   └── middleware.ts         # Route protection middleware
│
└── src/                      # Express backend
    ├── server.js             # Application entry point
    ├── db.js                 # PostgreSQL connection pool
    ├── jwt.js                # JWT generation and verification
    ├── schema.sql            # Complete database schema
    ├── middleware/
    │   ├── auth.js           # Token authentication middleware
    │   └── rbac.js           # Role-based access control
    ├── routes/
    │   ├── admin.js          # Admin analytics endpoints
    │   ├── auth.js           # Login, register, password reset
    │   ├── budget.js         # Trip budget management
    │   ├── checklist.js      # Packing checklist CRUD
    │   ├── community.js      # Community posts and likes
    │   ├── dashboard.js      # Dashboard aggregate data
    │   ├── invoices.js       # Expense invoice generation
    │   ├── itinerary.js      # Itinerary sections and days
    │   ├── notes.js          # Trip notes/journal entries
    │   ├── regions.js        # Regional suggestions
    │   ├── search.js         # Activity and city search
    │   ├── share.js          # Trip sharing endpoints
    │   ├── trips.js          # Trip CRUD with cover images
    │   └── users.js          # User profile management
    └── utils/
        ├── AppError.js       # Custom error classes
        └── helpers.js        # Query builder and validation
```

## Prerequisites

- Node.js 22 or later
- Docker and Docker Compose
- npm

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd traveloop
```

### 2. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=traveloop_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Start the database

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432 and automatically runs the schema script to create all tables, indexes, and views.

### 4. Install dependencies and start the backend

```bash
npm install
npm run dev
```

The API server starts on `http://localhost:5000`.

### 5. Install dependencies and start the frontend

```bash
cd frontend
npm install
npm run dev
```

The application is available at `http://localhost:3000`.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate and receive JWT |
| POST | `/api/auth/forgot-password` | Request password reset token |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/change-password` | Change password (authenticated) |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trips` | Create a new trip |
| GET | `/api/trips` | List all trips for authenticated user |
| GET | `/api/trips/:id` | Get single trip details |
| PUT | `/api/trips/:id` | Update trip |
| DELETE | `/api/trips/:id` | Delete trip |

### Itinerary
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/itinerary/sections/:tripId` | Get itinerary sections |
| POST | `/api/itinerary/sections` | Create a section |
| PUT | `/api/itinerary/sections/:id` | Update a section |
| DELETE | `/api/itinerary/sections/:id` | Delete a section |
| GET | `/api/itinerary/view/:tripId` | Get full itinerary with days and activities |

### Checklist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/checklist/:tripId` | Get packing checklist |
| POST | `/api/checklist/categories` | Create a category |
| POST | `/api/checklist/items` | Add an item |
| PATCH | `/api/checklist/items/:id/toggle` | Toggle packed status |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/activities` | Search activities with filters |
| GET | `/api/search/cities` | Search cities with filters |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community` | List all community posts |
| POST | `/api/community` | Create a post |
| POST | `/api/community/:id/like` | Toggle like on a post |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard aggregate data |
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update current user |
| GET | `/api/notes/:tripId` | Get trip notes |
| GET | `/api/budget/:tripId` | Get trip budget |
| GET | `/api/health` | Health check |

## Database Schema

The schema includes 20 tables covering users, trips, itineraries, activities, checklists, regions, community posts, trip notes, invoices, and budget items. Three materialized views provide analytics for popular cities, popular activities, and user statistics.

Run the schema manually if needed:

```bash
npm run db:init
```

## Contributors

| Name | Role |
|------|------|
| Riya Gaur | Admin Dashboard Development |
| Nevil Choksi | Frontend UI |
| Yuvraj Zende | Backend System |
| Vinay Yadav | Routes, Connections, and Middleware |

## License

MIT

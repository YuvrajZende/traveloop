# Traveloop Backend API

Node.js + Express + PostgreSQL backend for Screens 1–5.

---

## Project Structure

```
traveloop-backend/
├── src/
│   ├── app.js                  # Express app + server entry point
│   ├── config/
│   │   ├── db.js               # PostgreSQL pool connection
│   │   ├── schema.sql          # All table definitions + seed data
│   │   └── migrate.js          # Run migration script
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── errorHandler.js     # Validation + global error handler
│   └── routes/
│       ├── auth.js             # Screen 1 & 2: login, register, tokens
│       ├── users.js            # Screen 2: profile, photo upload
│       ├── places.js           # Screen 3 & 4: featured places, search
│       ├── trips.js            # Screen 3 & 4: CRUD trips
│       └── sections.js         # Screen 5: itinerary sections
├── uploads/                    # Profile photo storage
├── .env.example                # Environment variable template
└── package.json
```

---

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a JWT secret
```

### 3. Create database
```sql
-- In psql:
CREATE DATABASE traveloop;
```

### 4. Run migration
```bash
npm run migrate
```

### 5. Start server
```bash
npm run dev     # with nodemon (install: npm i -g nodemon)
npm start       # production
```

---

## API Reference

### Auth (Screens 1 & 2)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login, returns JWT | ❌ |
| POST | `/api/auth/refresh-token` | Rotate access token | ❌ |
| POST | `/api/auth/logout` | Invalidate refresh token | ✅ |
| GET  | `/api/auth/me` | Get current user | ✅ |

**Register body:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "first_name": "Arjun",
  "last_name": "Patel",
  "phone": "+919876543210",
  "city": "Vadodara",
  "country": "India",
  "bio": "Travel enthusiast"
}
```

**Login body:**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Login response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "first_name": "..." },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

> All protected routes need: `Authorization: Bearer <accessToken>`

---

### Users (Screen 2)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| POST | `/api/users/photo` | Upload profile photo (multipart/form-data, field: `photo`) | ✅ |

---

### Places (Screens 3 & 4)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/places/featured` | Top regional selections | ✅ |
| GET | `/api/places?search=paris&country=France` | Search places | ✅ |
| GET | `/api/places/:id` | Place detail + activity suggestions | ✅ |

---

### Trips (Screens 3 & 4)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/trips` | List user's trips | ✅ |
| GET | `/api/trips?status=upcoming` | Filter by status | ✅ |
| GET | `/api/trips?search=Paris` | Search trips | ✅ |
| POST | `/api/trips` | Create new trip | ✅ |
| GET | `/api/trips/:id` | Trip + its sections | ✅ |
| PUT | `/api/trips/:id` | Update trip | ✅ |
| DELETE | `/api/trips/:id` | Delete trip | ✅ |

**Create Trip body:**
```json
{
  "title": "Europe Adventure",
  "destination": "Paris, France",
  "start_date": "2025-06-01",
  "end_date": "2025-06-15",
  "total_budget": 80000,
  "notes": "First trip to Europe!"
}
```

---

### Itinerary Sections (Screen 5)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/trips/:tripId/sections` | All sections for a trip | ✅ |
| POST | `/api/trips/:tripId/sections` | Add a section | ✅ |
| PUT | `/api/trips/:tripId/sections/:sectionId` | Update section | ✅ |
| PATCH | `/api/trips/:tripId/sections/reorder` | Reorder sections | ✅ |
| DELETE | `/api/trips/:tripId/sections/:sectionId` | Delete section | ✅ |

**Add Section body:**
```json
{
  "title": "Flight: Delhi → Paris",
  "description": "Air India AI-111, economy class",
  "start_date": "2025-06-01",
  "end_date": "2025-06-01",
  "budget": 12000,
  "type": "travel"
}
```

**Section types:** `travel` | `hotel` | `activity` | `food` | `general`

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Screen 1 & 2 — auth + profile |
| `refresh_tokens` | JWT token rotation |
| `places` | Screen 3 & 4 — destinations |
| `trips` | Screen 3 & 4 — user trips |
| `itinerary_sections` | Screen 5 — trip plan sections |
| `place_suggestions` | Screen 4 — activity suggestions per place |

---

## Frontend Integration

```javascript
// axios instance (create once in api.js)
const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Login
const { data } = await api.post('/auth/login', { email, password });
localStorage.setItem('accessToken', data.data.accessToken);

// Fetch featured places (Screen 3)
const { data } = await api.get('/places/featured');

// Create trip (Screen 4)
const { data } = await api.post('/trips', tripPayload);

// Add itinerary section (Screen 5)
const { data } = await api.post(`/trips/${tripId}/sections`, sectionPayload);
```

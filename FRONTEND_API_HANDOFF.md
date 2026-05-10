# Traveloop — Frontend API Integration Guide (Next.js)

Welcome to the frontend! The Traveloop backend is fully built, tested, and ready to consume. This guide is designed to map the 14 project screens directly to the API routes you need to call, making your Next.js integration as smooth as possible.

## 🚀 Quick Start / Setup

*   **Base URL:** `http://localhost:3000`
*   **Authentication:** JWT (JSON Web Tokens). Most routes are protected.
    *   When you log in, the API returns a `token`.
    *   For all protected routes, you **must** send this token in the headers:
        `Authorization: Bearer <YOUR_TOKEN>`

### Next.js Specific Tips:
*   **Server Components vs Client Components:** For SEO-friendly public pages (like the public shared itinerary), fetch data in Server Components. For highly interactive pages (like drag-and-drop itinerary reordering), use Client Components with React Query or SWR for caching.
*   **CORS:** The backend has CORS enabled, so you can call `http://localhost:3000` directly from your `http://localhost:3001` (or 3000) Next.js app without browser errors.

---

## 🗺️ Screen-by-Screen API Mapping

Here is exactly which endpoints to hit for each feature/screen you are building. All paths are appended to the Base URL (e.g., `http://localhost:3000/api/auth/register`).

### 1. Auth / Login / Signup
*   `POST /api/auth/register` — Create a new account. Body: `username`, `email`, `password`, `first_name`, `last_name`. Returns `token`.
*   `POST /api/auth/login` — Log in. Body: `username`, `password`. Returns `token`.
*   `POST /api/auth/forgot-password` — Request password reset email (simulated).
*   `POST /api/auth/reset-password` — Submit new password with the token from the email.

### 2. Main Dashboard (Home)
Instead of making 5 different API calls, we built a single hyper-optimized endpoint for your dashboard!
*   `GET /api/dashboard` — Returns:
    *   `upcoming_trip` (The next trip on the schedule)
    *   `recent_trips` (Last 3 modified trips)
    *   `trip_stats` (Total trips, total spent)
    *   `recommendations` (Popular cities/activities)
    *   `checklist_progress` (For the upcoming trip)

### 3. Create a Trip
*   `POST /api/trips` — Create a new trip. Body: `title`, `place`, `start_date`, `end_date`, `total_budget`.

### 4. My Trips (List & Manage)
*   `GET /api/trips` — List all trips the user has access to (owned or invited).
*   `GET /api/trips/:id` — Get basic details of a single trip.
*   `PUT /api/trips/:id` — Update trip details (like changing the budget).
*   `DELETE /api/trips/:id` — Delete a trip.

### 5. Itinerary Builder (The Core Feature)
The itinerary is broken into **Sections** (e.g., "Day 1", "Morning") and **Activities** inside those sections.
*   `GET /api/itinerary/view/:tripId` — **CRITICAL ENDPOINT.** Use this to render the whole timeline. It returns a massive, pre-structured JSON payload grouping all days, sections, and activities perfectly for your UI.
*   `POST /api/itinerary/sections` — Add a new section.
*   `POST /api/itinerary/activities` — Add a new activity to a section.
*   `PATCH /api/itinerary/sections/reorder` — **Drag & Drop support!** Body: `{ "trip_id": "uuid", "order": [{ "id": "section_uuid", "section_number": 1 }] }`
*   `PATCH /api/itinerary/activities/reorder` — **Drag & Drop support!** Body: `{ "section_id": "uuid", "order": [{ "id": "activity_uuid", "start_time": "10:00:00" }] }`

### 6. Budget Tracker
*   `GET /api/budget/:tripId` — **CRITICAL ENDPOINT.** Returns the full budget analytics.
    *   `total_budget` vs `total_spent`
    *   `utilization_percentage`
    *   `by_category` (Perfect for rendering a Pie Chart 🥧)
    *   `by_day` (Perfect for rendering a Bar Chart 📊)
    *   `alerts` (Array of days where the user went over budget)
*   `POST /api/budget/items` — Add a manual expense. Body requires `trip_id`, `category`, `amount`.
*   `DELETE /api/budget/items/:id` — Remove an expense.

### 7 & 8. Search (Cities & Activities)
We have advanced search with filtering. Build your UI to send these query parameters:
*   `GET /api/search/cities?q=Paris&country=France&min_score=4.5`
*   `GET /api/search/activities?place=Paris&duration=short&min_cost=0&max_cost=50`

### 9. Packing Checklist
*   `GET /api/checklist/:tripId` — Get all categories and items.
*   `POST /api/checklist/categories` — Add a category (e.g., "Electronics").
*   `POST /api/checklist/items` — Add an item to a category (e.g., "Camera charger").
*   `PATCH /api/checklist/items/:id/toggle` — Toggle the `is_checked` boolean.

### 10. Trip Notes & Journal
*   `GET /api/notes/:tripId` — Get all notes for a trip.
*   `POST /api/notes` — Create a note. Body: `trip_id`, `title`, `content`.

### 11. Public & Shared Itineraries
*   `POST /api/share/:tripId` — Generates a unique `share_slug` (e.g., `a1b2c3d4`).
*   `GET /api/share/view/:slug` — **NO AUTH REQUIRED.** Use this for the public viewing page.
*   `POST /api/share/copy/:slug` — Allows a logged-in user to duplicate someone else's public trip entirely into their own account!

### 12. Community / Collaborate
*   `GET /api/community` — View global community posts.
*   `POST /api/invoices/travelers` — Invite another user to collaborate on the trip. Body: `trip_id`, `name`, `email`. *(Note: Traveler management is located under the invoices route namespace).*

### 13. Profile & Preferences
*   `GET /api/users/me` — View logged-in user data.
*   `PUT /api/users/preferences` — Update UI settings. Body: `language`, `currency`, `theme` (dark/light), `notifications_enabled`.
*   `GET /api/users/destinations` — Get bookmarked places.

### 14. Admin Panel
If a user has `role: 'admin'`, they can access these:
*   `GET /api/admin/stats` — High-level platform metrics.
*   `GET /api/admin/users` — List all users (supports `?search=john` and pagination).
*   `PATCH /api/admin/users/:id/disable` — Ban/lock a user account.

---

## 🛠 Pro-Tips for the Frontend Team
1. **Error Handling:** Every API error returns a JSON object like `{ "status": "error", "message": "Trip not found" }`. Catch this to display nice toast notifications in Next.js!
2. **Postman:** Ask your backend dev for the `Traveloop_Postman_Collection.json` file. Import it into Postman so you can see exact request/response shapes before writing your frontend code.
3. **Dates:** All dates are in standard ISO-8601 format. Use libraries like `date-fns` or `dayjs` on the frontend to format them beautifully for the user.

## Sample Responses (for AI agents and frontend devs)

### 1) Login Success
`POST /api/auth/login`

```json
{
  "user": {
    "id": "3e6c1c12-8d2a-4f4d-9b2e-8aa1f5d72c11",
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  },
  "token": "<jwt_token>"
}
```

### 2) Dashboard Success
`GET /api/dashboard`

```json
{
  "recent_trips": [
    {
      "id": "trip-uuid-1",
      "title": "Europe Tour",
      "place": "Paris",
      "start_date": "2026-06-01",
      "end_date": "2026-06-10",
      "status": "upcoming",
      "cover_image_url": null
    }
  ],
  "trip_stats": {
    "total": 4,
    "ongoing": 1,
    "upcoming": 2,
    "completed": 1
  },
  "upcoming_trip": {
    "id": "trip-uuid-1",
    "title": "Europe Tour",
    "place": "Paris",
    "start_date": "2026-06-01",
    "end_date": "2026-06-10",
    "total_budget": "50000.00",
    "cover_image_url": null
  },
  "budget_highlights": {
    "total_budget": 90000,
    "total_spent": 28000,
    "remaining": 62000
  },
  "recommended_regions": [
    {
      "id": "region-uuid-1",
      "name": "Paris",
      "country": "France",
      "image_url": null,
      "popularity_score": 98
    }
  ],
  "checklist_progress": {
    "total_items": 20,
    "packed_items": 7
  }
}
```

### 3) Trips List Success
`GET /api/trips`

```json
[
  {
    "id": "trip-uuid-1",
    "user_id": "user-uuid-1",
    "title": "Europe Tour",
    "description": "Summer trip",
    "place": "Paris",
    "start_date": "2026-06-01",
    "end_date": "2026-06-10",
    "total_budget": "50000.00",
    "cover_image_url": null,
    "status": "upcoming",
    "is_preplanned": false,
    "share_slug": null,
    "is_public": false,
    "created_at": "2026-05-10T10:10:10.000Z",
    "updated_at": "2026-05-10T10:10:10.000Z"
  }
]
```

### 4) Full Itinerary View Success
`GET /api/itinerary/view/:tripId`

```json
{
  "trip": {
    "id": "trip-uuid-1",
    "title": "Europe Tour",
    "place": "Paris",
    "start_date": "2026-06-01",
    "end_date": "2026-06-10",
    "total_budget": "50000.00",
    "status": "upcoming"
  },
  "sections": [
    {
      "id": "section-uuid-1",
      "trip_id": "trip-uuid-1",
      "section_number": 1,
      "title": "Paris Stop",
      "description": "City center",
      "start_date": "2026-06-01",
      "end_date": "2026-06-03",
      "budget": "12000.00",
      "activities": [
        {
          "id": "activity-uuid-1",
          "name": "Eiffel Tower Visit",
          "description": "Morning visit",
          "location": "Paris",
          "activity_type": "sightseeing",
          "estimated_cost": "40.00",
          "start_time": "2026-06-01T10:00:00.000Z",
          "end_time": "2026-06-01T12:00:00.000Z"
        }
      ]
    }
  ],
  "days": [
    {
      "id": "day-uuid-1",
      "section_id": "section-uuid-1",
      "day_number": 1,
      "day_date": "2026-06-01",
      "section_title": "Paris Stop",
      "activities": [
        {
          "id": "day-activity-uuid-1",
          "name": "Lunch",
          "description": "Cafe",
          "activity_type": "food",
          "expense": "25.00"
        }
      ]
    }
  ]
}
```

### 5) Budget Breakdown Success
`GET /api/budget/:tripId`

```json
{
  "trip": {
    "id": "trip-uuid-1",
    "title": "Europe Tour",
    "place": "Paris"
  },
  "summary": {
    "total_budget": 50000,
    "total_spent": 18500,
    "remaining": 31500,
    "utilization_pct": 37,
    "is_over_budget": false
  },
  "by_category": [
    { "category": "transport", "item_count": 2, "total": "5000.00" },
    { "category": "stay", "item_count": 3, "total": "9000.00" },
    { "category": "meals", "item_count": 4, "total": "4500.00" }
  ],
  "by_day": [
    { "spent_date": "2026-06-01", "daily_total": "3200.00", "item_count": 3 }
  ],
  "itinerary_expenses": [
    { "day_number": 1, "day_date": "2026-06-01", "total_expense": "1250.00" }
  ],
  "alerts": {
    "over_budget_days": [],
    "daily_avg_budget": 5000
  }
}
```

### 6) Common Error Example

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Trip not found"
}
```

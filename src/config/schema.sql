-- ============================================================
-- Traveloop Database Schema
-- Covers: Users (Screen 1 & 2), Trips (Screen 3,4,5),
--         Itinerary Sections (Screen 5), Places suggestions
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE (Screen 1: Login, Screen 2: Register)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  city          VARCHAR(100),
  country       VARCHAR(100),
  photo_url     TEXT,
  bio           TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- REFRESH TOKENS TABLE (for JWT refresh token management)
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

-- ============================================================
-- PLACES TABLE (Screen 3: Top Regional Selections, Screen 4: Select a Place)
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(200) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  country     VARCHAR(100) NOT NULL,
  description TEXT,
  image_url   TEXT,
  latitude    DECIMAL(10, 8),
  longitude   DECIMAL(11, 8),
  is_featured BOOLEAN DEFAULT FALSE,
  category    VARCHAR(50),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_places_country ON places(country);
CREATE INDEX IF NOT EXISTS idx_places_featured ON places(is_featured);

-- ============================================================
-- TRIPS TABLE (Screen 4: Create a New Trip, Screen 3: Previous Trips)
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  destination   VARCHAR(255) NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  total_budget  DECIMAL(12, 2) DEFAULT 0,
  status        VARCHAR(20) DEFAULT 'upcoming'
                  CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  cover_image   TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_user ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON trips(start_date, end_date);

-- ============================================================
-- ITINERARY SECTIONS TABLE (Screen 5: Build Itinerary)
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id     UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  start_date  DATE,
  end_date    DATE,
  budget      DECIMAL(12, 2) DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  type        VARCHAR(50) DEFAULT 'general'
                CHECK (type IN ('travel', 'hotel', 'activity', 'food', 'general')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_trip ON itinerary_sections(trip_id);
CREATE INDEX IF NOT EXISTS idx_sections_order ON itinerary_sections(trip_id, order_index);

-- ============================================================
-- PLACE SUGGESTIONS TABLE (Screen 4: AI/curated suggestions)
-- ============================================================
CREATE TABLE IF NOT EXISTS place_suggestions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id    UUID REFERENCES places(id) ON DELETE CASCADE,
  name        VARCHAR(200) NOT NULL,
  category    VARCHAR(100),
  description TEXT,
  image_url   TEXT,
  rating      DECIMAL(3, 2),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT auto-trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON itinerary_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED: Featured places (for Screen 3 landing page)
-- ============================================================
INSERT INTO places (name, city, country, description, is_featured, category) VALUES
  ('Eiffel Tower Area',   'Paris',    'France',  'Iconic landmark district',          TRUE, 'landmark'),
  ('Colosseum District',  'Rome',     'Italy',   'Ancient Roman history',             TRUE, 'landmark'),
  ('Santorini Caldera',   'Santorini','Greece',  'Stunning volcanic island views',    TRUE, 'nature'),
  ('Bali Rice Terraces',  'Ubud',     'Indonesia','Lush tropical landscapes',         TRUE, 'nature'),
  ('Tokyo Shibuya',       'Tokyo',    'Japan',   'Vibrant urban culture',             TRUE, 'city'),
  ('Machu Picchu',        'Cusco',    'Peru',    'Ancient Incan citadel',             TRUE, 'landmark'),
  ('Goa Beaches',         'Goa',      'India',   'Tropical coastline & culture',      FALSE,'beach'),
  ('Manali Mountains',    'Manali',   'India',   'Himalayan adventure hub',           FALSE,'nature')
ON CONFLICT DO NOTHING;

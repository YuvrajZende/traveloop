const router = require('express').Router();
const db = require('../db');
const { buildQuery } = require('../utils/helpers');

// =============================================
// HARDCODED SEED ACTIVITIES (for demo / empty DB)
// Covers multiple countries, types, durations, costs
// =============================================
const SEED_ACTIVITIES = [
  // ── Japan ──
  { id: 'seed-jp-1', name: 'Fushimi Inari Shrine Walk', description: 'Walk through thousands of vermilion torii gates up Mount Inari.', location: 'Kyoto, Japan', activity_type: 'culture', estimated_cost: 0, start_time: '2026-06-01T07:00:00Z', end_time: '2026-06-01T10:00:00Z', section_title: 'Kansai Exploration', trip_title: 'Japan Adventure', place: 'Kyoto' },
  { id: 'seed-jp-2', name: 'Tsukiji Outer Market Food Tour', description: 'Taste fresh sushi, tamagoyaki, and street food at the famous market.', location: 'Tokyo, Japan', activity_type: 'food', estimated_cost: 45, start_time: '2026-06-01T08:00:00Z', end_time: '2026-06-01T11:00:00Z', section_title: 'Tokyo Discovery', trip_title: 'Japan Adventure', place: 'Tokyo' },
  { id: 'seed-jp-3', name: 'Mount Fuji Day Hike', description: 'Guided hike to the 5th station with panoramic views.', location: 'Fujiyoshida, Japan', activity_type: 'adventure', estimated_cost: 80, start_time: '2026-06-01T05:00:00Z', end_time: '2026-06-01T14:00:00Z', section_title: 'Nature & Adventure', trip_title: 'Japan Adventure', place: 'Tokyo' },
  { id: 'seed-jp-4', name: 'Akihabara Electronics Shopping', description: 'Explore the electric town for gadgets, anime merch, and retro games.', location: 'Tokyo, Japan', activity_type: 'shopping', estimated_cost: 120, start_time: '2026-06-01T12:00:00Z', end_time: '2026-06-01T17:00:00Z', section_title: 'Tokyo Discovery', trip_title: 'Japan Adventure', place: 'Tokyo' },
  { id: 'seed-jp-5', name: 'TeamLab Borderless Digital Art', description: 'Immersive digital art museum with interactive installations.', location: 'Tokyo, Japan', activity_type: 'sightseeing', estimated_cost: 30, start_time: '2026-06-01T14:00:00Z', end_time: '2026-06-01T16:30:00Z', section_title: 'Tokyo Discovery', trip_title: 'Japan Adventure', place: 'Tokyo' },
  { id: 'seed-jp-6', name: 'Onsen Spa Experience', description: 'Traditional hot spring bath in a historic ryokan.', location: 'Hakone, Japan', activity_type: 'relaxation', estimated_cost: 55, start_time: '2026-06-01T16:00:00Z', end_time: '2026-06-01T19:00:00Z', section_title: 'Relaxation Day', trip_title: 'Japan Adventure', place: 'Tokyo' },

  // ── France ──
  { id: 'seed-fr-1', name: 'Eiffel Tower Summit Visit', description: 'Take the elevator to the top for breathtaking views of Paris.', location: 'Paris, France', activity_type: 'sightseeing', estimated_cost: 28, start_time: '2026-09-01T10:00:00Z', end_time: '2026-09-01T12:00:00Z', section_title: 'Paris Highlights', trip_title: 'European Tour', place: 'Paris' },
  { id: 'seed-fr-2', name: 'Louvre Museum Guided Tour', description: 'See the Mona Lisa, Venus de Milo, and masterpieces of Western art.', location: 'Paris, France', activity_type: 'culture', estimated_cost: 20, start_time: '2026-09-01T14:00:00Z', end_time: '2026-09-01T18:00:00Z', section_title: 'Paris Highlights', trip_title: 'European Tour', place: 'Paris' },
  { id: 'seed-fr-3', name: 'Seine River Dinner Cruise', description: 'Romantic evening cruise with French cuisine and live music.', location: 'Paris, France', activity_type: 'food', estimated_cost: 95, start_time: '2026-09-01T20:00:00Z', end_time: '2026-09-01T22:30:00Z', section_title: 'Paris Highlights', trip_title: 'European Tour', place: 'Paris' },
  { id: 'seed-fr-4', name: 'Montmartre Street Art Walk', description: 'Explore the artistic neighborhood and see the Sacré-Cœur.', location: 'Paris, France', activity_type: 'sightseeing', estimated_cost: 0, start_time: '2026-09-02T09:00:00Z', end_time: '2026-09-02T12:00:00Z', section_title: 'Paris Highlights', trip_title: 'European Tour', place: 'Paris' },
  { id: 'seed-fr-5', name: 'Versailles Palace Day Trip', description: 'Visit the Hall of Mirrors, gardens, and Marie Antoinette\'s estate.', location: 'Versailles, France', activity_type: 'culture', estimated_cost: 40, start_time: '2026-09-02T08:00:00Z', end_time: '2026-09-02T16:00:00Z', section_title: 'Day Trips', trip_title: 'European Tour', place: 'Paris' },

  // ── Thailand ──
  { id: 'seed-th-1', name: 'Grand Palace & Wat Phra Kaew', description: 'Explore the ornate royal palace and Temple of the Emerald Buddha.', location: 'Bangkok, Thailand', activity_type: 'culture', estimated_cost: 15, start_time: '2026-07-01T09:00:00Z', end_time: '2026-07-01T12:00:00Z', section_title: 'Bangkok Temples', trip_title: 'Southeast Asia', place: 'Bangkok' },
  { id: 'seed-th-2', name: 'Chatuchak Weekend Market', description: 'Browse over 15,000 stalls for clothing, art, food, and souvenirs.', location: 'Bangkok, Thailand', activity_type: 'shopping', estimated_cost: 30, start_time: '2026-07-01T10:00:00Z', end_time: '2026-07-01T15:00:00Z', section_title: 'Bangkok Shopping', trip_title: 'Southeast Asia', place: 'Bangkok' },
  { id: 'seed-th-3', name: 'Pad Thai Cooking Class', description: 'Learn to cook authentic Pad Thai and green curry from a local chef.', location: 'Bangkok, Thailand', activity_type: 'food', estimated_cost: 40, start_time: '2026-07-01T14:00:00Z', end_time: '2026-07-01T17:00:00Z', section_title: 'Bangkok Food', trip_title: 'Southeast Asia', place: 'Bangkok' },
  { id: 'seed-th-4', name: 'Muay Thai Boxing Match', description: 'Watch live Muay Thai fights at Rajadamnern Stadium.', location: 'Bangkok, Thailand', activity_type: 'adventure', estimated_cost: 50, start_time: '2026-07-01T19:00:00Z', end_time: '2026-07-01T22:00:00Z', section_title: 'Bangkok Nightlife', trip_title: 'Southeast Asia', place: 'Bangkok' },
  { id: 'seed-th-5', name: 'Khao Sok National Park Trek', description: 'Jungle trek through ancient rainforest with wildlife spotting.', location: 'Surat Thani, Thailand', activity_type: 'adventure', estimated_cost: 65, start_time: '2026-07-02T06:00:00Z', end_time: '2026-07-02T15:00:00Z', section_title: 'Nature Escape', trip_title: 'Southeast Asia', place: 'Bangkok' },
  { id: 'seed-th-6', name: 'Thai Massage & Spa', description: 'Traditional 2-hour Thai massage with herbal compress treatment.', location: 'Chiang Mai, Thailand', activity_type: 'relaxation', estimated_cost: 25, start_time: '2026-07-03T14:00:00Z', end_time: '2026-07-03T16:00:00Z', section_title: 'Chiang Mai Relax', trip_title: 'Southeast Asia', place: 'Chiang Mai' },

  // ── Italy ──
  { id: 'seed-it-1', name: 'Colosseum & Roman Forum Tour', description: 'Walk through ancient Rome with an expert archaeologist guide.', location: 'Rome, Italy', activity_type: 'culture', estimated_cost: 35, start_time: '2026-08-01T09:00:00Z', end_time: '2026-08-01T12:30:00Z', section_title: 'Ancient Rome', trip_title: 'Italian Holiday', place: 'Rome' },
  { id: 'seed-it-2', name: 'Vatican Museums & Sistine Chapel', description: 'See Michelangelo\'s ceiling and Raphael Rooms.', location: 'Vatican City, Italy', activity_type: 'sightseeing', estimated_cost: 25, start_time: '2026-08-01T14:00:00Z', end_time: '2026-08-01T17:00:00Z', section_title: 'Vatican Day', trip_title: 'Italian Holiday', place: 'Rome' },
  { id: 'seed-it-3', name: 'Trastevere Food Walking Tour', description: 'Taste carbonara, supplì, and gelato in Rome\'s bohemian quarter.', location: 'Rome, Italy', activity_type: 'food', estimated_cost: 60, start_time: '2026-08-01T18:00:00Z', end_time: '2026-08-01T21:00:00Z', section_title: 'Rome Food', trip_title: 'Italian Holiday', place: 'Rome' },
  { id: 'seed-it-4', name: 'Tuscany Wine Tasting Day Trip', description: 'Visit Chianti vineyards, olive oil farms, and medieval hilltop towns.', location: 'Tuscany, Italy', activity_type: 'sightseeing', estimated_cost: 110, start_time: '2026-08-02T08:00:00Z', end_time: '2026-08-02T18:00:00Z', section_title: 'Tuscany Escape', trip_title: 'Italian Holiday', place: 'Florence' },
  { id: 'seed-it-5', name: 'Gondola Ride in Venice', description: 'Romantic gondola ride through the canals of Venice.', location: 'Venice, Italy', activity_type: 'relaxation', estimated_cost: 80, start_time: '2026-08-03T17:00:00Z', end_time: '2026-08-03T18:00:00Z', section_title: 'Venice Romance', trip_title: 'Italian Holiday', place: 'Venice' },

  // ── USA ──
  { id: 'seed-us-1', name: 'Statue of Liberty & Ellis Island', description: 'Ferry to Liberty Island and explore the immigration museum.', location: 'New York, USA', activity_type: 'sightseeing', estimated_cost: 25, start_time: '2026-05-01T09:00:00Z', end_time: '2026-05-01T13:00:00Z', section_title: 'NYC Icons', trip_title: 'East Coast', place: 'New York' },
  { id: 'seed-us-2', name: 'Broadway Show — Hamilton', description: 'Watch the award-winning musical about Alexander Hamilton.', location: 'New York, USA', activity_type: 'culture', estimated_cost: 150, start_time: '2026-05-01T19:00:00Z', end_time: '2026-05-01T22:00:00Z', section_title: 'NYC Nightlife', trip_title: 'East Coast', place: 'New York' },
  { id: 'seed-us-3', name: 'Central Park Bike Tour', description: 'Cycle through Bethesda Fountain, Strawberry Fields, and the Reservoir.', location: 'New York, USA', activity_type: 'adventure', estimated_cost: 35, start_time: '2026-05-02T10:00:00Z', end_time: '2026-05-02T12:30:00Z', section_title: 'NYC Outdoors', trip_title: 'East Coast', place: 'New York' },
  { id: 'seed-us-4', name: 'Brooklyn Street Food Tour', description: 'Try pizza, dumplings, and artisanal donuts in DUMBO and Williamsburg.', location: 'Brooklyn, USA', activity_type: 'food', estimated_cost: 55, start_time: '2026-05-02T12:00:00Z', end_time: '2026-05-02T15:00:00Z', section_title: 'NYC Food', trip_title: 'East Coast', place: 'New York' },
  { id: 'seed-us-5', name: 'Fifth Avenue Shopping Spree', description: 'Shop at flagship stores from Tiffany\'s to Apple and Nike.', location: 'New York, USA', activity_type: 'shopping', estimated_cost: 200, start_time: '2026-05-02T14:00:00Z', end_time: '2026-05-02T18:00:00Z', section_title: 'NYC Shopping', trip_title: 'East Coast', place: 'New York' },

  // ── Indonesia ──
  { id: 'seed-id-1', name: 'Tegallalang Rice Terrace Trek', description: 'Walk through UNESCO-listed terraced rice paddies in Ubud.', location: 'Ubud, Bali, Indonesia', activity_type: 'sightseeing', estimated_cost: 5, start_time: '2026-07-10T07:00:00Z', end_time: '2026-07-10T09:30:00Z', section_title: 'Ubud Nature', trip_title: 'Bali Retreat', place: 'Bali' },
  { id: 'seed-id-2', name: 'Surf Lesson at Kuta Beach', description: 'Beginner-friendly surf class with certified instructor.', location: 'Kuta, Bali, Indonesia', activity_type: 'adventure', estimated_cost: 30, start_time: '2026-07-10T08:00:00Z', end_time: '2026-07-10T10:00:00Z', section_title: 'Bali Beach', trip_title: 'Bali Retreat', place: 'Bali' },
  { id: 'seed-id-3', name: 'Balinese Cooking Class', description: 'Learn to make nasi goreng, satay, and sambal from scratch.', location: 'Ubud, Bali, Indonesia', activity_type: 'food', estimated_cost: 35, start_time: '2026-07-10T10:00:00Z', end_time: '2026-07-10T13:00:00Z', section_title: 'Bali Food', trip_title: 'Bali Retreat', place: 'Bali' },
  { id: 'seed-id-4', name: 'Tanah Lot Temple Sunset', description: 'Visit the iconic sea temple and watch the sunset over the Indian Ocean.', location: 'Tabanan, Bali, Indonesia', activity_type: 'culture', estimated_cost: 3, start_time: '2026-07-10T16:00:00Z', end_time: '2026-07-10T19:00:00Z', section_title: 'Bali Temples', trip_title: 'Bali Retreat', place: 'Bali' },
  { id: 'seed-id-5', name: 'Balinese Spa & Yoga Retreat', description: 'Full-day wellness package with yoga, meditation, and flower bath.', location: 'Ubud, Bali, Indonesia', activity_type: 'relaxation', estimated_cost: 70, start_time: '2026-07-11T08:00:00Z', end_time: '2026-07-11T15:00:00Z', section_title: 'Bali Wellness', trip_title: 'Bali Retreat', place: 'Bali' },
  { id: 'seed-id-6', name: 'Sukawati Art Market Shopping', description: 'Bargain for handmade crafts, batik, and silver jewelry.', location: 'Gianyar, Bali, Indonesia', activity_type: 'shopping', estimated_cost: 40, start_time: '2026-07-11T09:00:00Z', end_time: '2026-07-11T12:00:00Z', section_title: 'Bali Shopping', trip_title: 'Bali Retreat', place: 'Bali' },

  // ── Spain ──
  { id: 'seed-es-1', name: 'Sagrada Familia Guided Tour', description: 'Explore Gaudí\'s unfinished masterpiece with skip-the-line access.', location: 'Barcelona, Spain', activity_type: 'culture', estimated_cost: 26, start_time: '2026-08-15T10:00:00Z', end_time: '2026-08-15T12:00:00Z', section_title: 'Gaudí Barcelona', trip_title: 'Spain & Portugal', place: 'Barcelona' },
  { id: 'seed-es-2', name: 'La Boqueria Market Tapas Tour', description: 'Sample jamón ibérico, fresh seafood, and vermouth at the famous market.', location: 'Barcelona, Spain', activity_type: 'food', estimated_cost: 50, start_time: '2026-08-15T12:00:00Z', end_time: '2026-08-15T14:30:00Z', section_title: 'Barcelona Food', trip_title: 'Spain & Portugal', place: 'Barcelona' },
  { id: 'seed-es-3', name: 'Park Güell & Gothic Quarter Walk', description: 'See Gaudí\'s mosaic park then wander medieval streets.', location: 'Barcelona, Spain', activity_type: 'sightseeing', estimated_cost: 10, start_time: '2026-08-15T15:00:00Z', end_time: '2026-08-15T18:00:00Z', section_title: 'Barcelona Walks', trip_title: 'Spain & Portugal', place: 'Barcelona' },
  { id: 'seed-es-4', name: 'Flamenco Show in El Born', description: 'Authentic flamenco performance with drinks in a historic venue.', location: 'Barcelona, Spain', activity_type: 'culture', estimated_cost: 45, start_time: '2026-08-15T21:00:00Z', end_time: '2026-08-15T22:30:00Z', section_title: 'Barcelona Nights', trip_title: 'Spain & Portugal', place: 'Barcelona' },
  { id: 'seed-es-5', name: 'Passeig de Gràcia Shopping', description: 'Shop luxury brands and modernist architecture along the grand boulevard.', location: 'Barcelona, Spain', activity_type: 'shopping', estimated_cost: 150, start_time: '2026-08-16T10:00:00Z', end_time: '2026-08-16T14:00:00Z', section_title: 'Barcelona Shopping', trip_title: 'Spain & Portugal', place: 'Barcelona' },

  // ── UAE ──
  { id: 'seed-ae-1', name: 'Burj Khalifa At The Top', description: 'Visit the observation deck on the 148th floor of the world\'s tallest building.', location: 'Dubai, UAE', activity_type: 'sightseeing', estimated_cost: 40, start_time: '2026-11-01T17:00:00Z', end_time: '2026-11-01T18:30:00Z', section_title: 'Dubai Icons', trip_title: 'Middle East', place: 'Dubai' },
  { id: 'seed-ae-2', name: 'Desert Safari & BBQ Dinner', description: 'Dune bashing, camel riding, and Bedouin-style dinner under the stars.', location: 'Dubai, UAE', activity_type: 'adventure', estimated_cost: 75, start_time: '2026-11-01T15:00:00Z', end_time: '2026-11-01T21:00:00Z', section_title: 'Dubai Adventure', trip_title: 'Middle East', place: 'Dubai' },
  { id: 'seed-ae-3', name: 'Gold Souk & Spice Souk Tour', description: 'Haggle for gold jewelry and exotic spices in Old Dubai.', location: 'Dubai, UAE', activity_type: 'shopping', estimated_cost: 20, start_time: '2026-11-02T10:00:00Z', end_time: '2026-11-02T13:00:00Z', section_title: 'Old Dubai', trip_title: 'Middle East', place: 'Dubai' },
  { id: 'seed-ae-4', name: 'Emirati Food Tasting Tour', description: 'Try machboos, luqaimat, and Arabic coffee at local restaurants.', location: 'Dubai, UAE', activity_type: 'food', estimated_cost: 55, start_time: '2026-11-02T12:00:00Z', end_time: '2026-11-02T15:00:00Z', section_title: 'Dubai Food', trip_title: 'Middle East', place: 'Dubai' },
  { id: 'seed-ae-5', name: 'Luxury Spa at Burj Al Arab', description: 'Indulge in a gold-infused facial and aromatherapy massage.', location: 'Dubai, UAE', activity_type: 'relaxation', estimated_cost: 200, start_time: '2026-11-02T14:00:00Z', end_time: '2026-11-02T17:00:00Z', section_title: 'Dubai Luxury', trip_title: 'Middle East', place: 'Dubai' },
];

// =============================================
// ACTIVITY / CITY SEARCH (Screen 8)
// Public — no auth required for browsing
// =============================================

// ── GET /api/search/activities ────────────────────────
// Params: q, type, group_by, sort_by, order, min_cost, max_cost, duration, place
router.get('/activities', async (req, res, next) => {
  try {
    const { q, type, group_by, sort_by, order, min_cost, max_cost, duration, place } = req.query;

    // Try DB first
    let rows = [];
    try {
      const filters = [
        { field: ['a.name', 'a.description', 'a.location'], value: q, op: 'ILIKE' },
        { field: 'a.activity_type', value: type },
        { field: 't.place', value: place, op: 'ILIKE' },
      ];

      if (min_cost) filters.push({ field: 'a.estimated_cost', value: parseFloat(min_cost), op: '>=' });
      if (max_cost) filters.push({ field: 'a.estimated_cost', value: parseFloat(max_cost), op: '<=' });

      let durationClause = '';
      if (duration === 'short') {
        durationClause = ` AND EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 3600 < 2`;
      } else if (duration === 'medium') {
        durationClause = ` AND EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 3600 BETWEEN 2 AND 5`;
      } else if (duration === 'long') {
        durationClause = ` AND EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 3600 > 5`;
      }

      const { query, params } = buildQuery({
        baseQuery: `SELECT a.*, s.title AS section_title, t.title AS trip_title, t.place
                    FROM activities a
                    JOIN itinerary_sections s ON a.section_id = s.id
                    JOIN trips t ON s.trip_id = t.id
                    WHERE 1=1${durationClause}`,
        filters,
        sort: {
          allowedFields: ['name', 'estimated_cost', 'created_at'],
          field: sort_by,
          order,
          prefix: 'a',
        },
        pagination: { limit: 50 },
      });

      const result = await db.query(query, params);
      rows = result.rows;
    } catch (dbErr) {
      // DB empty or error — fall through to seed data
      rows = [];
    }

    // If DB returned nothing, use hardcoded seed data
    let activities = rows.length > 0 ? rows : [...SEED_ACTIVITIES];

    // Apply filters to seed data when using fallback
    if (rows.length === 0) {
      activities = activities.filter(a => {
        if (q) {
          const query = q.toLowerCase();
          const matchesSearch =
            (a.name && a.name.toLowerCase().includes(query)) ||
            (a.description && a.description.toLowerCase().includes(query)) ||
            (a.location && a.location.toLowerCase().includes(query));
          if (!matchesSearch) return false;
        }
        if (type && a.activity_type !== type) return false;
        if (place && a.place && !a.place.toLowerCase().includes(place.toLowerCase())) return false;
        if (min_cost && a.estimated_cost < parseFloat(min_cost)) return false;
        if (max_cost && a.estimated_cost > parseFloat(max_cost)) return false;
        if (duration) {
          if (a.start_time && a.end_time) {
            const hours = (new Date(a.end_time) - new Date(a.start_time)) / 3600000;
            if (duration === 'short' && hours >= 2) return false;
            if (duration === 'medium' && (hours < 2 || hours > 5)) return false;
            if (duration === 'long' && hours <= 5) return false;
          }
        }
        return true;
      });

      // Apply sorting to seed data
      if (sort_by) {
        const dir = order === 'desc' ? -1 : 1;
        activities.sort((a, b) => {
          if (sort_by === 'name') return dir * (a.name || '').localeCompare(b.name || '');
          if (sort_by === 'estimated_cost') return dir * ((a.estimated_cost || 0) - (b.estimated_cost || 0));
          if (sort_by === 'created_at') return dir;
          return 0;
        });
      }
    }

    // Group-by support
    if (group_by === 'type' || group_by === 'place') {
      const key = group_by === 'type' ? 'activity_type' : 'place';
      const grouped = {};
      for (const row of activities) {
        const group = row[key] || 'other';
        (grouped[group] ||= []).push(row);
      }
      return res.json({ grouped: true, data: grouped });
    }

    res.json(activities);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/search/cities ────────────────────────────
// Params: q, country, region, min_score, sort_by, order
router.get('/cities', async (req, res, next) => {
  try {
    const { q, country, region, min_score, sort_by, order } = req.query;

    const filters = [
      { field: ['r.name', 'r.country'], value: q, op: 'ILIKE' },
      { field: 'r.country', value: country },
      { field: 'r.name', value: region, op: 'ILIKE' },
    ];

    // Popularity score threshold
    if (min_score) filters.push({ field: 'r.popularity_score', value: parseFloat(min_score), op: '>=' });

    const { query, params } = buildQuery({
      baseQuery: `SELECT r.*, COUNT(ps.id)::int AS suggestion_count
                  FROM regions r
                  LEFT JOIN place_suggestions ps ON ps.region_id = r.id
                  WHERE 1=1`,
      filters,
      sort: {
        allowedFields: ['name', 'popularity_score', 'country'],
        field: sort_by,
        order,
        prefix: 'r',
      },
      pagination: { limit: 30 },
    });

    // Add GROUP BY before ORDER BY
    const finalQuery = query.replace(' ORDER BY', ' GROUP BY r.id ORDER BY');

    const { rows } = await db.query(finalQuery, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

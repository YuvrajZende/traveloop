const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { buildQuery, requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// PLACE → COVER IMAGE MAP
// Used when creating a trip without an explicit cover_image_url
// =============================================
const PLACE_IMAGES = {
  // Japan
  'tokyo':    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'osaka':    'https://images.unsplash.com/photo-1590559899731-a382839e5547?w=800&q=80',
  'kyoto':    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  'nara':     'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  'sapporo':  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
  'fukuoka':  'https://images.unsplash.com/photo-1562591970-2f85a5d48e60?w=800&q=80',
  // Thailand
  'bangkok':       'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
  'chiang mai':    'https://images.unsplash.com/photo-1598935898639-31bc415458f7?w=800&q=80',
  'phuket':        'https://images.unsplash.com/photo-1583417317751-5f98f3b8e9b7?w=800&q=80',
  // Indonesia
  'bali':        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'jakarta':     'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80',
  'yogyakarta':  'https://images.unsplash.com/photo-1584810359583-96fc37433a07?w=800&q=80',
  // Singapore & Malaysia
  'singapore':      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'kuala lumpur':   'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
  'penang':         'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
  // Vietnam
  'hanoi':          'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80',
  'ho chi minh city': 'https://images.unsplash.com/photo-1583417317751-5f98f3b8e9b7?w=800&q=80',
  'da nang':        'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=800&q=80',
  // South Korea
  'seoul':   'https://images.unsplash.com/photo-1538485399081-7191377e8256?w=800&q=80',
  'busan':   'https://images.unsplash.com/photo-1579033461380-adb47c9efbab?w=800&q=80',
  'jeju':    'https://images.unsplash.com/photo-1568290747146-47705d4e0c68?w=800&q=80',
  // China
  'beijing':   'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
  'shanghai':  'https://images.unsplash.com/photo-1538425749076-8a07d32d3e31?w=800&q=80',
  'chengdu':   'https://images.unsplash.com/photo-1591070668238-5d08b31a204a?w=800&q=80',
  // Hong Kong & Taiwan
  'hong kong': 'https://images.unsplash.com/photo-1550757750-4c18480e17b3?w=800&q=80',
  'taipei':    'https://images.unsplash.com/photo-1583951645605-6c7e1b88e8c1?w=800&q=80',
  // India
  'mumbai':  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  'delhi':   'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'jaipur':  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'goa':     'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  // UAE & Qatar
  'dubai':       'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  'abu dhabi':   'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80',
  'doha':        'https://images.unsplash.com/photo-1575986134074-5ed42c6f0449?w=800&q=80',
  // France
  'paris':   'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'lyon':    'https://images.unsplash.com/photo-1563841930606-67e2bce48b9c?w=800&q=80',
  'nice':    'https://images.unsplash.com/photo-1533552755457-1b1e9046e298?w=800&q=80',
  'bordeaux':'https://images.unsplash.com/photo-1563841930606-67e2bce48b9c?w=800&q=80',
  // Italy
  'rome':     'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'milan':    'https://images.unsplash.com/photo-1570939274451-a35188255443?w=800&q=80',
  'florence': 'https://images.unsplash.com/photo-1543429258-c5ca390b0f66?w=800&q=80',
  'venice':   'https://images.unsplash.com/photo-1514890547358-a73d5f16c6e0?w=800&q=80',
  'naples':   'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80',
  // Spain
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
  'madrid':    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
  'seville':   'https://images.unsplash.com/photo-1559392020-68360e45b4f6?w=800&q=80',
  'granada':   'https://images.unsplash.com/photo-1564485377539-4af72d1f6a2f?w=800&q=80',
  // UK
  'london':    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'edinburgh': 'https://images.unsplash.com/photo-1565626424177-8c7b4d331638?w=800&q=80',
  'manchester':'https://images.unsplash.com/photo-1572506790915-7f17a5538284?w=800&q=80',
  // Netherlands, Germany, Austria, Czech
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
  'berlin':    'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
  'munich':    'https://images.unsplash.com/photo-1598257006458-0871d85f0098?w=800&q=80',
  'hamburg':   'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&q=80',
  'vienna':    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
  'salzburg':  'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
  'prague':    'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80',
  // Hungary, Poland, Greece
  'budapest':  'https://images.unsplash.com/photo-1551867633-194f137a5dd8?w=800&q=80',
  'warsaw':    'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800&q=80',
  'krakow':    'https://images.unsplash.com/photo-1563721345600-01f8b3f8e4e3?w=800&q=80',
  'athens':    'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'mykonos':   'https://images.unsplash.com/photo-1601581975053-7c04847c3e1b?w=800&q=80',
  // Portugal
  'lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80',
  'porto':  'https://images.unsplash.com/photo-1559056199-6952bf8d56a0?w=800&q=80',
  // Turkey
  'istanbul':    'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'cappadocia':  'https://images.unsplash.com/photo-1605558057410-49d5e0d23e9f?w=800&q=80',
  // Switzerland
  'zurich':      'https://images.unsplash.com/photo-1514825284325-3f808a5777d0?w=800&q=80',
  'interlaken':  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
  'geneva':      'https://images.unsplash.com/photo-1514825284325-3f808a5777d0?w=800&q=80',
  // Belgium, Denmark, Sweden, Norway, Finland, Ireland
  'brussels':    'https://images.unsplash.com/photo-1551094099-5c05e8e0f5f5?w=800&q=80',
  'copenhagen':  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'stockholm':   'https://images.unsplash.com/photo-1520769669658-f072785e74a4?w=800&q=80',
  'oslo':        'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80',
  'helsinki':    'https://images.unsplash.com/photo-1519677100203-a0e68c92439?w=800&q=80',
  'dublin':      'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=80',
  // Iceland, Croatia
  'reykjavik':   'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
  'dubrovnik':   'https://images.unsplash.com/photo-1555990456-04a43ae5975a?w=800&q=80',
  'split':       'https://images.unsplash.com/photo-1555990456-04a43ae5975a?w=800&q=80',
  // USA
  'new york':      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  'los angeles':   'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80',
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
  'chicago':       'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80',
  'miami':         'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&q=80',
  'las vegas':     'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&q=80',
  'new orleans':   'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
  'seattle':       'https://images.unsplash.com/photo-1502175353174-a7a70e73b6b4?w=800&q=80',
  'boston':        'https://images.unsplash.com/photo-1519677100203-a0e68c92439?w=800&q=80',
  // Canada
  'toronto':   'https://images.unsplash.com/photo-1517935706615-271b9a085b68?w=800&q=80',
  'vancouver': 'https://images.unsplash.com/photo-155951126053e-91d8a765b8d0?w=800&q=80',
  'montreal':  'https://images.unsplash.com/photo-1517935706615-271b9a085b68?w=800&q=80',
  // Mexico
  'mexico city': 'https://images.unsplash.com/photo-1518105779142-d975f2291788?w=800&q=80',
  'cancun':      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80',
  'tulum':       'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80',
  // South America
  'rio de janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
  'são paulo':      'https://images.unsplash.com/photo-1573052905904-34ad8c27f0c5?w=800&q=80',
  'buenos aires':   'https://images.unsplash.com/photo-1589909202802-e4b9e83a7e63?w=800&q=80',
  'lima':           'https://images.unsplash.com/photo-1580745294857-df39cee37c88?w=800&q=80',
  'cusco':          'https://images.unsplash.com/photo-1580745294857-df39cee37c88?w=800&q=80',
  'bogotá':         'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80',
  'cartagena':      'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80',
  // Africa & Middle East
  'cairo':      'https://images.unsplash.com/photo-1572286258217-40142c1c6a70?w=800&q=80',
  'luxor':      'https://images.unsplash.com/photo-1572286258217-40142c1c6a70?w=800&q=80',
  'marrakech':  'https://images.unsplash.com/photo-1597212618440-80611c9618f3?w=800&q=80',
  'cape town':  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
  'nairobi':    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80',
  'zanzibar':   'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80',
  // Australia & New Zealand
  'sydney':     'https://images.unsplash.com/photo-1506973035872-a4c1629ee14e?w=800&q=80',
  'melbourne':  'https://images.unsplash.com/photo-1514395462725-fb45692a8e64?w=800&q=80',
  'brisbane':   'https://images.unsplash.com/photo-1506973035872-a4c1629ee14e?w=800&q=80',
  'auckland':   'https://images.unsplash.com/photo-1507699622108-4be3abd695e8?w=800&q=80',
  'queenstown': 'https://images.unsplash.com/photo-1507699622108-4be3abd695e8?w=800&q=80',
  // Europe misc
  'brussels':   'https://images.unsplash.com/photo-1551094099-5c05e8e0f5f5?w=800&q=80',
};

function getCoverImageForPlace(place) {
  if (!place) return null;
  const key = place.toLowerCase().trim();
  if (PLACE_IMAGES[key]) return PLACE_IMAGES[key];
  // Partial match
  for (const [city, url] of Object.entries(PLACE_IMAGES)) {
    if (key.includes(city) || city.includes(key)) return url;
  }
  return null;
}

// ── POST /api/trips  (Screen 4 — create a new trip) ───
router.post('/',
  authenticateToken,
  requireFields('title', 'place', 'start_date', 'end_date'),
  async (req, res, next) => {
    try {
      const { title, description, place, start_date, end_date, total_budget, cover_image_url, is_preplanned } = req.body;

      const finalCoverImage = cover_image_url || getCoverImageForPlace(place);

      const { rows } = await db.query(
        `INSERT INTO trips
          (user_id, title, description, place, start_date, end_date, total_budget, cover_image_url, is_preplanned)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
          RETURNING *`,
        [req.user.id, title, description, place, start_date, end_date, total_budget, finalCoverImage, is_preplanned || false]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/trips  (Screen 6 — user trip listing) ────
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { status, search, sort_by, order, page, limit } = req.query;

    const { query, params } = buildQuery({
      baseQuery: 'SELECT * FROM trips WHERE user_id = $1',
      baseParams: [req.user.id],
      filters: [
        { field: 'status', value: status },
        { field: ['title', 'place'], value: search, op: 'ILIKE' },
      ],
      sort: {
        allowedFields: ['created_at', 'start_date', 'end_date', 'title', 'place'],
        field: sort_by,
        order,
      },
      pagination: { page, limit },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/trips/:id  (Single trip detail) ──────────
router.get('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Trip not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/trips/:id  (Update trip) ─────────────────
router.put('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { title, description, place, start_date, end_date, total_budget, cover_image_url, status, is_preplanned } = req.body;

    const { rows } = await db.query(
      `UPDATE trips SET
         title           = COALESCE($1, title),
         description     = COALESCE($2, description),
         place           = COALESCE($3, place),
         start_date      = COALESCE($4, start_date),
         end_date        = COALESCE($5, end_date),
         total_budget    = COALESCE($6, total_budget),
         cover_image_url = COALESCE($7, cover_image_url),
         status          = COALESCE($8, status),
         is_preplanned   = COALESCE($9, is_preplanned),
         updated_at      = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [title, description, place, start_date, end_date, total_budget,
       cover_image_url, status, is_preplanned, req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Trip not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/trips/:id ─────────────────────────────
router.delete('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Trip not found');
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

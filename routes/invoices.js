const router = require('express').Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const { buildQuery, requireFields, validateUUID } = require('../utils/helpers');

// =============================================
// EXPENSE INVOICE / BILLING (Screen 14)
// =============================================

/**
 * Generate a collision-resistant invoice number.
 * Format: INV-vyg-{timestamp_hex}-{random}
 */
const generateInvoiceNumber = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-vyg-${ts}-${rand}`;
};

// ── GET /api/invoices ─────────────────────────────────
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const { search, payment_status, sort_by, order, page, limit } = req.query;

    const { query, params } = buildQuery({
      baseQuery: `SELECT inv.*, t.title AS trip_title, t.place AS trip_place,
                         t.start_date AS trip_start, t.end_date AS trip_end
                  FROM invoices inv
                  JOIN trips t ON inv.trip_id = t.id
                  WHERE inv.user_id = $1`,
      baseParams: [req.user.id],
      filters: [
        { field: ['inv.invoice_number', 't.title'], value: search, op: 'ILIKE' },
        { field: 'inv.payment_status', value: payment_status },
      ],
      sort: {
        allowedFields: ['generated_date', 'grand_total', 'payment_status'],
        field: sort_by,
        order,
        prefix: 'inv',
      },
      pagination: { page, limit },
    });

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/invoices/:id  (Full detail) ──────────────
router.get('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    // Parallel fetch: invoice, items, travelers
    const [invoiceRes, itemsRes] = await Promise.all([
      db.query(
        `SELECT inv.*, t.title AS trip_title, t.place AS trip_place,
                t.start_date AS trip_start, t.end_date AS trip_end,
                t.cover_image_url AS trip_image, t.total_budget
         FROM invoices inv
         JOIN trips t ON inv.trip_id = t.id
         WHERE inv.id = $1 AND inv.user_id = $2`,
        [req.params.id, req.user.id]
      ),
      db.query(
        'SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY item_number ASC',
        [req.params.id]
      ),
    ]);

    if (invoiceRes.rows.length === 0) throw AppError.notFound('Invoice not found');

    const invoice = invoiceRes.rows[0];

    const travelersRes = await db.query(
      'SELECT name, email, role FROM trip_travelers WHERE trip_id = $1',
      [invoice.trip_id]
    );

    const totalSpent = parseFloat(invoice.grand_total) || 0;
    const totalBudget = parseFloat(invoice.total_budget) || 0;

    res.json({
      ...invoice,
      items: itemsRes.rows,
      travelers: travelersRes.rows,
      budget_insights: {
        total_budget: totalBudget,
        total_spent: totalSpent,
        remaining: totalBudget - totalSpent,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/invoices  (Create — uses DB transaction) ──
router.post('/',
  authenticateToken,
  requireFields('trip_id', 'items'),
  async (req, res, next) => {
    try {
      const { trip_id, items, tax_percent, discount } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        throw AppError.badRequest('Items must be a non-empty array');
      }

      // Validate each item
      for (const item of items) {
        if (!item.category || !item.description || !item.unit_cost) {
          throw AppError.badRequest('Each item requires category, description, and unit_cost');
        }
      }

      const invoice = await db.transaction(async (client) => {
        // Verify trip ownership
        const tripRes = await client.query(
          'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
          [trip_id, req.user.id]
        );
        if (tripRes.rows.length === 0) throw AppError.notFound('Trip not found');

        // Calculate totals
        const subtotal = items.reduce((sum, item) => {
          return sum + ((item.quantity || 1) * item.unit_cost);
        }, 0);
        const taxPct = tax_percent || 5;
        const taxAmount = +(subtotal * (taxPct / 100)).toFixed(2);
        const disc = discount || 0;
        const grandTotal = +(subtotal + taxAmount - disc).toFixed(2);

        // Insert invoice
        const invoiceRes = await client.query(
          `INSERT INTO invoices
            (trip_id, user_id, invoice_number, subtotal, tax_percent, tax_amount, discount, grand_total)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [trip_id, req.user.id, generateInvoiceNumber(), subtotal, taxPct, taxAmount, disc, grandTotal]
        );

        const inv = invoiceRes.rows[0];

        // Batch insert line items
        const values = [];
        const placeholders = [];
        let idx = 1;

        items.forEach((item, i) => {
          const qty = item.quantity || 1;
          const amount = +(qty * item.unit_cost).toFixed(2);
          placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6})`);
          values.push(inv.id, i + 1, item.category, item.description, qty, item.unit_cost, amount);
          idx += 7;
        });

        await client.query(
          `INSERT INTO invoice_items (invoice_id, item_number, category, description, quantity, unit_cost, amount)
           VALUES ${placeholders.join(', ')}`,
          values
        );

        return inv;
      });

      res.status(201).json(invoice);
    } catch (err) {
      next(err);
    }
  }
);

// ── PATCH /api/invoices/:id/mark-paid ─────────────────
router.patch('/:id/mark-paid', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `UPDATE invoices SET payment_status = 'paid', updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Invoice not found');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/invoices/:id ──────────────────────────
router.delete('/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM invoices WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) throw AppError.notFound('Invoice not found');
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    next(err);
  }
});

// =============================================
// TRIP TRAVELERS
// =============================================

// ── GET /api/invoices/travelers/:tripId ───────────────
router.get('/travelers/:tripId', authenticateToken, validateUUID('tripId'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM trip_travelers WHERE trip_id = $1',
      [req.params.tripId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/invoices/travelers ──────────────────────
router.post('/travelers',
  authenticateToken,
  requireFields('trip_id', 'name'),
  async (req, res, next) => {
    try {
      const { trip_id, name, email, role } = req.body;

      const { rows } = await db.query(
        `INSERT INTO trip_travelers (trip_id, user_id, name, email, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [trip_id, req.user.id, name, email, role || 'member']
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/invoices/travelers/:id ────────────────
router.delete('/travelers/:id', authenticateToken, validateUUID('id'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'DELETE FROM trip_travelers WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (rows.length === 0) throw AppError.notFound('Traveler not found');
    res.json({ message: 'Traveler removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

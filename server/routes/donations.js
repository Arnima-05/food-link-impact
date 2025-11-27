import { Router } from 'express';
import FoodDonation from '../models/FoodDonation.js';
import Profile from '../models/Profile.js';
import Match from '../models/Match.js';

const router = Router();

// GET /api/donations/available
router.get('/available', async (_req, res) => {
  try {
    const donations = await FoodDonation.find({ status: 'available' }).lean();
    const restaurantIds = Array.from(new Set(donations.map((d) => d.restaurant_id)));
    const profiles = await Profile.find({ id: { $in: restaurantIds } }).lean();
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const enriched = donations.map((d) => ({
      ...d,
      restaurant_profile: profileMap.get(d.restaurant_id) || null,
    }));

    res.json({ donations: enriched });
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// GET /api/donations/by-restaurant/:id
router.get('/by-restaurant/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const donations = await FoodDonation.find({ restaurant_id: restaurantId }).lean();
    res.json({ donations });
  } catch (err) {
    console.error('Error fetching restaurant donations:', err);
    res.status(500).json({ error: 'Failed to fetch restaurant donations' });
  }
});

// POST /api/donations/create
router.post('/create', async (req, res) => {
  try {
    const body = req.body || {};

    if (!body.restaurant_id) {
      return res.status(400).json({ error: 'restaurant_id is required' });
    }

    const donation = await FoodDonation.create({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...body,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    res.status(201).json({ donation });
  } catch (err) {
    console.error('Error creating donation:', err);
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

// POST /api/donations/accept
// body: { donationId, ngoId, restaurantId, acceptedQuantity }
router.post('/accept', async (req, res) => {
  const { donationId, ngoId, restaurantId, acceptedQuantity } = req.body || {};

  if (!donationId || !ngoId || !restaurantId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const donation = await FoodDonation.findOne({ id: donationId });
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.status !== 'available') {
      return res.status(409).json({ error: 'Donation not available' });
    }

    const nowISO = new Date().toISOString();
    await Match.create({
      donation_id: donationId,
      ngo_id: ngoId,
      restaurant_id: restaurantId,
      matched_at: nowISO,
      status: 'pending',
      accepted_quantity: acceptedQuantity ?? donation.quantity,
    });

    const qtyAccepted = acceptedQuantity ?? donation.quantity;
    const isFull = qtyAccepted >= donation.quantity;

    // Update donation
    if (isFull) {
      donation.status = 'reserved';
    } else {
      donation.quantity = Math.max(0, donation.quantity - qtyAccepted);
    }
    await donation.save();

    // Increment contributor counter
    await Profile.updateOne(
      { id: restaurantId },
      { $inc: { contributionsCount: 1 } },
      { upsert: true }
    );

    const updated = await FoodDonation.findOne({ id: donationId }).lean();
    res.json({ donation: updated, full: isFull });
  } catch (err) {
    console.error('Error accepting donation:', err);
    res.status(500).json({ error: 'Failed to accept donation' });
  }
});

export default router;

// PATCH /api/donations/:id/fulfill
router.patch('/:id/fulfill', async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await FoodDonation.findOne({ id });
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    donation.status = 'fulfilled';
    donation.updated_at = new Date().toISOString();
    await donation.save();

    // Update related matches as picked_up and set fulfilled time
    await Match.updateMany(
      { donation_id: id },
      { $set: { status: 'picked_up', fulfilled_at: new Date().toISOString() } }
    );

    const updated = await FoodDonation.findOne({ id }).lean();
    return res.json({ donation: updated });
  } catch (err) {
    console.error('Error fulfilling donation:', err);
    return res.status(500).json({ error: 'Failed to fulfill donation' });
  }
});

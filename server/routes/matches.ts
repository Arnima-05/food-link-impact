import { Router } from 'express';
import Match from '../models/Match';
import FoodDonation from '../models/FoodDonation';
import Profile from '../models/Profile';

const router = Router();

// GET /api/matches/by-ngo/:id
router.get('/by-ngo/:id', async (req, res) => {
  try {
    const ngoId = req.params.id;
    const matches = await Match.find({ ngo_id: ngoId }).lean();

    const donationIds = Array.from(new Set(matches.map((m) => m.donation_id)));
    const donations = await FoodDonation.find({ id: { $in: donationIds } }).lean();
    const donationMap = new Map(donations.map((d) => [d.id, d]));

    const restaurantIds = Array.from(new Set(donations.map((d) => d.restaurant_id)));
    const profiles = await Profile.find({ id: { $in: restaurantIds } }).lean();
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const enriched = matches.map((m) => ({
      ...m,
      food_donations: donationMap.get(m.donation_id)
        ? {
            ...donationMap.get(m.donation_id)!,
            profiles: profileMap.get(donationMap.get(m.donation_id)!.restaurant_id) || null,
          }
        : null,
    }));

    res.json({ matches: enriched });
  } catch (err) {
    console.error('Error fetching NGO matches:', err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// PATCH /api/matches/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body as { status: 'scheduled' | 'picked_up' | 'cancelled' };
    const update: any = { status };
    if (status === 'picked_up') {
      update.fulfilled_at = new Date().toISOString();
    }
    await Match.updateOne({ _id: id }, update);
    const match = await Match.findOne({ _id: id }).lean();
    res.json({ match });
  } catch (err) {
    console.error('Error updating match status:', err);
    res.status(500).json({ error: 'Failed to update match status' });
  }
});

export default router;


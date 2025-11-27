import { Router } from 'express';
import mongoose from 'mongoose';
import Profile from '../models/Profile.js';

const router = Router();

// Register or update a profile, then return it
router.post('/register', async (req, res) => {
  try {
    const {
      full_name,
      email,
      role,
      organization_name,
      phone,
      location,
      address,
    } = req.body || {};

    if (!email || !role || !full_name) {
      return res.status(400).json({ error: 'full_name, email, and role are required' });
    }

    let profile = await Profile.findOne({ email });
    if (!profile) {
      const id = new mongoose.Types.ObjectId().toString();
      profile = new Profile({
        id,
        full_name,
        email,
        role,
        organization_name: organization_name || null,
        phone: phone || null,
        location: location || null,
        address: address || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await profile.save();
    } else {
      profile.full_name = full_name ?? profile.full_name;
      profile.role = role ?? profile.role;
      profile.organization_name = organization_name ?? profile.organization_name;
      profile.phone = phone ?? profile.phone;
      profile.location = location ?? profile.location;
      profile.address = address ?? profile.address;
      profile.updated_at = new Date().toISOString();
      await profile.save();
    }

    return res.json(profile);
  } catch (err) {
    console.error('Register profile error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Login by email only (demo), return profile
router.post('/login', async (req, res) => {
  try {
    const { email, role } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }
    let profile = await Profile.findOne({ email });
    if (!profile) {
      if (role !== 'ngo' && role !== 'restaurant') {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const id = new mongoose.Types.ObjectId().toString();
      profile = new Profile({
        id,
        full_name: email.split('@')[0],
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await profile.save();
    }
    return res.json(profile);
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get profile by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    return res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;

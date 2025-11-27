import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema({
  id: { type: String, required: true, unique: true },
  full_name: { type: String },
  email: { type: String },
  role: { type: String },
  organization_name: { type: String },
  phone: { type: String },
  location: { type: String },
  address: { type: String },
  contributionsCount: { type: Number, default: 0 },
  created_at: { type: String },
  updated_at: { type: String },
});

export default mongoose.model('Profile', ProfileSchema);

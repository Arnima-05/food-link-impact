import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema({
  donation_id: { type: String, required: true },
  ngo_id: { type: String, required: true },
  restaurant_id: { type: String, required: true },
  matched_at: { type: String, required: true },
  fulfilled_at: { type: String },
  status: { type: String, required: true, default: 'pending' },
  accepted_quantity: { type: Number },
});

export default mongoose.model('Match', MatchSchema);

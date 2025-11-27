import mongoose, { Schema } from 'mongoose';

const FoodDonationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  restaurant_id: { type: String, required: true },
  food_name: { type: String, required: true },
  food_type: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String },
  description: { type: String },
  pickup_time_start: { type: String },
  pickup_time_end: { type: String },
  expires_at: { type: String },
  location: { type: String },
  image_url: { type: String },
  status: { type: String, required: true, default: 'available' },
  created_at: { type: String },
  updated_at: { type: String },
});

export default mongoose.model('FoodDonation', FoodDonationSchema);

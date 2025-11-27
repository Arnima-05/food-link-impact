import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  donation_id: string;
  ngo_id: string;
  restaurant_id: string;
  matched_at: string;
  fulfilled_at?: string | null;
  status: 'pending' | 'fulfilled';
  accepted_quantity?: number | null;
}

const MatchSchema = new Schema<IMatch>({
  donation_id: { type: String, required: true },
  ngo_id: { type: String, required: true },
  restaurant_id: { type: String, required: true },
  matched_at: { type: String, required: true },
  fulfilled_at: { type: String },
  status: { type: String, required: true, default: 'pending' },
  accepted_quantity: { type: Number },
});

export default mongoose.model<IMatch>('Match', MatchSchema);


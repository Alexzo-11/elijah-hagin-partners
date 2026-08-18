import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
  category: { type: String, default: 'general' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
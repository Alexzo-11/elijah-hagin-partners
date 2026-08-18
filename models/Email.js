import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  recipient: { type: String, enum: ['all', 'active', 'inactive', 'custom'], default: 'all' },
  status: { type: String, enum: ['draft', 'sent', 'scheduled', 'failed'], default: 'draft' },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  scheduledFor: { type: Date },
  sentAt: { type: Date },
  opens: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Email || mongoose.model('Email', EmailSchema);
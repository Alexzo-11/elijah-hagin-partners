import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  userEmail: { type: String },
  action: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['auth', 'partner', 'payment', 'email', 'message', 'settings', 'report', 'login', 'logout'], 
    default: 'auth' 
  },
  details: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
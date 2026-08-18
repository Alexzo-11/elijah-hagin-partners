import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'], required: true },
  data: { type: Object },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  dateRange: {
    start: { type: Date },
    end: { type: Date },
  },
  format: { type: String, enum: ['pdf', 'excel', 'csv'], default: 'pdf' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
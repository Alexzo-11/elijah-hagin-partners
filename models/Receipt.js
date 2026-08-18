import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  purpose: { type: String },
  pdfUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);
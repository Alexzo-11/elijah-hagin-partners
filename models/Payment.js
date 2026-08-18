import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  amount: { type: Number, required: true },
  reference: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  },
  method: { 
    type: String, 
    enum: ['card', 'bank_transfer', 'mobile_money'], 
    required: true 
  },
  purpose: { type: String, default: 'Monthly Partnership' },
  receiptNumber: { 
    type: String,
    default: null 
  },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Ensure no unique index is created
// The index is removed by dropping the collection

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
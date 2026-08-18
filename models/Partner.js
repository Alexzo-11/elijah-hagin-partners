import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  // Personal Information
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  otherNames: { type: String },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date, required: true },
  occupation: { type: String, required: true },
  maritalStatus: { 
    type: String, 
    enum: ['Single', 'Married', 'Divorced', 'Widow', 'Widower'], 
    required: true 
  },
  nationality: { type: String, required: true },
  stateOfOrigin: { type: String, required: true },
  stateOfResidence: { type: String, required: true },
  residentialAddress: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Partnership Details
  partnershipType: { 
    type: String, 
    enum: ['SILVER', 'GOLD', 'DIAMOND'], 
    required: true,
    default: 'SILVER'
  },
  partnershipAmount: { type: Number, required: true },
  
  // Passport - Base64 or URL
  passport: { type: String, required: true },
  
  // Account Status
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'partner' },
  
  // Financials
  totalContributed: { type: Number, default: 0 },
  lastPaymentDate: { type: Date },
  monthlyCommitment: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual for full name
PartnerSchema.virtual('fullName').get(function() {
  return `${this.surname} ${this.firstName}`;
});

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
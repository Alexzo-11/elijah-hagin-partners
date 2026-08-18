'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  Briefcase, 
  Heart, 
  MapPin, 
  Flag,
  Upload,
  X,
  Loader2,
  CheckCircle,
  Users
} from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    otherNames: '',
    gender: '',
    dateOfBirth: '',
    occupation: '',
    maritalStatus: '',
    nationality: '',
    stateOfOrigin: '',
    stateOfResidence: '',
    residentialAddress: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    partnershipType: 'SILVER',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passport, setPassport] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);

  // Partnership tiers with fixed amounts
  const partnershipTiers = {
    SILVER: { label: 'SILVER', amount: 5000, min: 'Below', max: '5,000' },
    GOLD: { label: 'GOLD', amount: 10000, min: '5,000', max: 'Above' },
    DIAMOND: { label: 'DIAMOND', amount: 20000, min: '10,000', max: 'Above' },
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setPassport(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removePassport = () => {
    setPassport(null);
    setPassportPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all required fields
    const requiredFields = ['surname', 'firstName', 'gender', 'dateOfBirth', 'occupation', 
      'maritalStatus', 'nationality', 'stateOfOrigin', 'stateOfResidence', 
      'residentialAddress', 'phone', 'email', 'password', 'confirmPassword'];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!passport) {
      setError('Please upload a passport photograph');
      return;
    }

    setLoading(true);

    // Prepare registration data
    const registrationData = {
      ...formData,
      partnershipAmount: partnershipTiers[formData.partnershipType].amount,
      partnershipLabel: formData.partnershipType,
    };

    // In production, upload passport to Cloudinary or similar
    // For now, convert to base64 for demo
    const reader = new FileReader();
    reader.onloadend = async () => {
      registrationData.passport = reader.result;
      
      const result = await register(registrationData);
      
      if (result.success) {
        router.push('/partner');
      } else {
        setError(result.error || 'Registration failed');
        setLoading(false);
      }
    };
    reader.readAsDataURL(passport);
  };

  const getPartnershipAmount = (type) => {
    return partnershipTiers[type]?.amount || 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7] p-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="card-premium p-6 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E51913] flex items-center justify-center text-white font-extrabold text-sm">
                EX
              </div>
              <span className="font-bold text-lg text-[#4A4C4E]">Exousia Fellowship</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A4C4E] mt-4">Partnership Registration</h1>
            <p className="text-[#4A4C4E]/60 text-sm mt-1">Fill in all fields to become a partner</p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Passport Upload */}
            <div className="bg-[#F5F6F7] rounded-xl p-4">
              <label className="block text-sm font-medium text-[#4A4C4E] mb-2">
                Passport Photograph <span className="text-[#E51913]">*</span>
              </label>
              <div className="flex items-center gap-4">
                {passportPreview ? (
                  <div className="relative">
                    <img 
                      src={passportPreview} 
                      alt="Passport" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#E51913]"
                    />
                    <button
                      type="button"
                      onClick={removePassport}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-full border-2 border-dashed border-[#8A8C8E]/50 flex items-center justify-center cursor-pointer hover:border-[#E51913] transition"
                  >
                    <Upload className="w-6 h-6 text-[#8A8C8E]" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePassportUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-outline text-sm py-2 px-4"
                  >
                    {passportPreview ? 'Change Photo' : 'Upload Passport'}
                  </button>
                  <p className="text-xs text-[#4A4C4E]/40 mt-1">JPG, PNG or GIF (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Surname <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-premium uppercase"
                  placeholder="SURNAME"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  First Name <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-premium uppercase"
                  placeholder="FIRST NAME"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Other Names
                </label>
                <input
                  type="text"
                  className="input-premium uppercase"
                  placeholder="OTHER NAMES"
                  value={formData.otherNames}
                  onChange={(e) => setFormData({ ...formData, otherNames: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Gender <span className="text-[#E51913]">*</span>
                </label>
                <select
                  required
                  className="input-premium"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Date of Birth <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="input-premium"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Occupation <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-premium uppercase"
                  placeholder="OCCUPATION"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Marital Status <span className="text-[#E51913]">*</span>
                </label>
                <select
                  required
                  className="input-premium"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widow">Widow</option>
                  <option value="Widower">Widower</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Nationality <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-premium uppercase"
                  placeholder="NATIONALITY"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  State of Origin <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-premium uppercase"
                  placeholder="STATE OF ORIGIN"
                  value={formData.stateOfOrigin}
                  onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  State of Residence <span className="text-[#E51913]">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input-premium uppercase"
                  placeholder="STATE OF RESIDENCE"
                  value={formData.stateOfResidence}
                  onChange={(e) => setFormData({ ...formData, stateOfResidence: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                Residential Address <span className="text-[#E51913]">*</span>
              </label>
              <textarea
                required
                className="input-premium"
                rows="2"
                placeholder="Enter your full residential address"
                value={formData.residentialAddress}
                onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Phone Number <span className="text-[#E51913]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
                  <input
                    type="tel"
                    required
                    className="input-premium pl-10"
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Email Address <span className="text-[#E51913]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
                  <input
                    type="email"
                    required
                    className="input-premium pl-10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Partnership Type Selection */}
            <div className="bg-[#F5F6F7] rounded-xl p-4">
              <label className="block text-sm font-medium text-[#4A4C4E] mb-3">
                Type of Partnership <span className="text-[#E51913]">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(partnershipTiers).map(([key, tier]) => (
                  <label
                    key={key}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.partnershipType === key 
                        ? 'border-[#E51913] bg-[#E51913]/5 shadow-lg shadow-[#E51913]/10' 
                        : 'border-[#E5E6E7] hover:border-[#E51913]/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="partnershipType"
                      value={key}
                      checked={formData.partnershipType === key}
                      onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        formData.partnershipType === key ? 'text-[#E51913]' : 'text-[#4A4C4E]'
                      }`}>
                        {tier.label}
                      </div>
                      <div className="text-sm text-[#4A4C4E]/60 mt-1">
                        {tier.min} {tier.max}
                      </div>
                      <div className={`text-xl font-bold mt-2 ${
                        formData.partnershipType === key ? 'text-[#E51913]' : 'text-[#4A4C4E]'
                      }`}>
                        ₦{tier.amount.toLocaleString()}
                      </div>
                      {formData.partnershipType === key && (
                        <div className="mt-2">
                          <CheckCircle className="w-5 h-5 text-[#E51913] mx-auto" />
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#4A4C4E]/40 mt-3 text-center">
                Your partnership amount is fixed at ₦{getPartnershipAmount(formData.partnershipType).toLocaleString()} for {formData.partnershipType} tier
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Password <span className="text-[#E51913]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-premium pl-10 pr-10"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4C4E]/30 hover:text-[#4A4C4E]/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Confirm Password <span className="text-[#E51913]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-premium pl-10"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register as Partner
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-[#4A4C4E]/60 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="text-[#E51913] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
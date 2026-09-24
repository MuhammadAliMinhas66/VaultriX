import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String },
    role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'owner' },
    plan: { type: String, enum: ['standard', 'premium'], default: 'standard' },
    country: { type: String },
    currency: { type: String, default: 'PKR' },
    language: { type: String, default: 'en' },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const expiresIn10Minutes = { expires: 600 };
const otpSchema = new mongoose.Schema(
  {
    email: { type: String },
    newEmail: { type: String },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: expiresIn10Minutes },
  },
  { timestamps: true }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;

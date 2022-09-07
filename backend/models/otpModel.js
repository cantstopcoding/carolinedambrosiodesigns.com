import mongoose from 'mongoose';

const expiresIn5Minutes = { expires: 300 };
const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: expiresIn5Minutes },
  },
  { timestamps: true }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;

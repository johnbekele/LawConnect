import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Document expires after 5 minutes (300 seconds)
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    default: 'email' // Set default value
  }
});

// Export the Mongoose model as a default export
export default mongoose.model('otp', otpSchema);
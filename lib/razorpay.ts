// lib/razorpay.ts
import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('❌ Missing Razorpay environment variables.');
}

// 🧪 Debug logging
console.log('🔐 Creating Razorpay instance with:', {
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET?.slice(0, 6) + '...(hidden)',
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

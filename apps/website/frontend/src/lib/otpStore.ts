import crypto from 'crypto';

interface OTPData {
  email: string;
  hash: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

// In-memory store (for production, use Redis/DB)
const globalForOTP = global as unknown as { otpStore: Map<string, OTPData> };
const otpStore = globalForOTP.otpStore || new Map<string, OTPData>();
if (process.env.NODE_ENV !== 'production') globalForOTP.otpStore = otpStore;

const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN = 30 * 1000; // 30 seconds

export function generateOTP(): string {
  // Generate 6 digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function saveOTP(email: string, otp: string) {
  const now = Date.now();
  const existing = otpStore.get(email);
  
  // Cooldown check
  if (existing && now - existing.createdAt < RESEND_COOLDOWN) {
    throw new Error('Please wait before requesting a new OTP');
  }

  const hash = hashOTP(otp);
  
  otpStore.set(email, {
    email,
    hash,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY,
    attempts: 0,
  });
}

export function verifyOTP(email: string, otp: string): { success: boolean; message?: string } {
  const record = otpStore.get(email);
  
  if (!record) {
    return { success: false, message: 'No OTP requested for this email' };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(email);
    return { success: false, message: 'This code has expired. Please request a new one.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(email);
    return { success: false, message: 'Too many attempts. Please request a new code.' };
  }

  record.attempts += 1;
  const hash = hashOTP(otp);

  if (record.hash !== hash) {
    // Save attempts back
    otpStore.set(email, record);
    return { success: false, message: 'The verification code is incorrect.' };
  }

  // Success
  otpStore.delete(email);
  return { success: true };
}

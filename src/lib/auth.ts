import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';

const SESSION_EXPIRY_HOURS = 7 * 24; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function getSessionExpiry(): Date {
  const now = new Date();
  now.setHours(now.getHours() + SESSION_EXPIRY_HOURS);
  return now;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_EXPIRY_HOURS * 60 * 60,
  };
}

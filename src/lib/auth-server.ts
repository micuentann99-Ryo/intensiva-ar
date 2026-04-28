import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    // Clean up expired session
    if (session) {
      await db.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  if (!session.user.isActive) return null;

  return session.user;
}

export type UserFull = {
  id: string;
  email: string;
  name: string;
  role: string;
  professorStatus?: string | null;
  specialization?: string | null;
  bio?: string | null;
  phone?: string | null;
  university?: string | null;
  yearOfStudy?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
};

export async function userFullData(userId: string): Promise<UserFull | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      professorStatus: true,
      specialization: true,
      bio: true,
      phone: true,
      university: true,
      yearOfStudy: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

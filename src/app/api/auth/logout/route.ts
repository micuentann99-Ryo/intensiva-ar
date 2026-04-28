import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-context';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const user = await getSessionUser();
    if (user) {
      const cookieStore = await cookies();
      cookieStore.delete('session_token');

      // Delete session from DB
      await db.session.deleteMany({ where: { userId: user.id } });

      await db.activityLog.create({
        data: { userId: user.id, action: 'logout' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true }); // Always succeed on logout
  }
}

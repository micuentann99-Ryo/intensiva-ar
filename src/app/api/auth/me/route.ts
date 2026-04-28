import { NextResponse } from 'next/server';
import { getSessionUser, userFullData } from '@/lib/auth-server';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const fullUser = await userFullData(user.id);

    return NextResponse.json({ user: fullUser });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

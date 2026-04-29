import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const professors = await db.user.findMany({
      where: {
        role: 'PROFESSOR',
        isActive: true,
        professorStatus: 'APPROVED',
      },
      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ professors });
  } catch (error) {
    console.error('Error fetching professors:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

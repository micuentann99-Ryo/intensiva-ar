import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const reports = await db.bugReport.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Bug reports list error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { reportId, status, resolution } = await request.json();

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const updated = await db.bugReport.update({
      where: { id: reportId },
      data: { status, resolution: resolution || null },
    });

    return NextResponse.json({ report: updated });
  } catch (error) {
    console.error('Bug report update error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

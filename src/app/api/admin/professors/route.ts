import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const professors = await db.user.findMany({
      where: { role: 'PROFESSOR' },
      select: {
        id: true,
        email: true,
        name: true,
        professorStatus: true,
        specialization: true,
        bio: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        _count: { select: { activitySubmissions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ professors });
  } catch (error) {
    console.error('Admin professors error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { professorId, status } = await request.json();

    if (!professorId || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const professor = await db.user.findUnique({ where: { id: professorId } });
    if (!professor || professor.role !== 'PROFESSOR') {
      return NextResponse.json({ error: 'Profesor no encontrado' }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id: professorId },
      data: {
        professorStatus: status,
        isActive: status === 'APPROVED',
      },
    });

    // Log
    await db.activityLog.create({
      data: {
        userId: admin.id,
        action: `professor_${status.toLowerCase()}`,
        details: JSON.stringify({ professorId, professorName: professor.name }),
      },
    });

    return NextResponse.json({ professor: updated });
  } catch (error) {
    console.error('Professor approve/reject error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

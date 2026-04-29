import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const activity = await db.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ activity });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { content, fileUrls } = await request.json();

    if (!content && (!fileUrls || fileUrls.length === 0)) {
      return NextResponse.json({ error: 'Contenido o archivos son obligatorios' }, { status: 400 });
    }

    const activity = await db.activity.findUnique({ where: { id } });
    if (!activity) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    // Upsert submission
    const submission = await db.activitySubmission.upsert({
      where: {
        userId_activityId: { userId: user.id, activityId: id },
      },
      update: {
        content: content || '',
        status: 'pending',
        grade: null,
        feedback: null,
      },
      create: {
        userId: user.id,
        activityId: id,
        content: content || '',
      },
    });

    // Log
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'submit_activity',
        details: JSON.stringify({ activityId: id, activityTitle: activity.title, fileCount: fileUrls?.length || 0 }),
        page: `/actividades/${id}/resolver`,
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Activity submit error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

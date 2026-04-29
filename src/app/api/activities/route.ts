import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const courseSlug = searchParams.get('course');

    const where: Record<string, unknown> = {};
    if (subject) where.subject = subject;
    if (courseSlug) where.courseSlug = courseSlug;

    const activities = await db.activity.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { activityId, content } = await request.json();

    if (!activityId || !content) {
      return NextResponse.json({ error: 'Actividad y contenido son obligatorios' }, { status: 400 });
    }

    const activity = await db.activity.findUnique({ where: { id: activityId } });
    if (!activity) {
      return NextResponse.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    // Upsert: update if already submitted, create if new
    const submission = await db.activitySubmission.upsert({
      where: {
        userId_activityId: { userId: user.id, activityId },
      },
      update: {
        content,
        status: 'pending',
        grade: null,
        feedback: null,
      },
      create: {
        userId: user.id,
        activityId,
        content,
      },
    });

    // Log
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'submit_activity',
        details: JSON.stringify({ activityId, activityTitle: activity.title }),
        page: `/materias/${activity.subject}/${activity.courseSlug}/actividades`,
      },
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Activity submit error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

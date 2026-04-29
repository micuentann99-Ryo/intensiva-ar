import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get all activities
    const allActivities = await db.activity.findMany({
      orderBy: [
        { subject: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    // Get all submissions for this student
    const submissions = await db.activitySubmission.findMany({
      where: { userId: user.id },
      include: {
        activity: {
          select: {
            title: true,
            periodName: true,
            type: true,
            difficulty: true,
            subject: true,
            courseSlug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build a map of activityId -> submission
    const submissionMap = new Map<string, (typeof submissions)[0]>();
    for (const sub of submissions) {
      submissionMap.set(sub.activityId, sub);
    }

    // Combine activities with their submissions
    const activitiesWithStatus = allActivities.map((activity) => {
      const sub = submissionMap.get(activity.id);
      return {
        ...activity,
        submission: sub
          ? {
              id: sub.id,
              content: sub.content,
              grade: sub.grade,
              feedback: sub.feedback,
              status: sub.status,
              createdAt: sub.createdAt,
              updatedAt: sub.updatedAt,
            }
          : null,
      };
    });

    // Stats
    const total = allActivities.length;
    const submitted = submissions.length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const reviewed = submissions.filter((s) => s.status === 'reviewed').length;
    const avgGrade =
      submissions.filter((s) => s.status === 'reviewed' && s.grade != null).length > 0
        ? submissions
            .filter((s) => s.status === 'reviewed' && s.grade != null)
            .reduce((acc, s) => acc + (s.grade || 0), 0) /
          submissions.filter((s) => s.status === 'reviewed' && s.grade != null).length
        : null;

    // Group by subject
    const bySubject: Record<string, typeof activitiesWithStatus> = {};
    for (const a of activitiesWithStatus) {
      if (!bySubject[a.subject]) bySubject[a.subject] = [];
      bySubject[a.subject].push(a);
    }

    return NextResponse.json({
      activities: activitiesWithStatus,
      bySubject,
      stats: {
        total,
        submitted,
        pending,
        reviewed,
        avgGrade: avgGrade ? Math.round(avgGrade * 10) / 10 : null,
        notSubmitted: total - submitted,
      },
    });
  } catch (error) {
    console.error('Student activities error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const [
      totalUsers,
      totalStudents,
      totalProfessors,
      pendingProfessors,
      totalActivities,
      totalSubmissions,
      pendingSubmissions,
      reviewedSubmissions,
      openBugReports,
      resolvedBugReports,
      totalLogs,
      recentLogs,
      recentSubmissions,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: 'STUDENT' } }),
      db.user.count({ where: { role: 'PROFESSOR' } }),
      db.user.count({ where: { role: 'PROFESSOR', professorStatus: 'PENDING' } }),
      db.activity.count(),
      db.activitySubmission.count(),
      db.activitySubmission.count({ where: { status: 'pending' } }),
      db.activitySubmission.count({ where: { status: 'reviewed' } }),
      db.bugReport.count({ where: { status: 'open' } }),
      db.bugReport.count({ where: { status: 'resolved' } }),
      db.activityLog.count(),
      db.activityLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, role: true } } },
      }),
      db.activitySubmission.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          activity: { select: { title: true, periodName: true, type: true, difficulty: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStudents,
        totalProfessors,
        pendingProfessors,
        totalActivities,
        totalSubmissions,
        pendingSubmissions,
        reviewedSubmissions,
        openBugReports,
        resolvedBugReports,
        totalLogs,
      },
      recentLogs,
      recentSubmissions,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

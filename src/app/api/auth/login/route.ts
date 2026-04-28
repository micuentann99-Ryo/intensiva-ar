import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateSessionToken, getSessionExpiry, getSessionCookieOptions } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = getSessionExpiry();

    await db.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Log the action
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    await db.activityLog.create({
      data: {
        userId: user.id,
        action: 'login',
        ipAddress,
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, getSessionCookieOptions());

    // Check if professor is pending
    if (user.role === 'PROFESSOR' && user.professorStatus === 'PENDING') {
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          professorStatus: user.professorStatus,
        },
        message: 'Tu solicitud de profesor está pendiente de aprobación.',
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

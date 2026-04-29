import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, university, yearOfStudy, specialization, bio, phone } = await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, contraseña y nombre son obligatorios' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedRole = role === 'PROFESSOR' ? 'PROFESSOR' : 'STUDENT';

    // Check if user exists
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese email' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    // Create user
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
        role: normalizedRole,
        professorStatus: normalizedRole === 'PROFESSOR' ? 'PENDING' : null,
        specialization: normalizedRole === 'PROFESSOR' ? specialization : null,
        bio: normalizedRole === 'PROFESSOR' ? bio : null,
        phone: phone || null,
        university: normalizedRole === 'STUDENT' ? university : null,
        yearOfStudy: normalizedRole === 'STUDENT' ? yearOfStudy : null,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        professorStatus: user.professorStatus,
      },
      message: normalizedRole === 'PROFESSOR'
        ? 'Solicitud enviada. El administrador revisará tu perfil.'
        : 'Cuenta creada exitosamente.',
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

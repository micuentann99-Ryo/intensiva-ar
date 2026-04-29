import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio, phone, university, yearOfStudy, specialization } = body;

    // Validate name if provided
    if (name !== undefined && (!name || name.trim().length < 2)) {
      return NextResponse.json({ error: 'El nombre debe tener al menos 2 caracteres' }, { status: 400 });
    }

    // Build update data dynamically
    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio?.trim() || null;
    if (phone !== undefined) updateData.phone = phone?.trim() || null;

    // Role-specific fields
    if (user.role === 'STUDENT') {
      if (university !== undefined) updateData.university = university?.trim() || null;
      if (yearOfStudy !== undefined) updateData.yearOfStudy = yearOfStudy?.trim() || null;
    }
    if (user.role === 'PROFESSOR') {
      if (specialization !== undefined) updateData.specialization = specialization?.trim() || null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No hay cambios para guardar' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        professorStatus: true,
        specialization: true,
        bio: true,
        phone: true,
        university: true,
        yearOfStudy: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser, message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

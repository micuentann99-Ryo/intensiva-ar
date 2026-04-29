import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    const { subject, description, page } = await request.json();

    if (!subject || !description) {
      return NextResponse.json({ error: 'Asunto y descripción son obligatorios' }, { status: 400 });
    }

    if (description.length < 10) {
      return NextResponse.json({ error: 'La descripción es demasiado corta (mínimo 10 caracteres)' }, { status: 400 });
    }

    const report = await db.bugReport.create({
      data: {
        userId: user?.id || null,
        subject,
        description,
        page: page || null,
      },
    });

    return NextResponse.json({
      report,
      message: 'Reporte enviado correctamente. Gracias por tu ayuda.',
    }, { status: 201 });
  } catch (error) {
    console.error('Bug report error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

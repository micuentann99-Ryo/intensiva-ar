import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';
import { Prisma } from '@prisma/client';

const MESSAGES_PER_PAGE = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');

    // Verify conversation exists and user is part of it
    const conversation = await db.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        initiatorId: true,
        participantId: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }

    if (conversation.initiatorId !== user.id && conversation.participantId !== user.id) {
      return NextResponse.json({ error: 'Sin acceso a esta conversación' }, { status: 403 });
    }

    // Mark unread messages from others as read
    await db.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: user.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    // Build query with optional cursor pagination
    const whereClause: Prisma.MessageWhereInput = { conversationId: id };

    if (cursor) {
      const cursorMessage = await db.message.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });

      if (cursorMessage) {
        whereClause.createdAt = { gt: cursorMessage.createdAt };
      }
    }

    const messages = await db.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: MESSAGES_PER_PAGE,
    });

    const hasMore = messages.length === MESSAGES_PER_PAGE;
    const nextCursor = hasMore ? messages[messages.length - 1].id : null;

    return NextResponse.json({
      messages,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Get messages error:', error);
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
    const body = await request.json();
    const { content, type, fileUrl, fileName, fileSize, mimeType } = body;

    if (!content && !fileUrl) {
      return NextResponse.json(
        { error: 'El contenido o archivo es obligatorio' },
        { status: 400 }
      );
    }

    // Verify conversation exists and user is part of it
    const conversation = await db.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        initiatorId: true,
        participantId: true,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }

    if (conversation.initiatorId !== user.id && conversation.participantId !== user.id) {
      return NextResponse.json({ error: 'Sin acceso a esta conversación' }, { status: 403 });
    }

    const messageType = type || 'text';

    // Create message and update conversation in a transaction
    const [message] = await db.$transaction([
      db.message.create({
        data: {
          conversationId: id,
          senderId: user.id,
          content: content || '',
          type: messageType,
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          fileSize: fileSize ? Number(fileSize) : null,
          mimeType: mimeType || null,
        },
        include: {
          sender: {
            select: { id: true, name: true, role: true },
          },
        },
      }),
      db.conversation.update({
        where: { id },
        data: {
          lastMessageAt: new Date(),
          lastMessagePreview: content
            ? content.substring(0, 100)
            : fileName || 'Archivo adjunto',
        },
      }),
    ]);

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';
import { Prisma } from '@prisma/client';

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

    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        initiator: {
          select: { id: true, name: true, role: true },
        },
        participant: {
          select: { id: true, name: true, role: true },
        },
        messages: {
          where: {
            senderId: { not: user.id },
            isRead: false,
          },
          select: { id: true },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }

    // Verify user is part of the conversation
    if (conversation.initiatorId !== user.id && conversation.participantId !== user.id) {
      return NextResponse.json({ error: 'Sin acceso a esta conversación' }, { status: 403 });
    }

    // Mark unread messages as read
    if (conversation.messages.length > 0) {
      const unreadIds = conversation.messages.map((m) => m.id);
      await db.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { isRead: true },
      });
    }

    const isInitiator = conversation.initiatorId === user.id;
    const otherParticipant = isInitiator
      ? { id: conversation.participant.id, name: conversation.participant.name, role: conversation.participant.role }
      : { id: conversation.initiator.id, name: conversation.initiator.name, role: conversation.initiator.role };

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        otherParticipant,
        subject: conversation.subject,
        courseSlug: conversation.courseSlug,
        activityId: conversation.activityId,
        activityTitle: conversation.activityTitle,
        activityType: conversation.activityType,
        lastMessageAt: conversation.lastMessageAt,
        lastMessagePreview: conversation.lastMessagePreview,
        unreadCount: 0, // All marked as read
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(
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

    // Verify conversation exists and user is part of it
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        initiator: { select: { id: true } },
        participant: { select: { id: true } },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
    }

    if (conversation.initiatorId !== user.id && conversation.participantId !== user.id) {
      return NextResponse.json({ error: 'Sin acceso a esta conversación' }, { status: 403 });
    }

    const updateData: Prisma.ConversationUpdateInput = {};

    if (body.lastMessageAt !== undefined) {
      updateData.lastMessageAt = new Date(body.lastMessageAt);
    }

    if (body.lastMessagePreview !== undefined) {
      updateData.lastMessagePreview = body.lastMessagePreview;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron campos para actualizar' },
        { status: 400 }
      );
    }

    const updatedConversation = await db.conversation.update({
      where: { id },
      data: updateData,
      include: {
        initiator: { select: { id: true, name: true, role: true } },
        participant: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ conversation: updatedConversation });
  } catch (error) {
    console.error('Update conversation error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

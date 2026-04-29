import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth-server';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const whereClause: Prisma.ConversationWhereInput = {
      OR: [
        { initiatorId: user.id },
        { participantId: user.id },
      ],
    };

    const conversations = await db.conversation.findMany({
      where: whereClause,
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
      orderBy: { lastMessageAt: 'desc' },
    });

    const formattedConversations = conversations.map((conv) => {
      const isInitiator = conv.initiatorId === user.id;
      const otherParticipant = isInitiator
        ? { id: conv.participant.id, name: conv.participant.name, role: conv.participant.role }
        : { id: conv.initiator.id, name: conv.initiator.name, role: conv.initiator.role };

      // Apply role filter if specified
      if (role) {
        if (role === 'student' && otherParticipant.role !== 'STUDENT') return null;
        if (role === 'professor' && otherParticipant.role !== 'PROFESSOR') return null;
      }

      return {
        id: conv.id,
        otherParticipant,
        subject: conv.subject,
        courseSlug: conv.courseSlug,
        activityId: conv.activityId,
        activityTitle: conv.activityTitle,
        activityType: conv.activityType,
        lastMessageAt: conv.lastMessageAt,
        lastMessagePreview: conv.lastMessagePreview,
        unreadCount: conv.messages.length,
        createdAt: conv.createdAt,
      };
    });

    return NextResponse.json({
      conversations: formattedConversations.filter(Boolean),
    });
  } catch (error) {
    console.error('List conversations error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { participantId, activityId, subject, courseSlug, activityTitle, activityType } = body;

    if (!participantId || !subject) {
      return NextResponse.json(
        { error: 'participantId y subject son obligatorios' },
        { status: 400 }
      );
    }

    // Validate participant is a professor
    const participant = await db.user.findUnique({
      where: { id: participantId },
      select: { id: true, role: true, isActive: true },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (participant.role !== 'PROFESSOR') {
      return NextResponse.json(
        { error: 'Solo puedes iniciar conversaciones con profesores' },
        { status: 400 }
      );
    }

    if (!participant.isActive) {
      return NextResponse.json({ error: 'Este usuario no está activo' }, { status: 400 });
    }

    // Check if conversation already exists between same two users about same activity
    const existingConversation = await db.conversation.findFirst({
      where: {
        OR: [
          { initiatorId: user.id, participantId },
          { initiatorId: participantId, participantId: user.id },
        ],
        ...(activityId ? { activityId } : { activityId: null }),
      },
      include: {
        initiator: { select: { id: true, name: true, role: true } },
        participant: { select: { id: true, name: true, role: true } },
        messages: {
          where: {
            senderId: { not: user.id },
            isRead: false,
          },
          select: { id: true },
        },
      },
    });

    if (existingConversation) {
      const isInitiator = existingConversation.initiatorId === user.id;
      const otherParticipant = isInitiator
        ? { id: existingConversation.participant.id, name: existingConversation.participant.name, role: existingConversation.participant.role }
        : { id: existingConversation.initiator.id, name: existingConversation.initiator.name, role: existingConversation.initiator.role };

      return NextResponse.json({
        conversation: {
          id: existingConversation.id,
          otherParticipant,
          subject: existingConversation.subject,
          courseSlug: existingConversation.courseSlug,
          activityId: existingConversation.activityId,
          activityTitle: existingConversation.activityTitle,
          activityType: existingConversation.activityType,
          lastMessageAt: existingConversation.lastMessageAt,
          lastMessagePreview: existingConversation.lastMessagePreview,
          unreadCount: existingConversation.messages.length,
          createdAt: existingConversation.createdAt,
        },
        message: 'Conversación existente encontrada',
      });
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        initiatorId: user.id,
        participantId,
        activityId: activityId || null,
        subject,
        courseSlug: courseSlug || null,
        activityTitle: activityTitle || null,
        activityType: activityType || null,
      },
      include: {
        initiator: { select: { id: true, name: true, role: true } },
        participant: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json(
      {
        conversation: {
          id: conversation.id,
          otherParticipant: {
            id: conversation.participant.id,
            name: conversation.participant.name,
            role: conversation.participant.role,
          },
          subject: conversation.subject,
          courseSlug: conversation.courseSlug,
          activityId: conversation.activityId,
          activityTitle: conversation.activityTitle,
          activityType: conversation.activityType,
          lastMessageAt: conversation.lastMessageAt,
          lastMessagePreview: conversation.lastMessagePreview,
          unreadCount: 0,
          createdAt: conversation.createdAt,
        },
        message: 'Conversación creada exitosamente',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

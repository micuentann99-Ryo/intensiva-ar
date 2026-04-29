'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FilePreview } from './file-preview';

/* ─── Types ─────────────────────────────────────────────────────── */

export interface ChatMessage {
  id: string;
  content: string;
  type: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  senderId: string;
  sender: { id: string; name: string; role: string };
  createdAt: string;
}

interface OtherParticipant {
  id: string;
  name: string;
  role: string;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  showAvatar: boolean;
  otherParticipant: OtherParticipant;
}

/* ─── Helpers ───────────────────────────────────────────────────── */

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const palette = [
    '#007AFF', '#34C759', '#FF9500', '#FF3B30',
    '#AF52DE', '#5AC8FA', '#FF2D55', '#5856D6',
  ];
  return palette[Math.abs(hash) % palette.length];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return format(date, 'HH:mm');
}

/* ─── Border-radius logic (iMessage style) ──────────────────────── */

function bubbleRadius({
  isOwn,
  isFirst,
  isLast,
  hasFile,
}: {
  isOwn: boolean;
  isFirst: boolean;
  isLast: boolean;
  hasFile: boolean;
}): string {
  const r = hasFile ? '16px' : '18px';
  const t = '6px'; // tail corner

  if (isOwn) {
    // Sent → tail on bottom-right
    if (isFirst && isLast) return `border-radius: ${r} ${r} ${t} ${r}`;
    if (isFirst) return `border-radius: ${r} ${r} ${t} ${r}`;
    if (isLast) return `border-radius: ${r} ${t} ${t} ${r}`;
    return `border-radius: ${r} ${t} ${t} ${r}`;
  }
  // Received → tail on bottom-left
  if (isFirst && isLast) return `border-radius: ${r} ${r} ${r} ${t}`;
  if (isFirst) return `border-radius: ${r} ${r} ${r} ${t}`;
  if (isLast) return `border-radius: ${t} ${r} ${r} ${t}`;
  return `border-radius: ${t} ${r} ${r} ${t}`;
}

/* ─── Component ─────────────────────────────────────────────────── */

export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  isFirstInGroup,
  isLastInGroup,
  showAvatar,
  otherParticipant,
}: MessageBubbleProps) {
  const hasFile = !!message.fileUrl;
  const hasOnlyFile = hasFile && !message.content?.trim();
  const timeStr = formatMessageTime(message.createdAt);

  // Bubble background
  const bgClass = isOwn
    ? 'bg-[#007AFF] dark:bg-[#0A84FF] text-white'
    : 'bg-[#E9E9EB] dark:bg-[#2C2C2E] text-black dark:text-white';

  // Link colors inside bubbles
  const linkClass = isOwn
    ? 'text-white/90 underline'
    : 'text-[#007AFF] dark:text-[#5AC8FA] underline';

  const radius = bubbleRadius({
    isOwn,
    isFirst: isFirstInGroup,
    isLast: isLastInGroup,
    hasFile,
  });

  return (
    <div
      className={cn(
        'flex w-full',
        isOwn ? 'justify-end' : 'justify-start',
        isLastInGroup ? 'mb-2' : 'mb-[3px]'
      )}
    >
      {/* Avatar placeholder (received) */}
      {!isOwn && (
        <div className="w-[30px] shrink-0 mr-[6px]">
          {showAvatar && isFirstInGroup && (
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold mt-auto"
              style={{ backgroundColor: getAvatarColor(otherParticipant.name) }}
            >
              {getInitials(otherParticipant.name)}
            </div>
          )}
        </div>
      )}

      {/* Bubble + time column */}
      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start', 'max-w-[75%] sm:max-w-[65%]')}>
        {/* Bubble */}
        <div
          className={cn(
            bgClass,
            'px-[10px] py-[7px] relative',
            hasOnlyFile && 'p-1.5 overflow-hidden'
          )}
          style={radius as React.CSSProperties}
        >
          {/* Text content */}
          {message.content?.trim() && (
            <p
              className={cn(
                'text-[15px] leading-[1.35] break-words whitespace-pre-wrap',
                hasFile && 'mt-1'
              )}
            >
              {message.content.trim()}
            </p>
          )}

          {/* File preview */}
          {hasFile && (
            <FilePreview
              fileUrl={message.fileUrl!}
              fileName={message.fileName}
              fileSize={message.fileSize}
              mimeType={message.mimeType}
              type={message.type}
              compact
            />
          )}
        </div>

        {/* Timestamp (only for last message in group) */}
        {isLastInGroup && (
          <span
            className={cn(
              'text-[11px] text-gray-500 dark:text-gray-400 mt-[3px] px-1 select-none',
              isOwn ? 'text-right mr-1' : 'text-left ml-1'
            )}
          >
            {timeStr}
          </span>
        )}
      </div>
    </div>
  );
});

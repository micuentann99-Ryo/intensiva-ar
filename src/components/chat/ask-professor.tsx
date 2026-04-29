'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MessageCircle, Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface Professor {
  id: string;
  name: string;
  email: string;
  specialization?: string | null;
}

interface AskProfessorProps {
  activity: {
    id: string;
    subject: string;
    courseSlug: string;
    periodName: string;
    title: string;
    type: string;
    description: string;
  };
  variant?: 'button' | 'inline';
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF2D55', '#5856D6', '#00C7BE', '#FF3B30'];
  return colors[Math.abs(hash) % colors.length];
}

export default function AskProfessor({ activity, variant = 'button' }: AskProfessorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/professors');
      if (res.ok) {
        const data = await res.json();
        setProfessors(data.professors || []);
      }
    } catch {}
    setLoading(false);
  };

  const handleClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (professors.length === 0) {
      fetchProfessors();
    }
    setDialogOpen(true);
  };

  const createConversation = async (professorId: string) => {
    setCreating(true);
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: professorId,
          activityId: activity.id,
          subject: activity.subject,
          courseSlug: activity.courseSlug,
          activityTitle: activity.title,
          activityType: activity.type,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDialogOpen(false);
        router.push(`/chat/${data.conversation.id}`);
      }
    } catch {}
    setCreating(false);
  };

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
        >
          <MessageCircle className="size-3.5" />
          Preguntar al profesor
        </button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="size-5 text-emerald-600" />
                Preguntar al profesor
              </DialogTitle>
              <DialogDescription>
                Elegí a qué profesor querés consultar sobre esta actividad.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1 mt-2">
              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actividad</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{activity.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.subject} · {activity.periodName} · {activity.type}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : professors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No hay profesores disponibles en este momento.
                </p>
              ) : (
                professors.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => createConversation(prof.id)}
                    disabled={creating}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                  >
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback
                        className="text-white text-xs font-semibold"
                        style={{ backgroundColor: getAvatarColor(prof.name) }}
                      >
                        {getInitials(prof.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {prof.name}
                      </p>
                      {prof.specialization && (
                        <p className="text-xs text-muted-foreground truncate">{prof.specialization}</p>
                      )}
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300"
      >
        <MessageCircle className="size-4" />
        Preguntar al profesor
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="size-5 text-emerald-600" />
              Preguntar al profesor
            </DialogTitle>
            <DialogDescription>
              Elegí a qué profesor querés consultar sobre esta actividad.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1 mt-2">
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Actividad</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.subject} · {activity.periodName} · {activity.type}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : professors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay profesores disponibles en este momento.
              </p>
            ) : (
              professors.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => createConversation(prof.id)}
                  disabled={creating}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback
                      className="text-white text-xs font-semibold"
                      style={{ backgroundColor: getAvatarColor(prof.name) }}
                    >
                      {getInitials(prof.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {prof.name}
                    </p>
                    {prof.specialization && (
                      <p className="text-xs text-muted-foreground truncate">{prof.specialization}</p>
                    )}
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors shrink-0" />
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import { useState, useCallback } from 'react';
import { FileText, Download, FileIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  fileUrl: string;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  type?: string;
  /** Compact mode when rendered inside a chat bubble */
  compact?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageType(mimeType?: string | null, type?: string | null): boolean {
  if (type === 'image') return true;
  if (!mimeType) return false;
  return mimeType.startsWith('image/');
}

function isPdfType(mimeType?: string | null, fileName?: string | null): boolean {
  if (mimeType === 'application/pdf') return true;
  if (fileName?.toLowerCase().endsWith('.pdf')) return true;
  return false;
}

export function FilePreview({
  fileUrl,
  fileName,
  fileSize,
  mimeType,
  type,
  compact = false,
}: FilePreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isImage = isImageType(mimeType, type) && !imgError;
  const isPdf = isPdfType(mimeType, fileName);

  const handleImageClick = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  // ── Image preview ──────────────────────────────────────────────
  if (isImage) {
    return (
      <>
        <button
          type="button"
          onClick={handleImageClick}
          className={cn(
            'block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/40 rounded-2xl',
            compact ? 'mt-0.5' : ''
          )}
          aria-label={fileName ? `Ver imagen: ${fileName}` : 'Ver imagen'}
        >
          <img
            src={fileUrl}
            alt={fileName || 'Imagen'}
            className="max-w-[250px] max-h-[300px] rounded-2xl object-cover cursor-pointer transition-opacity group-hover:opacity-90"
            onError={() => setImgError(true)}
          />
        </button>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            className="max-w-[90vw] max-h-[90vh] p-1 sm:p-2 bg-black/95 border-white/10 rounded-2xl overflow-hidden"
            showCloseButton={true}
          >
            <DialogTitle className="sr-only">
              {fileName ? `Imagen: ${fileName}` : 'Vista de imagen'}
            </DialogTitle>
            <img
              src={fileUrl}
              alt={fileName || 'Imagen'}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ── File / PDF preview ─────────────────────────────────────────
  const Icon = isPdf ? FileText : FileIcon;
  const iconColor = isPdf
    ? 'text-red-500 dark:text-red-400'
    : 'text-[#007AFF] dark:text-[#5AC8FA]';

  return (
    <a
      href={fileUrl}
      download={fileName || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
        'hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/40',
        compact ? 'max-w-[260px]' : 'max-w-[300px]'
      )}
      aria-label={fileName ? `Descargar: ${fileName}` : 'Descargar archivo'}
    >
      <div
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
          isPdf
            ? 'bg-red-50 dark:bg-red-900/30'
            : 'bg-[#007AFF]/10 dark:bg-[#5AC8FA]/10'
        )}
      >
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate leading-tight">
          {fileName || 'Archivo'}
        </p>
        {fileSize != null && (
          <p className="text-xs opacity-60 mt-0.5">{formatFileSize(fileSize)}</p>
        )}
      </div>
      <Download className="w-4 h-4 opacity-40 shrink-0" />
    </a>
  );
}

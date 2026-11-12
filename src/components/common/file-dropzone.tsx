'use client';

import { useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react';
import { IconUpload } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface IFileDropzone {
  /** Main call to action, e.g. "Choose a file". Replaced by the file name once a file is picked. */
  label: string;
  hint?: string;
  fileName?: string;
  accept?: string;
  icon?: ReactNode;
  className?: string;
  onFile: (file: File) => void;
}

/** Dashed click-or-drop area for a single file (same look as the event poster dropzone). */
export function FileDropzone({ label, hint, fileName, accept, icon, className, onFile }: IFileDropzone) {
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <label
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border px-4 py-5 text-center transition-colors',
        'hover:border-brand/50 hover:bg-brand-soft/30 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30',
        dragOver && 'border-brand bg-brand-soft/40',
        className,
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-strong [&>svg]:h-5 [&>svg]:w-5">{icon ?? <IconUpload stroke={1.75} aria-hidden />}</span>
      <span className="max-w-full truncate text-sm font-semibold text-foreground">{fileName || label}</span>
      {hint && <span className="max-w-full text-xs text-muted-foreground">{hint}</span>}
      <input type="file" accept={accept} className="sr-only" onChange={handleChange} />
    </label>
  );
}

'use client';

import { useRef, useState } from 'react';
import { IconGripVertical } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'sonner';
import ActionButton from '@/components/common/action-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { routeEvents } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { ReadAttachmentResponseDto } from '@/infrastructure/clients/dtos/attachment/read-attachment.response.dto';
import { updateAttachmentOrder } from '@/infrastructure/clients/attachment.client';
import { compareByIndex } from '@/functions/compare-by-index';
import { cn } from '@/lib/utils';

interface AttachmentsListProps {
  eventId: string;
  attachments: ReadAttachmentResponseDto[];
}

function sortByIndex(attachments: ReadAttachmentResponseDto[]) {
  return [...attachments].sort(compareByIndex);
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const AttachmentsList = ({ eventId, attachments }: AttachmentsListProps) => {
  const t = useTranslations('/events/eventid/attachments');
  const tAccommodation = useTranslations('/events/eventid/accommodations');
  const { data: session } = useSession();
  const [items, setItems] = useState(() => sortByIndex(attachments));
  const [isSaving, setIsSaving] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  const reorder = async (from: number, to: number) => {
    if (from === to || isSaving || from < 0 || to < 0 || from >= items.length || to >= items.length) return;

    const previous = items;
    const next = moveItem(items, from, to).map((attachment, index) => ({ ...attachment, index }));
    setItems(next);
    setIsSaving(true);

    try {
      await updateAttachmentOrder(
        eventId,
        next.map(attachment => attachment.id),
        session,
      );
    } catch (error: unknown) {
      setItems(previous);
      const message = error instanceof Error && error.message ? error.message : t('toastReorderFailed');
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const clearDrag = () => {
    dragFrom.current = null;
    setDraggingIndex(null);
    setDropIndex(null);
  };

  return (
    <>
      <Toaster richColors />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <span className="sr-only">{t('tooltipDragAttachment')}</span>
            </TableHead>
            <TableHead>{tAccommodation('tableColDescription')}</TableHead>
            <TableHead className="w-[1%] whitespace-nowrap text-right">{tAccommodation('tableColActions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                {t('textNoAttachments')}
              </TableCell>
            </TableRow>
          ) : (
            items.map((attachment, index) => (
              <TableRow
                key={attachment.id}
                onDragOver={event => {
                  event.preventDefault();
                  if (dragFrom.current != null) setDropIndex(index);
                }}
                onDrop={event => {
                  event.preventDefault();
                  const from = dragFrom.current;
                  clearDrag();
                  if (from != null) void reorder(from, index);
                }}
                className={cn(dropIndex === index && draggingIndex !== index && 'bg-secondary-light', draggingIndex === index && 'opacity-60')}
              >
                <TableCell className="w-10 pr-0">
                  <button
                    type="button"
                    draggable={!isSaving}
                    aria-label={t('tooltipDragAttachment')}
                    title={t('tooltipDragAttachment')}
                    className="inline-flex h-10 w-10 cursor-grab items-center justify-center rounded-lg text-muted-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSaving || items.length < 2}
                    onDragStart={event => {
                      dragFrom.current = index;
                      setDraggingIndex(index);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                    }}
                    onDragEnd={clearDrag}
                  >
                    <IconGripVertical className="h-5 w-5" stroke={2} />
                  </button>
                </TableCell>
                <TableCell className="font-medium">{attachment.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ActionButton href={`${routeEvents}/${eventId}/attachments/${attachment.id}/edit`} action={Action.EDIT} tooltip={t('tooltipEditDocument')} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default AttachmentsList;

'use client';

import { useRef, useState } from 'react';
import { IconGripVertical } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toast, Toaster } from 'sonner';
import ActionButton from '@/components/common/action-button';
import { routeAds } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { imgImagePlaceholder } from '@/domain/constants/images';
import { ReadAdvertisementResponseDto } from '@/infrastructure/clients/dtos/advertisement/read-advertisement-response-dto';
import { AdvertisementOrderError, updateAdvertisementOrder } from '@/infrastructure/clients/advertisement.client';
import { cn } from '@/lib/utils';

interface AdsListProps {
  advertisements: ReadAdvertisementResponseDto[];
}

function sortByDisplayOrder(advertisements: ReadAdvertisementResponseDto[]) {
  return [...advertisements].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Ads management list with drag & drop ordering (same pattern as sponsors / attachments / accommodations). */
const AdsList = ({ advertisements }: AdsListProps) => {
  const t = useTranslations('/ads');
  const { data: session } = useSession();
  const [items, setItems] = useState(() => sortByDisplayOrder(advertisements));
  const [isSaving, setIsSaving] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  const reorder = async (from: number, to: number) => {
    if (from === to || isSaving || from < 0 || to < 0 || from >= items.length || to >= items.length) return;

    const previous = items;
    const next = moveItem(items, from, to).map((advertisement, index) => ({ ...advertisement, displayOrder: index }));
    setItems(next);
    setIsSaving(true);

    try {
      await updateAdvertisementOrder(
        next.map(advertisement => advertisement.id),
        session,
      );
    } catch (error: unknown) {
      setItems(previous);
      if (error instanceof AdvertisementOrderError && error.status === 404 && (!error.message || error.message.startsWith('Cannot '))) {
        // route missing (endpoint not deployed on this backend yet)
        toast.error(t('toastReorderUnavailable'));
      } else {
        const message = error instanceof Error && error.message ? error.message : t('toastReorderFailed');
        toast.error(message);
      }
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
      {items.length > 1 && <p className="mb-3 text-sm text-muted-foreground">{t('hintReorder')}</p>}
      <ul className="flex flex-col gap-3" data-testid="ads-list">
        {items.map((advertisement, index) => (
          <li
            key={advertisement.id ?? index}
            data-testid="ads-list-item"
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
            className={cn(
              'flex min-w-0 items-center gap-2 rounded-2xl border border-border bg-background p-3 shadow-xs transition-colors sm:gap-3 sm:p-4',
              dropIndex === index && draggingIndex !== index && 'border-brand bg-secondary-light',
              draggingIndex === index && 'opacity-60',
            )}
          >
            <button
              type="button"
              draggable={!isSaving}
              aria-label={t('tooltipDragAd')}
              title={t('tooltipDragAd')}
              className="inline-flex h-10 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-muted-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50 sm:w-10"
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

            {/* eslint-disable-next-line @next/next/no-img-element -- remote ad creatives from the backend */}
            <img
              src={advertisement.imageUrl || imgImagePlaceholder}
              alt=""
              className={cn('h-16 w-16 shrink-0 rounded-xl bg-muted sm:h-20 sm:w-20', advertisement.imageUrl ? 'object-cover' : 'object-contain p-4 opacity-40 dark:invert')}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate font-semibold text-foreground">{advertisement.title}</p>
                <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-2xs font-semibold', advertisement.enabled ? 'bg-brand-soft text-brand-strong' : 'bg-muted text-muted-foreground')}>
                  {advertisement.enabled ? t('chipActive') : t('chipInactive')}
                </span>
              </div>
              {advertisement.description && <p className="line-clamp-2 text-sm text-muted-foreground">{advertisement.description}</p>}
              <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <span className="min-w-0 truncate text-xs text-muted-foreground">{hostOf(advertisement.targetUrl)}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <ActionButton href={`${routeAds}/${advertisement.id}/stats`} action={Action.STATISTICS} tooltip={t('tooltipViewStats')} />
                  <ActionButton href={`${routeAds}/${advertisement.id}/edit`} action={Action.EDIT} tooltip={t('tooltipEditAd')} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AdsList;

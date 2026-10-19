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
import { CurrencyCode } from '@/domain/enums/currency-code';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { getCurrencySymbol } from '@/functions/get-currency-symbol';
import { ReadAccommodationResponseDto } from '@/infrastructure/clients/dtos/accommodation/read-accommodation.response.dto';
import { updateAccommodationOrder } from '@/infrastructure/clients/accommodation.client';
import { compareByIndex } from '@/functions/compare-by-index';
import { cn } from '@/lib/utils';

interface AccommodationsListProps {
  eventId: string;
  currency: CurrencyCode;
  accommodations: ReadAccommodationResponseDto[];
}

function sortByIndex(accommodations: ReadAccommodationResponseDto[]) {
  return [...accommodations].sort(compareByIndex);
}

function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const AccommodationsList = ({ eventId, currency, accommodations }: AccommodationsListProps) => {
  const t = useTranslations('/events/eventid/accommodations');
  const { data: session } = useSession();
  const [items, setItems] = useState(() => sortByIndex(accommodations));
  const [isSaving, setIsSaving] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);

  const reorder = async (from: number, to: number) => {
    if (from === to || isSaving || from < 0 || to < 0 || from >= items.length || to >= items.length) return;

    const previous = items;
    const next = moveItem(items, from, to).map((accommodation, index) => ({ ...accommodation, index }));
    setItems(next);
    setIsSaving(true);

    try {
      await updateAccommodationOrder(
        eventId,
        next.map(accommodation => accommodation.id),
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
              <span className="sr-only">{t('tooltipDragAccommodation')}</span>
            </TableHead>
            <TableHead>{t('tableColDescription')}</TableHead>
            <TableHead className="whitespace-nowrap">
              {t('tableColCost')} ({getCurrencySymbol(currency)})
            </TableHead>
            <TableHead className="w-[1%] whitespace-nowrap text-right">{t('tableColActions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                {t('textNoAccommodations')}
              </TableCell>
            </TableRow>
          ) : (
            items.map((accommodation, index) => (
              <TableRow
                key={accommodation.id}
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
                    aria-label={t('tooltipDragAccommodation')}
                    title={t('tooltipDragAccommodation')}
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
                <TableCell className="font-medium">{accommodation.description}</TableCell>
                <TableCell className="whitespace-nowrap">{convertCurrencyIntegerToDecimal(accommodation.cost, currency)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ActionButton
                      href={`${routeEvents}/${eventId}/accommodations/${accommodation.id}/edit`}
                      action={Action.EDIT}
                      tooltip={t('tooltipEditAccommodation')}
                    />
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

export default AccommodationsList;

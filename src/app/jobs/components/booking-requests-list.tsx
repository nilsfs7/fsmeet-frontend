'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconBan, IconCheck, IconHourglass } from '@tabler/icons-react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { FreestyleActsBookingRequestState } from '@/domain/enums/freestyleacts-booking-request-state';
import { routeJobs } from '@/domain/constants/routes';
import Dialog from '@/components/dialog';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { BookingRequest } from '@/domain/types/booking-request';
import { JobPreferredTravelMethod } from '@/domain/enums/job-preferred-travel-method';
import { CurrencyCode } from '@/domain/enums/currency-code';
import { updateBookingRequest } from '@/infrastructure/clients/freestyleacts.client';
import { convertCurrencyIntegerToDecimal } from '@/functions/currency-conversion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AlertTriangle, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import moment from 'moment';

type StateFilter = 'all' | FreestyleActsBookingRequestState;

const DEFAULT_CAR_KM_RATE_MINOR = 30;

const STATE_SORT_RANK: Record<FreestyleActsBookingRequestState, number> = {
  [FreestyleActsBookingRequestState.REQUEST_PENDING]: 0,
  [FreestyleActsBookingRequestState.OFFER_PENDING]: 1,
  [FreestyleActsBookingRequestState.ACCEPTED]: 2,
  [FreestyleActsBookingRequestState.REJECTED_BY_ARTIST]: 3,
  [FreestyleActsBookingRequestState.REJECTED_BY_CLIENT]: 4,
};

type SortableColumn = 'date' | 'preferredDate' | 'area' | 'state';
type TableSort = { col: SortableColumn | null; dir: 'asc' | 'desc' };

const AREA_PREVIEW_LENGTH = 24;

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}…`;
}

function compareBookingRequestsBySort(a: BookingRequest, b: BookingRequest, col: SortableColumn, dir: 'asc' | 'desc'): number {
  const mult = dir === 'asc' ? 1 : -1;

  if (col === 'date') {
    return (moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()) * mult;
  }

  if (col === 'preferredDate') {
    const dateA = a.preferredDate ? moment(a.preferredDate).valueOf() : 0;
    const dateB = b.preferredDate ? moment(b.preferredDate).valueOf() : 0;
    return (dateA - dateB) * mult;
  }

  if (col === 'area') {
    return a.area.localeCompare(b.area, undefined, { sensitivity: 'base' }) * mult;
  }

  return (STATE_SORT_RANK[a.state] - STATE_SORT_RANK[b.state]) * mult;
}

function ariaSortForColumn(column: SortableColumn, sort: TableSort): 'ascending' | 'descending' | 'none' {
  if (sort.col !== column) {
    return 'none';
  }
  return sort.dir === 'asc' ? 'ascending' : 'descending';
}

function SortColumnHeaderButton({
  column,
  tableSort,
  onCycle,
  label,
  title,
  'aria-label': ariaLabel,
}: {
  column: SortableColumn;
  tableSort: TableSort;
  onCycle: (c: SortableColumn) => void;
  label: string;
  title: string;
  'aria-label': string;
}) {
  const active = tableSort.col === column;
  const showDir = active ? tableSort.dir : null;
  return (
    <button
      type="button"
      onClick={() => onCycle(column)}
      title={title}
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1.5 text-left font-medium hover:underline', 'whitespace-nowrap text-zinc-900 dark:text-zinc-100')}
    >
      {label}
      {showDir === 'asc' ? (
        <ChevronUp className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      ) : showDir === 'desc' ? (
        <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      ) : (
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
      )}
    </button>
  );
}

function roundTripTravelFee(distanceKm: number | null | undefined, kmRateEur: number): number {
  const distance = Number(distanceKm);
  if (!Number.isFinite(distance) || distance < 0 || !Number.isFinite(kmRateEur) || kmRateEur < 0) {
    return 0;
  }
  return Math.round(distance * 2 * kmRateEur * 100) / 100;
}

interface BookingRequestsListProps {
  bookingRequests: BookingRequest[];
  jobCarAvailable: boolean;
  jobPreferredTravelMethod: JobPreferredTravelMethod;
  jobMileageFee?: number;
}

export const BookingRequestsList = ({
  bookingRequests,
  jobCarAvailable,
  jobPreferredTravelMethod,
  jobMileageFee,
}: BookingRequestsListProps) => {
  const t = useTranslations('/jobs');
  const na = 'n/a';

  const { data: session } = useSession();
  const router = useRouter();

  const defaultKmRate = (() => {
    const minor = Number(jobMileageFee);
    return convertCurrencyIntegerToDecimal(
      Number.isFinite(minor) ? minor : DEFAULT_CAR_KM_RATE_MINOR,
      CurrencyCode.EUR,
    );
  })();

  const [stateFilter, setStateFilter] = useState<StateFilter>('all');
  const [tableSort, setTableSort] = useState<TableSort>({ col: 'date', dir: 'desc' });
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>();
  const [artistFeeInput, setArtistFeeInput] = useState('');
  const [travelMethod, setTravelMethod] = useState<JobPreferredTravelMethod>(JobPreferredTravelMethod.PUBLIC_TRANSPORT);
  const [kmRateInput, setKmRateInput] = useState(String(defaultKmRate));
  const [travelFeeInput, setTravelFeeInput] = useState('');

  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) {
      return undefined;
    }
    return bookingRequests.find(request => request.id === selectedRequestId);
  }, [bookingRequests, selectedRequestId]);

  const effectiveTravelMethod = jobCarAvailable ? travelMethod : JobPreferredTravelMethod.PUBLIC_TRANSPORT;

  const computedCarTravelFee = useMemo(
    () => roundTripTravelFee(selectedRequest?.distanceKm, Number(kmRateInput)),
    [selectedRequest?.distanceKm, kmRateInput],
  );

  const pendingCount = useMemo(
    () => bookingRequests.filter(r => r.state === FreestyleActsBookingRequestState.REQUEST_PENDING).length,
    [bookingRequests],
  );

  const filteredRequests = useMemo(() => {
    return bookingRequests.filter(request => {
      if (stateFilter !== 'all' && request.state !== stateFilter) {
        return false;
      }
      return true;
    });
  }, [bookingRequests, stateFilter]);

  const displayedRequests = useMemo(() => {
    if (!tableSort.col) {
      return filteredRequests;
    }
    const list = [...filteredRequests];
    const col = tableSort.col;
    const dir = tableSort.dir;
    list.sort((a, b) => compareBookingRequestsBySort(a, b, col, dir));
    return list;
  }, [filteredRequests, tableSort]);

  const cycleColumnSort = (key: SortableColumn) => {
    setTableSort(s => {
      if (s.col !== key) {
        return { col: key, dir: 'asc' };
      }
      if (s.dir === 'asc') {
        return { col: key, dir: 'desc' };
      }
      return { col: null, dir: 'asc' };
    });
  };

  const stateLabel = (state: FreestyleActsBookingRequestState) => {
    switch (state) {
      case FreestyleActsBookingRequestState.REQUEST_PENDING:
        return t('stateRequestPending');
      case FreestyleActsBookingRequestState.OFFER_PENDING:
        return t('stateOfferPending');
      case FreestyleActsBookingRequestState.ACCEPTED:
        return t('stateAccepted');
      case FreestyleActsBookingRequestState.REJECTED_BY_ARTIST:
        return t('stateRejectedByArtist');
      case FreestyleActsBookingRequestState.REJECTED_BY_CLIENT:
        return t('stateRejectedByClient');
      default:
        return state;
    }
  };

  const stateIcon = (state: FreestyleActsBookingRequestState) => {
    const label = stateLabel(state);
    const common = 'h-4 w-4 shrink-0';
    const wrap = (node: ReactNode) => (
      <span className="inline-flex h-7 w-7 items-center justify-center" title={label} aria-label={label} role="img">
        {node}
      </span>
    );

    switch (state) {
      case FreestyleActsBookingRequestState.REQUEST_PENDING:
      case FreestyleActsBookingRequestState.OFFER_PENDING:
        return wrap(<IconHourglass className={cn(common, 'text-amber-600 dark:text-amber-400')} stroke={2} aria-hidden />);
      case FreestyleActsBookingRequestState.ACCEPTED:
        return wrap(<IconCheck className={cn(common, 'text-success')} stroke={2} aria-hidden />);
      case FreestyleActsBookingRequestState.REJECTED_BY_ARTIST:
      case FreestyleActsBookingRequestState.REJECTED_BY_CLIENT:
        return wrap(<IconBan className={cn(common, 'text-destructive')} stroke={2} aria-hidden />);
      default:
        return <span className="text-zinc-600">{label}</span>;
    }
  };

  const resetDialogState = () => {
    setSelectedRequestId(undefined);
    setArtistFeeInput('');
    setTravelMethod(jobPreferredTravelMethod);
    setKmRateInput(String(defaultKmRate));
    setTravelFeeInput('');
    router.replace(routeJobs);
  };

  const handleInfoClicked = (id: string) => {
    setSelectedRequestId(id);
    router.replace(`${routeJobs}?info=1`);
  };

  const handleOfferClicked = (id: string) => {
    const request = bookingRequests.find(r => r.id === id);
    const defaultMethod = jobCarAvailable ? jobPreferredTravelMethod : JobPreferredTravelMethod.PUBLIC_TRANSPORT;
    setSelectedRequestId(id);
    setArtistFeeInput(request?.artistFee ? String(request.artistFee) : '');
    setTravelMethod(defaultMethod);
    setKmRateInput(String(defaultKmRate));
    setTravelFeeInput(
      defaultMethod === JobPreferredTravelMethod.CAR
        ? String(roundTripTravelFee(request?.distanceKm, defaultKmRate))
        : '',
    );
    router.replace(`${routeJobs}?offer=1`);
  };

  const handleRejectClicked = (id: string) => {
    setSelectedRequestId(id);
    router.replace(`${routeJobs}?reject=1`);
  };

  const handleConfirmOfferClicked = async () => {
    if (!selectedRequestId) {
      return;
    }

    const artistFee = Number(artistFeeInput);
    if (!Number.isFinite(artistFee) || artistFee <= 0) {
      toast.error(t('toastInvalidArtistFee'));
      return;
    }

    const method = jobCarAvailable ? travelMethod : JobPreferredTravelMethod.PUBLIC_TRANSPORT;
    const travelFee = Number(travelFeeInput);

    if (!Number.isFinite(travelFee) || travelFee < 0) {
      toast.error(t('toastInvalidTravelFee'));
      return;
    }

    try {
      await updateBookingRequest(
        selectedRequestId,
        FreestyleActsBookingRequestState.OFFER_PENDING,
        session,
        artistFee,
        method,
        travelFee,
      );
      toast.success(t('toastOfferSuccess'));
      resetDialogState();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message ?? t('toastUpdateFailed'));
      console.error(error.message);
    }
  };

  const handleConfirmRejectClicked = async () => {
    if (!selectedRequestId) {
      return;
    }

    try {
      await updateBookingRequest(selectedRequestId, FreestyleActsBookingRequestState.REJECTED_BY_ARTIST, session);
      toast.success(t('toastRejectSuccess'));
      resetDialogState();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message ?? t('toastUpdateFailed'));
      console.error(error.message);
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) {
      return na;
    }
    return moment(value).format('YYYY-MM-DD');
  };

  const formatDateTime = (value: string | null) => {
    if (!value) {
      return na;
    }
    return moment(value).format('YYYY-MM-DD HH:mm');
  };

  const formatFee = (value: number) => {
    if (!value) {
      return na;
    }
    return `${value} €`;
  };

  const formatEurAmount = (value: number) => `${Number.isFinite(value) ? value.toFixed(2) : '0.00'} €`;

  return (
    <>
      <Toaster richColors />

      <Dialog title={t('dlgRequestInfoTitle')} queryParam="info" onCancel={resetDialogState}>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoClient')}:`}</p>
          <p>{selectedRequest?.clientName ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoEmail')}:`}</p>
          <p>{selectedRequest?.email ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoPhone')}:`}</p>
          <p>{selectedRequest?.phone ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoDate')}:`}</p>
          <p>{formatDateTime(selectedRequest?.createdAt ?? null)}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoPreferredDate')}:`}</p>
          <p>{formatDate(selectedRequest?.preferredDate ?? null)}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoReference')}:`}</p>
          <p>{selectedRequest?.referenceLabel ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoService')}:`}</p>
          <p>{selectedRequest?.service ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoVenue')}:`}</p>
          <p>{selectedRequest?.venue ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoArea')}:`}</p>
          <p>{selectedRequest?.area ?? na}</p>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <p>{`${t('dlgRequestInfoState')}:`}</p>
          <p>{selectedRequest ? stateLabel(selectedRequest.state) : na}</p>
        </div>
        {selectedRequest && selectedRequest.proposedArtistFee > 0 && (
          <div className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRequestInfoProposedArtistFee')}:`}</p>
            <p>{formatFee(selectedRequest.proposedArtistFee)}</p>
          </div>
        )}
        {selectedRequest && selectedRequest.artistFee > 0 && (
          <div className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRequestInfoArtistFee')}:`}</p>
            <p>{formatFee(selectedRequest.artistFee)}</p>
          </div>
        )}
        {selectedRequest?.proposedTravelMethod && (
          <div className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRequestInfoTravelMethod')}:`}</p>
            <p>
              {selectedRequest.proposedTravelMethod === JobPreferredTravelMethod.CAR
                ? t('travelMethodCar')
                : t('travelMethodPublicTransport')}
            </p>
          </div>
        )}
        {selectedRequest && selectedRequest.travelFee != null && selectedRequest.travelFee > 0 && (
          <div className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRequestInfoTravelFee')}:`}</p>
            <p>{formatFee(selectedRequest.travelFee)}</p>
          </div>
        )}
        {selectedRequest?.message && (
          <div className="grid grid-cols-2 gap-1">
            <p>{`${t('dlgRequestInfoMessage')}:`}</p>
            <p>{selectedRequest.message}</p>
          </div>
        )}
      </Dialog>

      <Dialog
        title={t('dlgOfferTitle')}
        queryParam="offer"
        onCancel={resetDialogState}
        onConfirm={handleConfirmOfferClicked}
        confirmText={t('dlgOfferBtnConfirm')}
        executeCancelAfterConfirmClicked={false}
      >
        <p className="mb-3">{t('dlgOfferText')}</p>
        <label className="mb-1 block text-left text-xs text-zinc-600" htmlFor="jobs-offer-artist-fee">
          {t('dlgOfferArtistFeeLabel')}
        </label>
        <Input
          id="jobs-offer-artist-fee"
          type="number"
          min="1"
          step="1"
          inputMode="decimal"
          value={artistFeeInput}
          onChange={e => setArtistFeeInput(e.target.value)}
          placeholder={t('dlgOfferArtistFeePlaceholder')}
          className="mb-3 w-full"
        />

        {jobCarAvailable ? (
          <div className="mb-3">
            <span className="mb-1 block text-left text-xs text-zinc-600">{t('dlgOfferTravelMethodLabel')}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  travelMethod === JobPreferredTravelMethod.PUBLIC_TRANSPORT
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-primary/40 dark:border-zinc-800 dark:bg-zinc-950',
                )}
                onClick={() => setTravelMethod(JobPreferredTravelMethod.PUBLIC_TRANSPORT)}
              >
                {t('travelMethodPublicTransport')}
              </button>
              <button
                type="button"
                className={cn(
                  'rounded-md border px-3 py-2 text-left text-sm transition-colors',
                  travelMethod === JobPreferredTravelMethod.CAR
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-primary/40 dark:border-zinc-800 dark:bg-zinc-950',
                )}
                onClick={() => {
                  setTravelMethod(JobPreferredTravelMethod.CAR);
                  setTravelFeeInput(String(roundTripTravelFee(selectedRequest?.distanceKm, Number(kmRateInput) || defaultKmRate)));
                }}
              >
                {t('travelMethodCar')}
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-3 text-xs text-zinc-600">
            {t('dlgOfferTravelMethodFixed', { method: t('travelMethodPublicTransport') })}
          </p>
        )}

        {effectiveTravelMethod === JobPreferredTravelMethod.CAR && (
          <>
            <p className="mb-1 text-xs text-zinc-600">
              {t('dlgOfferDistanceInfo', {
                distance: selectedRequest?.distanceKm != null ? selectedRequest.distanceKm : na,
              })}
            </p>
            <label className="mb-1 block text-left text-xs text-zinc-600" htmlFor="jobs-offer-km-rate">
              {t('dlgOfferKmRateLabel')}
            </label>
            <Input
              id="jobs-offer-km-rate"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={kmRateInput}
              onChange={e => {
                const nextRate = e.target.value;
                setKmRateInput(nextRate);
                setTravelFeeInput(String(roundTripTravelFee(selectedRequest?.distanceKm, Number(nextRate))));
              }}
              placeholder="0.30"
              className="mb-1 w-full"
            />
            <p className="mb-3 text-xs text-zinc-500">{t('dlgOfferTravelFeeFromRateHint', { amount: formatEurAmount(computedCarTravelFee) })}</p>
          </>
        )}

        <label className="mb-1 block text-left text-xs text-zinc-600" htmlFor="jobs-offer-travel-fee">
          {t('dlgOfferTravelFeeLabel')}
        </label>
        <Input
          id="jobs-offer-travel-fee"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={travelFeeInput}
          onChange={e => setTravelFeeInput(e.target.value)}
          placeholder={t('dlgOfferTravelFeePlaceholder')}
          className="w-full"
        />
      </Dialog>

      <Dialog
        title={t('dlgRejectTitle')}
        queryParam="reject"
        onCancel={resetDialogState}
        onConfirm={handleConfirmRejectClicked}
        confirmText={t('dlgRejectBtnConfirm')}
      >
        <p>{t('dlgRejectText')}</p>
      </Dialog>

      <div className={cn('text-sm flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto scrollbar-none')}>
        {bookingRequests.length > 0 && (
          <>
            {pendingCount > 0 && (
              <Alert className={cn('shrink-0 border-amber-200/90 bg-amber-50 text-amber-950', 'dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100')}>
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                <AlertDescription>{t('alertPendingRequests', { count: pendingCount })}</AlertDescription>
              </Alert>
            )}

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="w-full min-w-[10rem] sm:w-48">
                <span className="mb-1 block text-left text-xs text-zinc-600">{t('filterStateLabel')}</span>
                <Select value={stateFilter} onValueChange={v => setStateFilter(v === 'all' ? 'all' : (v as FreestyleActsBookingRequestState))}>
                  <SelectTrigger aria-label={t('filterStateLabel')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filterStateAll')}</SelectItem>
                    <SelectItem value={FreestyleActsBookingRequestState.REQUEST_PENDING}>{t('stateRequestPending')}</SelectItem>
                    <SelectItem value={FreestyleActsBookingRequestState.OFFER_PENDING}>{t('stateOfferPending')}</SelectItem>
                    <SelectItem value={FreestyleActsBookingRequestState.ACCEPTED}>{t('stateAccepted')}</SelectItem>
                    <SelectItem value={FreestyleActsBookingRequestState.REJECTED_BY_ARTIST}>{t('stateRejectedByArtist')}</SelectItem>
                    <SelectItem value={FreestyleActsBookingRequestState.REJECTED_BY_CLIENT}>{t('stateRejectedByClient')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {bookingRequests.length === 0 && <div className="m-1 flex justify-center text-zinc-600">{t('textNoRequests')}</div>}

        {bookingRequests.length > 0 && filteredRequests.length === 0 && <div className="m-1 flex justify-center text-zinc-600">{t('textNoFilterMatch')}</div>}

        {bookingRequests.length > 0 && displayedRequests.length > 0 && (
          <div className="min-h-0 min-w-0 max-w-full overflow-x-auto scrollbar-none">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[1%] whitespace-nowrap" aria-sort={ariaSortForColumn('date', tableSort)}>
                    <SortColumnHeaderButton
                      column="date"
                      tableSort={tableSort}
                      onCycle={cycleColumnSort}
                      label={t('tableColDate')}
                      title={t('tableSortByDate')}
                      aria-label={`${t('tableColDate')}, ${t('tableSortByDate')}`}
                    />
                  </TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap" aria-sort={ariaSortForColumn('preferredDate', tableSort)}>
                    <SortColumnHeaderButton
                      column="preferredDate"
                      tableSort={tableSort}
                      onCycle={cycleColumnSort}
                      label={t('tableColPreferredDate')}
                      title={t('tableSortByPreferredDate')}
                      aria-label={`${t('tableColPreferredDate')}, ${t('tableSortByPreferredDate')}`}
                    />
                  </TableHead>
                  <TableHead className="min-w-[8rem]" aria-sort={ariaSortForColumn('area', tableSort)}>
                    <SortColumnHeaderButton
                      column="area"
                      tableSort={tableSort}
                      onCycle={cycleColumnSort}
                      label={t('tableColArea')}
                      title={t('tableSortByArea')}
                      aria-label={`${t('tableColArea')}, ${t('tableSortByArea')}`}
                    />
                  </TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap" aria-sort={ariaSortForColumn('state', tableSort)}>
                    <SortColumnHeaderButton
                      column="state"
                      tableSort={tableSort}
                      onCycle={cycleColumnSort}
                      label={t('tableColState')}
                      title={t('tableSortByState')}
                      aria-label={`${t('tableColState')}, ${t('tableSortByState')}`}
                    />
                  </TableHead>
                  <TableHead className="min-w-[6rem] text-right">{t('tableColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell className="whitespace-nowrap text-zinc-700">{formatDateTime(request.createdAt)}</TableCell>
                    <TableCell className="whitespace-nowrap text-zinc-700">{formatDate(request.preferredDate)}</TableCell>
                    <TableCell className="max-w-[12rem] text-zinc-700" title={request.area}>
                      {truncateText(request.area, AREA_PREVIEW_LENGTH)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-zinc-800">{stateIcon(request.state)}</TableCell>
                    <TableCell className="text-right align-middle">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1">
                        <ActionButton
                          action={Action.INFO}
                          tooltip={t('tooltipViewRequest')}
                          onClick={() => {
                            handleInfoClicked(request.id);
                          }}
                        />
                        {request.state === FreestyleActsBookingRequestState.REQUEST_PENDING && (
                          <>
                            <ActionButton
                              action={Action.ACCEPT}
                              tooltip={t('tooltipSubmitOffer')}
                              onClick={() => {
                                handleOfferClicked(request.id);
                              }}
                            />
                            <ActionButton
                              action={Action.DENY}
                              tooltip={t('tooltipRejectRequest')}
                              onClick={() => {
                                handleRejectClicked(request.id);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

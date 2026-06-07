'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { cn } from '@/lib/utils';

export type DisplayPlatform = 'web' | 'mobile';

export type ActivityTableRow = {
  month: string;
  platform: DisplayPlatform;
  countryCode: string | null;
  clicks: number;
  hovers: number;
};

type SortKey = 'month' | 'country' | 'platform' | 'clicks' | 'hovers';
type SortDirection = 'asc' | 'desc';

interface IActivityTable {
  rows: ActivityTableRow[];
}

export function ActivityTable({ rows }: IActivityTable) {
  const t = useTranslations('/ads/stats');

  const [sortKey, setSortKey] = useState<SortKey>('month');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatPlatform = (platform: DisplayPlatform): string => (platform === 'web' ? t('platformWeb') : t('platformMobile'));

  const formatCountry = (countryCode: string | null): string => {
    if (!countryCode) return t('countryUnknown');
    return getCountryNameByCode(countryCode) || countryCode;
  };

  const formatMonth = (month: string): string => {
    const parsed = moment(month, ['YYYY-MM', 'YYYY-MM-DD'], true);
    return parsed.isValid() ? parsed.format('MMM YY') : month;
  };

  const compareRows = (a: ActivityTableRow, b: ActivityTableRow): number => {
    switch (sortKey) {
      case 'month':
        return a.month.localeCompare(b.month);
      case 'country':
        return formatCountry(a.countryCode).localeCompare(formatCountry(b.countryCode), undefined, { sensitivity: 'base' });
      case 'platform':
        return formatPlatform(a.platform).localeCompare(formatPlatform(b.platform), undefined, { sensitivity: 'base' });
      case 'clicks':
        return a.clicks - b.clicks;
      case 'hovers':
        return a.hovers - b.hovers;
      default:
        return 0;
    }
  };

  const sortedRows = useMemo(() => {
    const sorted = [...rows].sort(compareRows);
    return sortDirection === 'asc' ? sorted : sorted.reverse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const renderSortableHeader = (key: SortKey, label: string, alignRight = false) => {
    const isActive = sortKey === key;
    return (
      <button type="button" onClick={() => handleSort(key)} className={cn('inline-flex items-center gap-1.5 font-medium hover:underline')} aria-label={label}>
        {label}
        {isActive ? (
          sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          )
        ) : (
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-0 min-w-0 overflow-x-auto scrollbar-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortableHeader('month', t('tableColMonth'))}</TableHead>
            <TableHead>{renderSortableHeader('country', t('tableColCountry'))}</TableHead>
            <TableHead>{renderSortableHeader('platform', t('tableColPlatform'))}</TableHead>
            <TableHead className="text-right">{renderSortableHeader('clicks', t('tableColClicks'), true)}</TableHead>
            <TableHead className="text-right">{renderSortableHeader('hovers', t('tableColHovers'), true)}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                {t('textNoData')}
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row, index) => (
              <TableRow key={`${row.month}-${row.platform}-${row.countryCode ?? 'unknown'}-${index}`}>
                <TableCell className="whitespace-nowrap">{formatMonth(row.month)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {row.countryCode && (
                      <span className="inline-flex h-5 w-5 shrink-0 overflow-hidden rounded-full">
                        <ReactCountryFlag className="!h-full !w-full" countryCode={row.countryCode} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} title={row.countryCode} />
                      </span>
                    )}
                    <span className="whitespace-nowrap">{formatCountry(row.countryCode)}</span>
                  </div>
                </TableCell>
                <TableCell>{formatPlatform(row.platform)}</TableCell>
                <TableCell className="text-right tabular-nums">{row.clicks}</TableCell>
                <TableCell className="text-right tabular-nums">{row.platform === 'mobile' ? '-' : row.hovers}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

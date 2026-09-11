'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getTotalMatchPerformance } from '@/infrastructure/clients/statistic.client';
import { ReadTotalMatchPerformanceResponseDto } from '@/infrastructure/clients/dtos/statistics/read-total-match-performance.response.dto';
import LoadingSpinner from '@/components/animation/loading-spinner';

interface ProfileMatchStatsProps {
  username: string;
}

export function ProfileMatchStats({ username }: ProfileMatchStatsProps) {
  const t = useTranslations('/users/username');
  const [matchStats, setMatchStats] = useState<ReadTotalMatchPerformanceResponseDto>();

  useEffect(() => {
    getTotalMatchPerformance(username).then(res => {
      setMatchStats(res);
    });
  }, [username]);

  if (!matchStats) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">{t('accordionItemBattleStatistics')}</h2>
        <LoadingSpinner centerScreen={false} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">{t('accordionItemBattleStatistics')}</h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col gap-1 rounded-lg border border-secondary-dark p-3">
          <div className="text-2xl font-semibold tabular-nums">{matchStats.matches}</div>
          <div className="text-xs text-muted-foreground">{t('accordionItemBattleStatisticsAmountBattles')}</div>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-secondary-dark p-3">
          <div className="text-2xl font-semibold tabular-nums">{matchStats.matches > 0 ? matchStats.wins : '—'}</div>
          <div className="text-xs text-muted-foreground">{t('accordionItemBattleStatisticsAmountWins')}</div>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-secondary-dark p-3">
          <div className="text-2xl font-semibold tabular-nums">{matchStats.matches > 0 ? `${(matchStats.ratio * 100).toFixed(0)}%` : '—'}</div>
          <div className="text-xs text-muted-foreground">{t('accordionItemBattleStatisticsWinLossRatio')}</div>
        </div>
      </div>
    </section>
  );
}

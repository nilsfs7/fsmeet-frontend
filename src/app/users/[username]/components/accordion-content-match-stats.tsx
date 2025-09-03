'use client';

import { useEffect, useState } from 'react';
import { AccordionContent } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';
import { getTotalMatchPerformance } from '../../../../infrastructure/clients/statistic.client';
import { ReadTotalMatchPerformanceResponseDto } from '../../../../infrastructure/clients/dtos/statistics/read-total-match-performance.response.dto';
import LoadingSpinner from '../../../../components/animation/loading-spinner';

interface IAccordionContentMatchStats {
  username: string;
}

export const AccordionContentMatchStats = ({ username }: IAccordionContentMatchStats) => {
  const t = useTranslations('/users/username');

  const [matchStats, setMatchStats] = useState<ReadTotalMatchPerformanceResponseDto>();

  useEffect(() => {
    getTotalMatchPerformance(username).then(res => {
      setMatchStats(res);
    });
  }, []);

  if (!matchStats) {
    return (
      <AccordionContent>
        <LoadingSpinner text="Loading..." centerScreen={false} />
      </AccordionContent>
    );
  }

  return (
    <AccordionContent>
      <div className="grid grid-cols-2">
        <div>{t('accordionItemBattleStatisticsAmountBattles')}</div>
        <div>{matchStats.matches}</div>

        {matchStats.matches > 0 && (
          <>
            <div>{t('accordionItemBattleStatisticsAmountWins')}</div>
            <div>{`${matchStats.wins} `}</div>

            <div>{t('accordionItemBattleStatisticsWinLossRatio')}</div>
            <div>{`${(matchStats.ratio * 100).toFixed(2)}%`}</div>
          </>
        )}
      </div>
    </AccordionContent>
  );
};

'use client';

import { useEffect, useState } from 'react';
import { AccordionContent } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';
import LoadingSpinner from '../../../../components/animation/loading-spinner';
import { getAchievements } from '../../../../infrastructure/clients/achievements';
import { ReadAchievementResponseDto } from '../../../../infrastructure/clients/dtos/achievements/read-achievement.response.dto';
import { AchievementLevel } from '../../../../domain/enums/achievement-level';

interface IAccordionContentAchievements {
  username: string;
}

const getAchievementStyle = (level: AchievementLevel): string => {
  switch (level) {
    case AchievementLevel.BRONZE:
      return 'border border-bronze shadow-bronze shadow-inner';

    case AchievementLevel.SILVER:
      return 'border border-silver shadow-silver shadow-inner';

    case AchievementLevel.GOLD:
      return 'border border-gold shadow-gold shadow-inner';

    default:
      return '';
  }
};

export const AccordionContentAchievements = ({ username }: IAccordionContentAchievements) => {
  const t = useTranslations('/users/username');

  const [achievements, setAchievements] = useState<ReadAchievementResponseDto[]>();

  useEffect(() => {
    getAchievements(username).then(res => {
      setAchievements(res);
    });
  }, []);

  if (!achievements) {
    return (
      <AccordionContent>
        <LoadingSpinner text="Loading..." centerScreen={false} />
      </AccordionContent>
    );
  }

  return (
    <AccordionContent>
      {achievements.length === 0 && <div className="flex flex-col">{t('accordionItemAchievementsNoAchievements')}</div>}

      {achievements.length > 0 && (
        <div className="grid grid-cols-3 justify-center gap-2">
          {achievements.map((achievement, i) => {
            return (
              <div key={`achievement-${i}`} className="flex flex-col items-center w-16 justify-self-centers">
                <img src={achievement.imageUrl} className={`h-12 w-12 rounded-full object-cover ${getAchievementStyle(achievement.level)}`} alt={achievement.name} />

                <div className="text-xs text-center">{achievement.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </AccordionContent>
  );
};

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { getAchievements } from '@/infrastructure/clients/achievements';
import { ReadAchievementResponseDto } from '@/infrastructure/clients/dtos/achievements/read-achievement.response.dto';
import { AchievementLevel } from '@/domain/enums/achievement-level';

interface ProfileAchievementsProps {
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

export function ProfileAchievements({ username }: ProfileAchievementsProps) {
  const t = useTranslations('/users/username');
  const [achievements, setAchievements] = useState<ReadAchievementResponseDto[]>();

  useEffect(() => {
    getAchievements(username).then(res => {
      setAchievements(res);
    });
  }, [username]);

  if (!achievements) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">{t('accordionItemAchievements')}</h2>
        <LoadingSpinner centerScreen={false} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">{t('accordionItemAchievements')}</h2>

      {achievements.length === 0 && <div>{t('accordionItemAchievementsNoAchievements')}</div>}

      {achievements.length > 0 && (
        <div className="grid grid-cols-3 justify-items-center gap-3 sm:grid-cols-4">
          {achievements.map((achievement, i) => (
            <div key={`achievement-${i}`} className="flex w-16 flex-col items-center">
              <img src={achievement.imageUrl} className={`h-12 w-12 rounded-full object-cover ${getAchievementStyle(achievement.level)}`} alt={achievement.name} />
              <div className="text-center text-xs">{achievement.name}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

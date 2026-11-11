'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconAward, IconGavel, IconHeartHandshake, IconTournament, IconTrophy } from '@tabler/icons-react';
import type { Icon } from '@tabler/icons-react';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { getAchievements } from '@/infrastructure/clients/achievements';
import { ReadAchievementResponseDto } from '@/infrastructure/clients/dtos/achievements/read-achievement.response.dto';
import { AchievementLevel } from '@/domain/enums/achievement-level';
import { cn } from '@/lib/utils';

interface ProfileAchievementsProps {
  username: string;
}

/** Map known backend achievement artwork (by file name) to a Tabler icon. Unknown achievements fall back to the backend image. */
const achievementIcons: Record<string, Icon> = {
  'supporter-donation': IconHeartHandshake,
  competition: IconTrophy,
  tournament: IconTournament,
  judge: IconGavel,
};

const getAchievementIcon = (imageUrl?: string): Icon | undefined => {
  if (!imageUrl) return IconAward;
  const base = imageUrl.split('?')[0].split('/').pop()?.replace(/\.[a-z0-9]+$/i, '');
  return base ? achievementIcons[base] : undefined;
};

const levelTileClass: Record<AchievementLevel, string> = {
  [AchievementLevel.BASIC]: 'bg-muted text-foreground/80 ring-border',
  [AchievementLevel.BRONZE]: 'bg-bronze/15 text-bronze ring-bronze/50',
  [AchievementLevel.SILVER]: 'bg-silver/20 text-foreground/70 ring-silver',
  [AchievementLevel.GOLD]: 'bg-gold/20 text-amber-700 ring-gold dark:text-gold',
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

      {achievements.length === 0 && <div className="text-sm text-muted-foreground">{t('accordionItemAchievementsNoAchievements')}</div>}

      {achievements.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {achievements.map((achievement, i) => {
            const AchievementIcon = getAchievementIcon(achievement.imageUrl);
            const tile = levelTileClass[achievement.level] ?? levelTileClass[AchievementLevel.BASIC];

            return (
              <div key={`achievement-${i}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background p-2.5" title={achievement.description || achievement.name}>
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset', tile)}>
                  {AchievementIcon ? (
                    <AchievementIcon className="h-6 w-6" stroke={1.75} aria-hidden />
                  ) : (
                    <img src={achievement.imageUrl} className="h-7 w-7 object-contain" alt="" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-snug text-foreground">{achievement.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

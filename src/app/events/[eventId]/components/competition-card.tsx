import { IconTrophy } from '@tabler/icons-react';
import { Competition } from '@/domain/types/competition';
import { cn } from '@/lib/utils';

interface ICompetitionCardProps {
  competition: Competition;
}

const cardSurface = cn(
  'group min-w-0 overflow-hidden rounded-xl border border-border/60',
  'bg-secondary-light/85 shadow-xs backdrop-blur-xs',
  'supports-backdrop-filter:bg-secondary-light/70',
  'transition-all duration-200',
  'hover:border-primary/50 hover:shadow-md',
  'dark:border-border/50 dark:bg-background/60 dark:supports-backdrop-filter:bg-background/50 dark:hover:border-primary/40',
);

const CompetitionCard = ({ competition }: ICompetitionCardProps) => {
  return (
    <div
      className={cn(
        'inline-block w-max max-w-full align-middle',
        cardSurface,
      )}
    >
      <div className="inline-flex w-max min-w-0 max-w-full items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-strong">
          <IconTrophy className="h-[18px] w-[18px]" stroke={1.75} aria-hidden />
        </div>
        <span className="type-body-sm min-w-0 max-w-[min(18rem,calc(100vw-5rem))] truncate font-medium text-foreground">
          {competition.name}
        </span>
      </div>
    </div>
  );
};

export default CompetitionCard;

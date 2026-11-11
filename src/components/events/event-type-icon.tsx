import { IconTrophy, IconUsersGroup, IconWorld, type Icon } from '@tabler/icons-react';
import { EventType } from '@/domain/enums/event-type';
import { cn } from '@/lib/utils';

export function getEventTypeIcon(eventType: EventType | undefined): Icon {
  switch (eventType) {
    case EventType.MEETING:
      return IconUsersGroup;
    case EventType.COMPETITION_ONLINE:
      return IconWorld;
    default:
      return IconTrophy;
  }
}

/** Poster placeholder for events without a custom poster (replaces the clip-art trophy / people images). */
export function EventPosterPlaceholder({ eventType, className, iconClassName }: { eventType: EventType | undefined; className?: string; iconClassName?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-linear-to-br from-brand-soft via-muted to-sky-50 text-brand-strong/70 dark:from-brand-soft dark:via-muted dark:to-neutral-800',
        className,
      )}
      aria-hidden
    >
      <EventTypeGlyph eventType={eventType} className={cn('h-1/3 w-1/3', iconClassName)} />
    </div>
  );
}

/** Inline glyph for an event type. */
export function EventTypeGlyph({ eventType, className }: { eventType: EventType | undefined; className?: string }) {
  switch (eventType) {
    case EventType.MEETING:
      return <IconUsersGroup className={className} stroke={1.75} aria-hidden />;
    case EventType.COMPETITION_ONLINE:
      return <IconWorld className={className} stroke={1.75} aria-hidden />;
    default:
      return <IconTrophy className={className} stroke={1.75} aria-hidden />;
  }
}

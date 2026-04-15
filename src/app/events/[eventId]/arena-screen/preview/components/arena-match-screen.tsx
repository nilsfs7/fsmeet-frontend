'use client';

import { imgUserDefaultImg } from '@/domain/constants/images';
import { MatchSlot } from '@/domain/types/match-slot';
import { cn } from '@/lib/utils';
import ReactCountryFlag from 'react-country-flag';

/** Plain match data (RSC → client must not receive class instances). */
export type ArenaMatchPlain = {
  name: string;
  time: string | null;
  slots: number;
  matchSlots: MatchSlot[];
};

export type ArenaParticipantPlain = {
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  /** ISO country code for flag display; from arena API participant payload. */
  countryCode?: string;
};

const MAX_PARTICIPANTS = 4;

/**
 * Full four-corners ring (clockwise from top-left): P4 TL, P3 TR, P2 BR, P1 BL.
 * For **3** slots we use only TR, BR, BL (P3, P2, P1). For **4** slots we use all four.
 */
const CORNER_POSITIONS = [
  'left-4 top-10 items-start text-left sm:left-8 sm:top-14 md:left-14 md:top-20',
  'right-4 top-10 items-end text-right sm:right-8 sm:top-14 md:right-14 md:top-20',
  'right-4 bottom-8 items-end text-right sm:right-8 sm:bottom-12 md:right-14 md:bottom-16',
  'left-4 bottom-8 items-start text-left sm:left-8 sm:bottom-12 md:left-14 md:bottom-16',
] as const;

const CORNER_AVATAR_SELF = ['self-start', 'self-end', 'self-end', 'self-start'] as const;
const CORNER_NAME_ALIGN = ['items-start text-left', 'items-end text-right', 'items-end text-right', 'items-start text-left'] as const;

/** Two participants: left / right, vertically centered in the arena. */
const DUEL_POSITIONS = ['left-4 top-1/2 -translate-y-1/2 items-start text-left sm:left-8 md:left-14', 'right-4 top-1/2 -translate-y-1/2 items-end text-right sm:right-8 md:right-14'] as const;

/** Flag badge toward arena center from each corner (order matches {@link CORNER_POSITIONS}). */
const FLAG_OVERLAP = [
  'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
  'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
  'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
  'top-0 right-0 translate-x-1/4 -translate-y-1/4',
] as const;

/**
 * Grows with viewport (vmin); max uses min(rem, vmin) so large screens get large circles
 * without overflowing a quadrant. Duel (1v1) uses a higher cap (half-width layout).
 */
const AVATAR_SIZE = 'h-[clamp(5rem,22vmin,min(28rem,42vmin))] w-[clamp(5rem,22vmin,min(28rem,42vmin))]';
const AVATAR_SIZE_DUEL = 'h-[clamp(6rem,26vmin,min(34rem,52vmin))] w-[clamp(6rem,26vmin,min(34rem,52vmin))]';
const FLAG_SIZE = 'h-[clamp(2.25rem,6.5vmin,min(5.5rem,14vmin))] w-[clamp(2.25rem,6.5vmin,min(5.5rem,14vmin))]';
const FLAG_SIZE_DUEL = 'h-[clamp(2.5rem,7.5vmin,min(6.5rem,16vmin))] w-[clamp(2.5rem,7.5vmin,min(6.5rem,16vmin))]';

type MultiCornerLayout = {
  positions: readonly string[];
  avatarSelf: readonly string[];
  nameAlign: readonly string[];
  flagOverlap: readonly string[];
};

/** 3 players: top-right, bottom-right, bottom-left. 4 players: full ring from top-left. */
function multiPlayerLayout(slotCount: number): MultiCornerLayout {
  if (slotCount === 3) {
    const idx = [1, 2, 3] as const;
    return {
      positions: idx.map(i => CORNER_POSITIONS[i]),
      avatarSelf: idx.map(i => CORNER_AVATAR_SELF[i]),
      nameAlign: idx.map(i => CORNER_NAME_ALIGN[i]),
      flagOverlap: idx.map(i => FLAG_OVERLAP[i]),
    };
  }
  return {
    positions: Array.from({ length: slotCount }, (_, i) => CORNER_POSITIONS[i]),
    avatarSelf: Array.from({ length: slotCount }, (_, i) => CORNER_AVATAR_SELF[i]),
    nameAlign: Array.from({ length: slotCount }, (_, i) => CORNER_NAME_ALIGN[i]),
    flagOverlap: Array.from({ length: slotCount }, (_, i) => FLAG_OVERLAP[i]),
  };
}

export type ArenaMatchScreenProps = {
  competitionName: string | null;
  match: ArenaMatchPlain | null;
  participants: ArenaParticipantPlain[];
  /** Arena style: background image URL (`ReadArenaScreenStyleResponseDto`). */
  backgroundImageUrl: string;
  /** Arena style: overlay opacity 0–1 (DTO field `backgroundOverlayOpacity`). */
  backgroundOverlayOpacity: number;
  /** Arena style: show position labels. */
  showPositions: boolean;
  /** Arena style: reversed position numbering. */
  reversePositionLabels: boolean;
  /** Arena style: show country flags. */
  showFlags: boolean;
  /** Arena style: include last name in participant display (`ReadArenaScreenStyleResponseDto.showLastName`). */
  showLastName: boolean;
};

function displayNameForUser(user: ArenaParticipantPlain | undefined, showLastName: boolean): string {
  if (!user) return '—';
  if (!showLastName) {
    return user.firstName.trim() || '—';
  }
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || '—';
}

/** Tailwind slate-950 #020617 */
const OVERLAY_RGB = '2, 6, 23';

function ArenaBackdrop({ imageUrl, overlayOpacity }: { imageUrl: string; overlayOpacity: number }) {
  const o = Math.min(1, Math.max(0, overlayOpacity));
  return (
    <>
      {imageUrl ? (
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${imageUrl})` }} />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-slate-950" />
      )}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: `rgba(${OVERLAY_RGB}, ${o})` }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.1),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(59,130,246,0.06),transparent)]" />
    </>
  );
}

export function ArenaMatchScreen({
  competitionName,
  match,
  participants,
  backgroundImageUrl,
  backgroundOverlayOpacity,
  showPositions,
  reversePositionLabels,
  showFlags,
  showLastName,
}: ArenaMatchScreenProps) {
  const userByUsername = new Map(participants.map(p => [p.username, p]));
  const bgUrl = backgroundImageUrl.trim();
  const overlayOpacity = Math.min(1, Math.max(0, backgroundOverlayOpacity));

  if (!match) {
    return (
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center text-white">
        <ArenaBackdrop imageUrl={bgUrl} overlayOpacity={overlayOpacity} />
        <div className="relative z-10">
          <h1 className="mt-4 max-w-2xl text-3xl font-bold md:text-4xl">Select a match to display</h1>
        </div>
      </div>
    );
  }

  const slotCount = Math.min(match.slots, MAX_PARTICIPANTS);
  const slotRows = [...Array(slotCount)].map((_, i) => {
    const slot = match.matchSlots.find(s => s.slotIndex === i);
    return (
      slot ?? {
        slotIndex: i,
        name: '',
      }
    );
  });

  const isDuel = slotRows.length === 2;
  const multiLayout = !isDuel ? multiPlayerLayout(slotCount) : null;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-slate-950 text-white">
      <ArenaBackdrop imageUrl={bgUrl} overlayOpacity={overlayOpacity} />

      <header className="relative z-20 shrink-0 px-4 py-6 text-center md:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400/95 md:text-sm">{competitionName}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">{match.name}</h1>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {/* Arena floor: participants in corners */}
        <div className="relative min-h-[min(72vh,720px)] w-full flex-1 ">
          {slotRows.map((slot, index) => {
            const user = slot.name ? userByUsername.get(slot.name) : undefined;
            const imageSrc = user?.imageUrl || imgUserDefaultImg;
            const name = slot.name ? displayNameForUser(user, showLastName) : 'Open slot';
            const countryCode = user?.countryCode;
            const showFlag = Boolean(countryCode && countryCode.length >= 2);
            const avatarClass = isDuel ? AVATAR_SIZE_DUEL : AVATAR_SIZE;
            const flagClass = isDuel ? FLAG_SIZE_DUEL : FLAG_SIZE;

            return (
              <div
                key={`${slot.slotIndex}-${index}`}
                className={cn(
                  'absolute flex max-w-[min(46vw,min(42vh,22rem))] flex-col gap-3 sm:gap-4 md:max-w-[min(40vw,24rem)] md:gap-5',
                  isDuel ? DUEL_POSITIONS[index] : multiLayout!.positions[index],
                )}
              >
                <div
                  className={cn(
                    'relative shrink-0',
                    /* mx-auto would center in the column and fight items-end on the right corners */
                    isDuel ? (index % 2 === 0 ? 'self-start' : 'self-end') : multiLayout!.avatarSelf[index],
                  )}
                >
                  {/* Profile: circle + ring border */}
                  <div className={cn('rounded-full bg-gradient-to-br from-white/25 to-white/5 p-[5px] shadow-[0_0_40px_rgba(0,0,0,0.45)]', 'ring-2 ring-white/20')}>
                    <div className="overflow-hidden rounded-full bg-zinc-800">
                      <img src={imageSrc} alt="" className={cn('aspect-square object-cover', avatarClass)} />
                    </div>
                  </div>

                  {/* Flag: circle, overlapping avatar toward center */}
                  {showFlags &&
                    (showFlag ? (
                      <div
                        className={cn(
                          'absolute flex items-center justify-center rounded-full border-[3px] border-slate-950 bg-zinc-800 p-[3px] shadow-lg ring-2 ring-white/25',
                          flagClass,
                          isDuel ? FLAG_OVERLAP[index] : multiLayout!.flagOverlap[index],
                        )}
                        title={countryCode}
                      >
                        <div className="h-full w-full overflow-hidden rounded-full">
                          <ReactCountryFlag countryCode={countryCode!.toUpperCase()} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="!rounded-full" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'absolute flex items-center justify-center rounded-full border-[3px] border-slate-950 bg-zinc-700/90 p-[3px] text-[10px] font-bold uppercase text-zinc-400 ring-2 ring-white/15',
                          flagClass,
                          isDuel ? FLAG_OVERLAP[index] : multiLayout!.flagOverlap[index],
                        )}
                        title="No country"
                      >
                        <span className="rounded-full px-1">—</span>
                      </div>
                    ))}
                </div>

                <div className={cn('flex w-full flex-col gap-1', isDuel ? (index % 2 === 1 ? 'items-end text-right' : 'items-start text-left') : multiLayout!.nameAlign[index])}>
                  {showPositions && slotCount > 2 && (
                    <p className="text-xs font-semibold tracking-widest text-zinc-500 normal-case">Position {reversePositionLabels ? slotCount - slot.slotIndex : slot.slotIndex + 1}</p>
                  )}
                  <h2 className="text-xl font-bold leading-tight text-white drop-shadow-md sm:text-2xl md:text-3xl">{name}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

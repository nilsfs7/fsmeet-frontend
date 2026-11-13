'use client';

import { useRef, useState, type TouchEvent } from 'react';
import { useTranslations } from 'next-intl';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { Round } from '@/domain/types/round';
import type { Match } from '@/domain/types/match';
import { User } from '@/domain/types/user';
import { cn } from '@/lib/utils';
import MatchCard from './match-card';
import { RoundHeader } from './round-header';

interface IBattleGridPublicProps {
  rounds: Round[];
  usersMap?: Map<string, User>;
  showUserCountryFlag?: boolean;
}

/** Desktop shows the "start at" chips from this many rounds on; mobile uses the round switcher from this many rounds on. */
const MIN_ROUNDS_FOR_CONTROLS = 3;
const SWIPE_THRESHOLD_PX = 50;

function splitMatches(round: Round): { main: Match[]; extra: Match[] } {
  const sorted = [...round.matches].sort((a, b) => a.matchIndex - b.matchIndex);
  return { main: sorted.filter(m => !m.isExtraMatch), extra: sorted.filter(m => m.isExtraMatch) };
}

function RoundChips({ rounds, selected, onSelect, label }: { rounds: Round[]; selected: number; onSelect: (index: number) => void; label?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {label && <span className="hidden shrink-0 text-xs font-medium text-muted-foreground md:inline">{label}</span>}
      <div className="flex min-w-0 gap-1.5 overflow-x-auto scrollbar-none" role="tablist">
        {rounds.map((round, i) => (
          <button
            key={`chip-${round.roundIndex}`}
            type="button"
            role="tab"
            aria-selected={i === selected}
            data-testid="round-chip"
            onClick={() => onSelect(i)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              i === selected ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-background text-foreground/80 hover:border-brand/40 hover:text-foreground',
            )}
          >
            {round.name}
            <span className={cn('text-2xs font-semibold tabular-nums', i === selected ? 'text-brand-foreground/75' : 'text-muted-foreground')}>{round.matches.length}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Public battle grid (competition page). Desktop: compact, top-aligned round columns in a box that scrolls on both axes with a
 * sticky round header row and optional "start at round" chips. Mobile: round switcher (chips + swipe) with the next round peeking in.
 * The game mode editor and seeding keep using `BattleGrid`.
 */
const BattleGridPublic = ({ rounds, usersMap = new Map<string, User>(), showUserCountryFlag = false }: IBattleGridPublicProps) => {
  const t = useTranslations('global/components/battle-grid');
  const sortedRounds = [...rounds].sort((a, b) => a.roundIndex - b.roundIndex);
  const hasControls = sortedRounds.length >= MIN_ROUNDS_FOR_CONTROLS;

  const [desktopStart, setDesktopStart] = useState(0);
  const [mobileRound, setMobileRound] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const desktopScroller = useRef<HTMLDivElement>(null);

  const selectDesktopStart = (index: number) => {
    setDesktopStart(index);
    desktopScroller.current?.scrollTo({ top: 0, left: 0 });
  };

  const card = (match: Match, key: string) => (
    <div key={key} data-testid="grid-match">
      <MatchCard match={match} usersMap={usersMap} showUserCountryFlag={showUserCountryFlag} />
    </div>
  );

  const roundStack = (round: Round) => {
    const { main, extra } = splitMatches(round);
    return (
      <div className="flex flex-col gap-2">
        {main.map(m => card(m, `m-${round.roundIndex}-${m.matchIndex}`))}
        {extra.length > 0 && (
          <>
            <p className="mt-2 px-1 text-xs font-medium text-muted-foreground">{t('labelAlsoInRound')}</p>
            {extra.map(m => card(m, `x-${round.roundIndex}-${m.matchIndex}`))}
          </>
        )}
      </div>
    );
  };

  // ---------- desktop ----------
  const visibleRounds = sortedRounds.slice(hasControls ? desktopStart : 0);
  const desktop = (
    <div className="hidden flex-col gap-3 md:flex" data-testid="battle-grid-desktop">
      {hasControls && <RoundChips rounds={sortedRounds} selected={desktopStart} onSelect={selectDesktopStart} label={t('labelStartAt')} />}
      {/* both scroll axes live in this box (max. viewport height) so the horizontal scrollbar is always reachable */}
      <div ref={desktopScroller} className="max-h-[calc(100dvh-22.5rem)] min-h-[22rem] overflow-auto rounded-2xl border border-border bg-muted/30" data-testid="battle-grid-scroller">
        <div className="flex w-fit min-w-full gap-3 px-3 pb-4 sm:px-4">
          {visibleRounds.map(round => (
            <div key={`col-${round.roundIndex}`} className="flex min-w-52 shrink-0 grow basis-52 flex-col lg:max-w-80">
              <div className="sticky top-0 z-10 -mx-1 bg-background/80 px-1 pb-2 pt-3 backdrop-blur-sm sm:pt-4">
                <div className="rounded-2xl border border-border bg-background px-3 py-2.5 shadow-xs">
                  <RoundHeader round={round} />
                </div>
              </div>
              {roundStack(round)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ---------- mobile ----------
  const current = sortedRounds[Math.min(mobileRound, sortedRounds.length - 1)];
  const next = sortedRounds[mobileRound + 1];
  const mobileRoot = useRef<HTMLDivElement>(null);
  const goTo = (index: number) => {
    setMobileRound(Math.max(0, Math.min(sortedRounds.length - 1, index)));
    // jump back to the start of the list when the round switcher has already scrolled out of its natural position
    const root = mobileRoot.current;
    const strip = root?.firstElementChild;
    // the sticky chip strip sits below the root's top edge once the page has scrolled past it
    if (root && strip && root.getBoundingClientRect().top < strip.getBoundingClientRect().top - 1) root.scrollIntoView({ block: 'start' });
  };

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy) * 1.5) goTo(mobileRound + (dx < 0 ? 1 : -1));
  };

  const mobile = hasControls ? (
    <div ref={mobileRoot} className="flex flex-col md:hidden" data-testid="battle-grid-mobile">
      {/* sticks to the top of the page scroller */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-col gap-2 border-b border-border/60 bg-background px-4 pb-2 pt-2 shadow-xs">
        <RoundChips rounds={sortedRounds} selected={mobileRound} onSelect={goTo} />
        <div className="flex items-center justify-between gap-2">
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground disabled:opacity-30" disabled={mobileRound === 0} onClick={() => goTo(mobileRound - 1)} aria-label={t('btnPreviousRound')}>
            <IconChevronLeft className="h-5 w-5" stroke={2} aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <RoundHeader round={current} />
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground disabled:opacity-30"
            disabled={!next}
            onClick={() => goTo(mobileRound + 1)}
            aria-label={t('btnNextRound')}
          >
            <IconChevronRight className="h-5 w-5" stroke={2} aria-hidden />
          </button>
        </div>
      </div>

      <div className="-mr-4 overflow-hidden pt-3" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} data-testid="battle-grid-mobile-pane">
        <div className="flex items-start gap-3">
          <div className={cn('min-w-0 shrink-0', next ? 'w-[calc(100%-4.5rem)]' : 'w-[calc(100%-1rem)]')}>{roundStack(current)}</div>
          {next && (
            <div className="flex w-56 shrink-0 flex-col gap-2 opacity-50" data-testid="battle-grid-peek">
              <button type="button" className="flex items-center gap-1 whitespace-nowrap px-1 text-left text-xs font-medium text-muted-foreground" onClick={() => goTo(mobileRound + 1)}>
                {t('labelNextRound', { name: next.name })}
                <IconChevronRight className="h-3.5 w-3.5" stroke={2} aria-hidden />
              </button>
              {/* preview only: not interactive, tapping it switches to that round */}
              <div className="flex cursor-pointer flex-col gap-2" onClick={() => goTo(mobileRound + 1)} aria-hidden>
                <div inert className="pointer-events-none flex flex-col gap-2">
                  {splitMatches(next).main.map(m => (
                    <MatchCard key={`p-${m.matchIndex}`} match={m} usersMap={usersMap} showUserCountryFlag={showUserCountryFlag} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    // small brackets: all rounds stacked, no extra controls
    <div className="flex flex-col gap-5 md:hidden" data-testid="battle-grid-mobile">
      {sortedRounds.map(round => (
        <section key={`s-${round.roundIndex}`} className="flex flex-col gap-2">
          <div className="rounded-2xl border border-border bg-background px-3 py-2.5 shadow-xs">
            <RoundHeader round={round} />
          </div>
          {roundStack(round)}
        </section>
      ))}
    </div>
  );

  return (
    <>
      {desktop}
      {mobile}
    </>
  );
};

export default BattleGridPublic;

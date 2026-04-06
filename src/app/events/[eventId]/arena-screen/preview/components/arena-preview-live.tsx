'use client';

import { getArenaScreen } from '@/infrastructure/clients/event.client';
import { ReadMatchResponseDto } from '@/infrastructure/clients/dtos/competition/read-match.response.dto';
import { ReadPartialUser2ResponseDto } from '@/infrastructure/clients/dtos/user/read-partial-user-2.response.dto';
import { ReadArenaScreenStyleResponseDto } from '@/infrastructure/clients/dtos/event/read-arena-screen-style.response.dto';
import { useCallback, useEffect, useState } from 'react';
import { ArenaMatchScreen, type ArenaMatchPlain, type ArenaParticipantPlain } from './arena-match-screen';

const POLL_MS = 5000;

function activeMatchToPlain(m: ReadMatchResponseDto): ArenaMatchPlain {
  return {
    name: m.name,
    time: m.time as unknown as string | null,
    slots: m.slots,
    matchSlots: (m.matchSlots ?? []).map(s => ({
      id: s.id,
      slotIndex: s.slotIndex,
      name: s.name,
      result: s.result,
    })),
  };
}

function arenaParticipantsToPlain(rows: ReadPartialUser2ResponseDto[]): ArenaParticipantPlain[] {
  return rows.map(p => ({
    username: p.username,
    imageUrl: p.imageUrl ?? '',
    firstName: p.firstName ?? '',
    lastName: p.lastName ?? '',
    countryCode: p.countryCode || undefined,
  }));
}

/** Maps API style DTO to screen props (`backgroundOverlayOpacity` spelling matches backend). */
function styleToScreenProps(style: ReadArenaScreenStyleResponseDto) {
  return {
    backgroundImageUrl: style.backgroundImageUrl,
    backgroundOverlayOpacity: style.backgroundOverlayOpacity,
    showPositions: style.showPositions,
    reversePositionLabels: style.reversePositionLabels,
    showFlags: style.showFlags,
  };
}

export function ArenaPreviewLive({ eventId }: { eventId: string }) {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [competitionName, setCompetitionName] = useState<string | null>(null);
  const [match, setMatch] = useState<ArenaMatchPlain | null>(null);
  const [participants, setParticipants] = useState<ArenaParticipantPlain[]>([]);
  const [style, setStyle] = useState<ReadArenaScreenStyleResponseDto | null>(null);

  const pull = useCallback(async () => {
    try {
      const arenaScreen = await getArenaScreen(eventId);
      setLoadError(null);
      setHasLoadedOnce(true);
      setCompetitionName(arenaScreen.competitionName);
      setMatch(arenaScreen.activeMatch ? activeMatchToPlain(arenaScreen.activeMatch) : null);
      setParticipants(arenaParticipantsToPlain(arenaScreen.participants ?? []));
      setStyle(arenaScreen.style);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load arena screen');
    }
  }, [eventId]);

  useEffect(() => {
    void pull();
    const id = window.setInterval(() => void pull(), POLL_MS);
    return () => window.clearInterval(id);
  }, [pull]);

  if (!hasLoadedOnce && !loadError) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-950 text-zinc-400">
        <p className="text-sm">Loading arena…</p>
      </div>
    );
  }

  if (loadError && !hasLoadedOnce) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 bg-slate-950 px-6 text-center text-zinc-300">
        <p className="text-lg font-medium text-white">Could not load arena</p>
        <p className="text-sm text-destructive">{loadError}</p>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 bg-slate-950 px-6 text-center text-zinc-300">
        <p className="text-lg font-medium text-white">Arena style not available</p>
      </div>
    );
  }

  return <ArenaMatchScreen competitionName={competitionName} match={match} participants={participants} {...styleToScreenProps(style)} />;
}

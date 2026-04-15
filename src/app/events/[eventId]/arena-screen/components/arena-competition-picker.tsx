'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { upsertArenaScreen } from '@/infrastructure/clients/event.client';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

export type ArenaCompetitionOption = { id: string; name: string };

type RoundJson = {
  roundIndex: number;
  name: string;
  matches?: {
    id?: string;
    matchIndex: number;
    name: string;
    time?: string | null;
  }[];
};

type BattleOption = { value: string; label: string };

export function ArenaCompetitionPicker({ eventId, competitions }: { eventId: string; competitions: ArenaCompetitionOption[] }) {
  const { data: session } = useSession();
  const [competitionId, setCompetitionId] = useState<string | undefined>();
  const [battles, setBattles] = useState<BattleOption[]>([]);
  const [loadingRounds, setLoadingRounds] = useState(false);
  const [roundsError, setRoundsError] = useState<string | null>(null);
  const [savingArena, setSavingArena] = useState(false);
  const [arenaSaveError, setArenaSaveError] = useState<string | null>(null);

  const loadBattles = useCallback(async (compId: string) => {
    setLoadingRounds(true);
    setRoundsError(null);
    setBattles([]);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to load rounds');
      }
      const rounds: RoundJson[] = await response.json();
      const sortedRounds = [...rounds].sort((a, b) => a.roundIndex - b.roundIndex);

      const items: BattleOption[] = [];
      let battleIndex = 1;
      for (const round of sortedRounds) {
        const matches = [...(round.matches ?? [])].sort((a, b) => a.matchIndex - b.matchIndex);
        for (const match of matches) {
          if (!match.id) {
            battleIndex += 1;
            continue;
          }
          items.push({
            value: match.id,
            label: `${battleIndex}. ${match.name}`,
          });
          battleIndex += 1;
        }
      }
      setBattles(items);
    } catch {
      setRoundsError('Could not load battles for this competition.');
    } finally {
      setLoadingRounds(false);
    }
  }, []);

  if (competitions.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">No competitions for this event.</p>;
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-primary">Competition</p>
        <Select
          value={competitionId}
          onValueChange={id => {
            setCompetitionId(id);
            void loadBattles(id);
          }}
        >
          <SelectTrigger className="w-full border-secondary-dark bg-background text-primary">
            <SelectValue placeholder="Select competition" />
          </SelectTrigger>
          <SelectContent className="border-secondary-dark bg-background text-primary">
            {competitions.map(c => (
              <SelectItem key={c.id} value={c.id} className="focus:bg-secondary focus:text-primary">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loadingRounds && <p className="text-sm text-muted-foreground">Loading battles…</p>}
      {roundsError && <p className="text-sm text-destructive">{roundsError}</p>}

      {!loadingRounds && competitionId && battles.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-primary">Battle</p>
          <Select
            key={competitionId}
            disabled={savingArena}
            onValueChange={async matchId => {
              setArenaSaveError(null);
              if (!session) {
                setArenaSaveError('Sign in to set the arena match.');
                return;
              }
              setSavingArena(true);
              try {
                await upsertArenaScreen(eventId, matchId, null, null, true, true, true, true, session);
              } catch (e) {
                setArenaSaveError(e instanceof Error ? e.message : 'Failed to update arena screen.');
              } finally {
                setSavingArena(false);
              }
            }}
          >
            <SelectTrigger className="w-full border-secondary-dark bg-background text-primary">
              <SelectValue placeholder={savingArena ? 'Saving…' : 'Select battle'} />
            </SelectTrigger>
            <SelectContent className="max-h-72 border-secondary-dark bg-background text-primary">
              {battles.map(b => (
                <SelectItem key={b.value} value={b.value} className="focus:bg-secondary focus:text-primary">
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {arenaSaveError && <p className="mt-2 text-sm text-destructive">{arenaSaveError}</p>}
        </div>
      )}

      {!loadingRounds && competitionId && battles.length === 0 && !roundsError && <p className="text-sm text-muted-foreground">No battles with a match id in this competition yet.</p>}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import ParticipantList from '../events/ParticipantList';
import { User } from '@/types/user';
import Separator from '../Seperator';
import { Round } from '@/types/round';
import { useRouter } from 'next/router';
import BattleList from './BattleList';
import BattleGrid from './BattleGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextareaAutosize from 'react-textarea-autosize';

interface ITabbedCompetitionDetailsMenuProps {
  competitionParticipants: User[];
  description?: string;
  rules?: string;
}

const TabbedCompetitionDetailsMenu = ({ competitionParticipants = [], description, rules }: ITabbedCompetitionDetailsMenuProps) => {
  const router = useRouter();
  const { compId } = router.query;

  const [rounds, setRounds] = useState<Round[]>([]);
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());

  const fetchRounds = async (compId: string): Promise<Round[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/competitions/${compId}/rounds`);
    const rnds: Round[] = await response.json();

    const rounds: Round[] = rnds.map(rnd => {
      const round = new Round(rnd.roundIndex, rnd.name, rnd.numberPlayers);
      round.passingExtra = rnd.passingExtra;
      round.passingPerMatch = rnd.passingPerMatch;
      round.matches = rnd.matches.sort((a, b) => (a.matchIndex > b.matchIndex ? 1 : -1)); // override auto generated matches (TODO: geht besser)
      return round;
    });

    return rounds;
  };

  const getParentRound = (roundId: number): Round => {
    return rounds[roundId - 1];
  };

  useEffect(() => {
    if (compId) {
      // @ts-ignore: next-line
      fetchRounds(compId).then(rounds => {
        if (rounds.length === 0) {
        } else {
          setRounds(rounds);
        }
      });
    }
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const fetchUsers = async (username: string): Promise<User> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${username}`);
        return await response.json();
      };

      const usersMap = new Map();
      const requests: Promise<void>[] = [];
      rounds.map(round => {
        round.matches.map(match => {
          match.matchSlots.map(slot => {
            if (!usersMap.get(slot.name)) {
              const req = fetchUsers(slot.name).then(user => {
                usersMap.set(slot.name, user);
              });
              requests.push(req);
            }
          });
        });
      });

      await Promise.all(requests);
      setUsersMap(usersMap);
    };

    getUsers();
  }, [rounds]);

  useEffect(() => {
    if (compId) {
      rounds.map((rnd, i) => {
        // update input "max-match-size"
        const inputMaxMatchSize = document.getElementById(`input-max-match-size-${i}`);
        if (inputMaxMatchSize) {
          const maxMatchSize = i === 0 ? competitionParticipants.length : getParentRound(i).advancingTotal;
          inputMaxMatchSize.setAttribute('max', maxMatchSize.toString());
        }

        // update input "max-passing"
        const inputMaxPassing = document.getElementById(`input-max-passing-${i}`);
        if (inputMaxPassing) {
          const maxPassing = rnd.maxMatchSize;
          inputMaxPassing.setAttribute('max', maxPassing.toString());
        }

        // update input "passing-extra"
        const inputPassingExtra = document.getElementById(`input-passing-extra-${i}`);
        if (inputPassingExtra) {
          inputPassingExtra.setAttribute('max', rnd.maxPossibleAdvancingExtra.toString());
        }
      });
    }
  }, [rounds]);

  return (
    <Tabs defaultValue={`schedule`}>
      <TabsList>
        {rounds.length > 0 && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
        {rounds.length > 1 && <TabsTrigger value="grid">Battle Grid</TabsTrigger>}
        {competitionParticipants.length > 0 && <TabsTrigger value="participants">Participants</TabsTrigger>}
        {(description || rules) && <TabsTrigger value="rules">Rules</TabsTrigger>}
      </TabsList>
      {/* Schedule */}
      {rounds.length > 0 && (
        <TabsContent value="schedule">
          <BattleList rounds={rounds} usersMap={usersMap} />
        </TabsContent>
      )}

      {/* Battle Grid */}
      {rounds.length > 1 && (
        <TabsContent value="grid">
          <BattleGrid rounds={rounds} usersMap={usersMap} />
        </TabsContent>
      )}

      {/* Participants */}
      {competitionParticipants.length > 0 && (
        <TabsContent value="participants">
          <ParticipantList participants={competitionParticipants} />
        </TabsContent>
      )}

      {/* Rules */}
      {(description || rules) && (
        <TabsContent value="rules">
          <div className={'h-fit rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
            {description && (
              <div>
                <div className="text-base font-bold">Description</div>
                <TextareaAutosize readOnly className="w-full p-2 resize-none bg-transparent outline-none" value={description} />
              </div>
            )}

            {description && rules && <Separator />}

            {rules && (
              <div className={`${description ? 'mt-2' : ''}`}>
                <div className="text-base font-bold">Rules</div>
                <TextareaAutosize readOnly className="w-full p-2 resize-none bg-transparent outline-none" value={rules} />
              </div>
            )}
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default TabbedCompetitionDetailsMenu;

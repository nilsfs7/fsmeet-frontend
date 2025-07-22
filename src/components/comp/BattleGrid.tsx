'use client';

import { Round } from '@/domain/classes/round';
import MatchCard from './MatchCard';
import { User } from '@/domain/types/user';
import { Moment } from 'moment';
import ActionButton from '../common/ActionButton';
import { Action } from '@/domain/enums/action';
import { Size } from '@/domain/enums/size';
import TextButton from '../common/TextButton';
import moment from 'moment';
import { useTranslations } from 'next-intl';

interface IBattleGridProps {
  rounds: Round[];
  usersMap?: Map<string, User>;
  editingEnabled?: boolean;
  seedingEnabled?: boolean;
  showUserCountryFlag?: boolean;
  onDeleteRound?: (roundIndex: number, name: string) => void;
  onAddMatch?: (roundIndex: number) => void;
  onEditRound?: (roundIndex: number) => void;
  onUpdateTime?: (roundIndex: number, matchIndex: number, matchId: string, time: Moment | null) => void;
  onEditMatch?: (roundIndex: number, matchIndex: number) => void;
  onDeleteMatch?: (roundIndex: number, matchIndex: number) => void;
  onUpdateSlot?: (roundIndex: number, matchId: string, slotIndex: number, username: string, result: number) => void;
}

const BattleGrid = ({
  rounds,
  usersMap = new Map<string, User>(),
  editingEnabled = false,
  seedingEnabled = false,
  showUserCountryFlag = false,
  onDeleteRound,
  onAddMatch,
  onEditRound,
  onUpdateTime,
  onEditMatch,
  onDeleteMatch,
  onUpdateSlot,
}: IBattleGridProps) => {
  const t = useTranslations('global/components/battle-grid');

  return (
    <div className="flex overflow-y-auto">
      {rounds.map((round: Round, i: number) => {
        return (
          <div key={`rnd-${round.roundIndex}`} className={`${i > 0 ? 'ml-1' : ''} ${i < rounds.length - 1 ? 'mr-1' : ''}`}>
            <div className={`h-full flex flex-col`}>
              <div className={`flex justify-between items-center px-2 ${editingEnabled && 'mb-2 gap-2'}`}>
                <div className={`text-lg ${!editingEnabled ? 'flex w-full justify-center' : ''} `}>{round.name}</div>
                <div className="flex gap-1 justify-end w-fit">
                  {onEditRound && <ActionButton action={Action.EDIT} size={Size.S} onClick={() => onEditRound(round.roundIndex)} />}
                  {onDeleteRound && <ActionButton action={Action.DELETE} size={Size.S} onClick={() => onDeleteRound(round.roundIndex, round.name)} />}
                </div>
              </div>
              <div className={`px-2 h-6`}>
                <div className={`text-sm ${!editingEnabled ? 'flex w-full justify-center' : ''} `}>
                  {moment(round.date).isValid() &&
                    moment(round.date)
                      .locale('en')
                      .format(`dddd ${!editingEnabled && !seedingEnabled ? '' : ', MMMM D'}`)}
                </div>
              </div>

              <div className={`h-full flex flex-col ${!editingEnabled ? 'justify-center' : ''} mt-2`}>
                <div className="flex w-52 flex-col justify-center">
                  {round.matches.map((match, j) => {
                    return (
                      <div key={`match-${j}`} className={`${j > 0 ? 'mt-1' : ''} ${j < round.matches.length - 1 ? 'mb-1' : ''}`}>
                        <MatchCard
                          match={match}
                          usersMap={usersMap}
                          editingEnabled={editingEnabled}
                          seedingEnabled={seedingEnabled}
                          showUserCountryFlag={showUserCountryFlag}
                          onUpdateTime={(matchIndex: number, matchId: string, time: Moment | null) => {
                            onUpdateTime && onUpdateTime(rounds[i].roundIndex, matchIndex, matchId, time);
                          }}
                          onEditMatch={(matchIndex: number) => {
                            onEditMatch && onEditMatch(round.roundIndex, matchIndex);
                          }}
                          onDeleteMatch={(matchIndex: number) => {
                            onDeleteMatch && onDeleteMatch(round.roundIndex, matchIndex);
                          }}
                          onUpdateSlot={(matchId: string, slotIndex: number, username: string, result: number) => {
                            onUpdateSlot && onUpdateSlot(rounds[i].roundIndex, matchId, slotIndex, username, result);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {editingEnabled && onAddMatch && (
                  <div className="flex justify-center mt-2 gap-2 items-center">
                    <TextButton text={t('btnAddMatch')} onClick={() => onAddMatch(round.roundIndex)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BattleGrid;

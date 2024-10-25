'use client';

import ActionButton from '@/components/common/ActionButton';
import { Action } from '@/domain/enums/action';
import { routeEvents } from '@/domain/constants/routes';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import CheckBox from '@/components/common/CheckBox';
import Dialog from '@/components/Dialog';
import { Toaster, toast } from 'sonner';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { ConfigOptions, download, generateCsv, mkConfig } from 'export-to-csv';
import { AcceptedData } from 'export-to-csv/output/lib/types';
import { MatchSlot } from '@/types/match-slot';
import { User } from '@/types/user';
import { getUser } from '@/infrastructure/clients/user.client';
import { Competition } from '@/types/competition';
import { Round } from '@/types/round';

interface IActionButtonDownloadResults {
  event: Event;
  comp: Competition;
  rounds: Round[];
}

export const ActionButtonDownloadResults = ({ event, comp, rounds }: IActionButtonDownloadResults) => {
  const t = useTranslations('/events/eventid/comps/compid');

  const router = useRouter();

  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map<string, User>());
  const [exportContainsPlayerNames, setExportContainsPlayerNames] = useState<boolean>(false);

  const handleCancelDialogClicked = async () => {
    router.replace(`${routeEvents}/${event.id}/comps/${comp.id}`);
  };

  const handleDownloadResultsClicked = async () => {
    router.replace(`${routeEvents}/${event.id}/comps/${comp.id}/?download=1`);
  };

  const getAmountDirectComparisonsOfMatch = (matchSlots: MatchSlot[]): number => {
    let amountComparisons = 0;
    let i = matchSlots.length;

    while (i > 0) {
      amountComparisons = amountComparisons + i - 1;

      i--;
    }

    return amountComparisons;
  };

  const handleDownloadResultsConfirmedClicked = () => {
    const options: ConfigOptions = { filename: `${moment().format('YYYYMMDD HHmmss')} - ${comp?.name} - results`, useKeysAsHeaders: true };
    const csvConfig = mkConfig(options);

    const data = mapRoundsToCsv(rounds, exportContainsPlayerNames);
    if (data.length > 0) {
      const csvOutput = generateCsv(csvConfig)(data);
      download(csvConfig)(csvOutput);
    }
  };

  const getBinaryResultForRes1 = (res1: number, res2: number): number => {
    return res1 > res2 ? 1 : 0;
  };

  const mapRoundsToCsv = (rounds: Round[], addPlayerNames: boolean): { [k: string]: AcceptedData; [k: number]: AcceptedData }[] => {
    const na = 'n/a';
    const data: { [k: string]: AcceptedData; [k: number]: AcceptedData }[] = [];

    let checkValueAmountMatches = 0;

    let matchId = 0;

    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const matches = round.matchesAscending;
      for (let j = 0; j < matches.length; j++) {
        const match = matches[j];
        checkValueAmountMatches += getAmountDirectComparisonsOfMatch(match.matchSlots);

        // Loop through slots.
        // Take a slot (s1) of match.
        let k = 0;
        while (k < match.matchSlots.length - 1) {
          // Take slot (s2) of match. This is the slot after slot s1.
          let l = k + 1;
          while (l < match.matchSlots.length) {
            const battleId = matchId + 1; // WFFA battle index starts at 1

            const s1 = match.matchSlots[k];
            const p1 = usersMap.get(s1.name);

            const s2 = match.matchSlots[l];
            const p2 = usersMap.get(s2.name);

            const battleType = match.slots > 2 ? 'C' : 'B'; // B = 1vs1, C = Circle

            let p1Result: string | number = na;
            let p2Result: string | number = na;

            if (s1.result !== undefined && s2.result !== undefined && s1.result > -1 && s2.result > -1) {
              p1Result = getBinaryResultForRes1(s1.result, s2.result);
              p2Result = getBinaryResultForRes1(s2.result, s1.result);
            }

            if (addPlayerNames) {
              data.push({
                battle_id: battleId,
                player_a_id: p1?.wffaId ? p1.wffaId : '',
                player_a_name: p1?.lastName ? `${p1?.firstName} ${p1?.lastName}` : p1?.firstName,
                player_a_result: p1Result,
                player_b_id: p2?.wffaId ? p2.wffaId : '',
                player_b_name: p2?.lastName ? `${p2?.firstName} ${p2?.lastName}` : p2?.firstName,
                player_b_result: p2Result,
                battle_type: battleType,
                competition_type: '', // leave empty
                competition_strength: '', // leave empty
              });
            } else {
              data.push({
                battle_id: battleId,
                player_a_id: p1?.wffaId ? p1.wffaId : '',
                player_a_result: p1Result,
                player_b_id: p2?.wffaId ? p2.wffaId : '',
                player_b_result: p2Result,
                battle_type: battleType,
                competition_type: '', // leave empty
                competition_strength: '', // leave empty
              });
            }

            matchId += 1;
            l++;
          }

          k++;
        }
      }
    }

    console.info('amount matches (check value): ', checkValueAmountMatches);

    if (checkValueAmountMatches === 0) {
      toast.error('Matches seems to have inconsistent data.');
    } else if (data.length === checkValueAmountMatches) {
      toast.info('Processed battle results.');
    } else {
      toast.error('Export of battle results is inconsistent.');
    }
    return data;
  };

  useEffect(() => {
    const getUsers = async () => {
      const usersMap = new Map();
      const requests: Promise<void>[] = [];
      rounds.map((round) => {
        round.matches.map((match) => {
          match.matchSlots.map((slot) => {
            if (!usersMap.get(slot.name)) {
              const req = getUser(slot.name).then((user) => {
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

  return (
    <>
      <Toaster richColors />

      <Dialog
        title={t('dlgDownloadResultsTitle')}
        queryParam="download"
        confirmText={t('dlgDownloadResultsBtnDownload')}
        onCancel={handleCancelDialogClicked}
        onConfirm={handleDownloadResultsConfirmedClicked}
      >
        <p className="px-2">{t('dlgDownloadResultsText')}</p>

        <CheckBox
          id={'addPlayerNames'}
          label={t('dlgDownloadResultsCbAddPlayerNames')}
          onChange={() => {
            setExportContainsPlayerNames(!exportContainsPlayerNames);
          }}
        ></CheckBox>
      </Dialog>

      {rounds.length > 0 && rounds[0].matches.length > 0 && <ActionButton action={Action.DOWNLOAD} onClick={handleDownloadResultsClicked} />}
    </>
  );
};

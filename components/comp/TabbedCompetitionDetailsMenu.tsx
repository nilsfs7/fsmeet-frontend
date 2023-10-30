import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ParticipantList from '../events/ParticipantList';
import { User } from '@/types/user';
import Separator from '../Seperator';

interface ITabbedCompetitionDetailsMenuProps {
  competitionParticipants: User[];
  description?: string;
  rules?: string;
}

const TabbedCompetitionDetailsMenu = ({ competitionParticipants = [], description, rules }: ITabbedCompetitionDetailsMenuProps) => {
  return (
    <Tabs>
      <TabList>
        {competitionParticipants.length > 0 && <Tab>Participants</Tab>}
        {(description || rules) && <Tab>Rules</Tab>}
      </TabList>

      {competitionParticipants.length > 0 && (
        <TabPanel>
          <ParticipantList participants={competitionParticipants} />
        </TabPanel>
      )}

      {(description || rules) && (
        <TabPanel>
          <div className={'h-fit rounded-lg border border-secondary-dark bg-secondary-light p-2 text-sm'}>
            {description && (
              <div>
                <div className="text-base font-bold">Description</div>
                <div className={'p-2'}>{description && <div>{description}</div>}</div>
              </div>
            )}

            {description && rules && <Separator />}

            {rules && (
              <div className={`${description ? 'mt-2' : ''}`}>
                <div className="text-base font-bold">Rules</div>
                <div className={'p-2'}>{rules && <div>{rules}</div>}</div>
              </div>
            )}
          </div>
        </TabPanel>
      )}
    </Tabs>
  );
};

export default TabbedCompetitionDetailsMenu;

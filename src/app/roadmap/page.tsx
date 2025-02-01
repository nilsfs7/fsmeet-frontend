import Separator from '@/components/Seperator';
import { Row } from './components/row';
import { Task } from './components/task';
import { Section } from './components/section';
import { TaskSize } from '@/domain/enums/task-size';
import PageTitle from '@/components/PageTitle';

export default async function Roadmap() {
  return (
    <>
      <PageTitle title={'Roadmap'} />

      <div className="flex flex-col">
        <Section title={'Event Registration Process'}>
          <Row>
            <Task
              title="Event Registration Process v2"
              size={TaskSize.LARGE}
              filled={30}
              description={`Multi step registration process.\n1) Registration type (perticipant / visitor)\n2) Choose comps (when participant)\n3) Paiment details and overview\n4) Finish registration`}
            />
            <Task
              title="Credit Card Payments"
              size={TaskSize.HUGE}
              filled={0}
              description={`Choose to pay at end of process if offereed.\n\nIntegration with stripe.\nRequires event host to have stripe account.`}
            />
            <Task title="Accommodation" size={TaskSize.LARGE} filled={0} />
          </Row>
        </Section>

        <div className="p-4">
          <Separator />
        </div>

        <Section title={'Event Management'}>
          <Row>
            <Task title="Invite freestyler (mail)" size={TaskSize.SMALL} filled={0} description="Standardized mailing to promote your event to FSMeet users. Must be a paid feature to avoid spam." />
          </Row>
        </Section>

        <Section title={'Competitions'}>
          <Row>
            <Task title="Delay schedule" size={TaskSize.SMALL} filled={0} description="User has the option to pick a certain battle and delay all future battles by any amount of minutes." />
          </Row>

          <Row>
            <Task title="Download report for world ranks" size={TaskSize.MEDIUM} filled={90} description="Competition host can download csv containing all battle data to transmit to WFFA." />
          </Row>

          <Row>
            <Task
              title="Filter schedule by participant"
              size={TaskSize.SMALL}
              filled={100}
              description="Reduce battles to single participant. Add searchable filter in schedule based on participant name. "
            />
          </Row>

          <Row>
            <Task title="Sick3 Mode" size={TaskSize.MEDIUM} filled={2} />
          </Row>

          <Row>
            <Task title="Challenge Mode" size={TaskSize.LARGE} filled={0} />
          </Row>
        </Section>

        <div className="p-4">
          <Separator />
        </div>

        <Section title={'Freestyler Map'}>
          <Row>
            <Task title="Iframe version" size={TaskSize.SMALL} filled={0} description="Make external websites be able to integrate the freesytler map with ease" />
          </Row>

          <Row>
            <Task title="Show events" size={TaskSize.SMALL} filled={0} description="Show events with an icon. Filter for upcoming and recent events." />
          </Row>

          <Row>
            <Task title="Trainingspots" size={TaskSize.MEDIUM} filled={0} description="Show trainingspots with an icon. Lets freestyler share their favourite spots." />
          </Row>
        </Section>

        <div className="p-4">
          <Separator />
        </div>

        <Section title={'WFFA'}>
          <Row>
            <Task title="Enhance permission" size={TaskSize.SMALL} filled={0} description="Flags an account with enhanced rights when signed up with ...@wffa.org." />
            <Task title="Assign Freestyler-ID" size={TaskSize.MEDIUM} filled={0} description="WFFA user is able to assign / manage users Freestyler-ID. FID is important for battle data." />
          </Row>
        </Section>

        <div className="p-4">
          <Separator />
        </div>

        <Section title={'Technical'}>
          <Row>
            <Task title="Migration to Next v15" size={TaskSize.LARGE} filled={80} description="Next v15 solves serveral problems with data loading when switching routes." />
            <Task title="Upgrade to next-auth v5" size={TaskSize.MEDIUM} filled={50} description="Mandatory upgrade when switching to next v15." />
            <Task title="Sign up via Instagram" size={TaskSize.MEDIUM} filled={0} description="Users hate choosing passwords. Offer sign up using Instagram account." />
          </Row>

          <Row>
            <Task
              title="Send mails using @fsmeet.com"
              size={TaskSize.LARGE}
              filled={0}
              description="Currently uses @t-online.de. Some users face issues with mails going to spam. Switch to @fsmeet.com"
            />
          </Row>
        </Section>
      </div>
    </>
  );
}

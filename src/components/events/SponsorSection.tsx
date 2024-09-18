import { Sponsor } from '@/types/sponsor';
import SponsorBadge from './SponsorBadge';

interface ISponsorSectionProps {
  eventSponsors: Sponsor[];
}

const SponsorSection = ({ eventSponsors }: ISponsorSectionProps) => {
  return (
    <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2'}>
      <div className="text-base font-bold">{`Sponsors`}</div>

      <div className="flex flex-wrap">
        {eventSponsors.map((sponsor, i) => {
          let margin = 'my-1 mx-1';
          i === 0 ? (margin = 'm-1') : null;
          i === eventSponsors.length - 1 ? (margin = 'ml-1') : null;

          return (
            <div key={i} className={`my-1 ${margin}`}>
              {<SponsorBadge sponsor={sponsor} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorSection;

import { Sponsor } from '@/types/sponsor';

interface ISponsorCardProps {
  sponsor: Sponsor;
}

const SponsorCard = ({ sponsor }: ISponsorCardProps) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={sponsor.website}>
      <div className={'rounded-lg border border-secondary-dark bg-secondary-light p-2 hover:border-primary'}>
        <div className="grid grid-flow-col items-center justify-between">
          {sponsor.imageUrlLogo && <img src={sponsor.imageUrlLogo} className="mx-1 h-6 w-6 rounded-full object-cover" alt="logo" />}
          <div className="mx-1">{sponsor.name}</div>
        </div>
      </div>
    </a>
  );
};

export default SponsorCard;

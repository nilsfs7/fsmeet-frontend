import InstagramIcon from '@mui/icons-material/Instagram';
import { Platform } from '@/types/enums/platform';
import { LogoIcon } from '../Logo';

interface ISocialLink {
  platform: Platform;
  path: string;
}

const SocialLink = ({ platform, path }: ISocialLink) => {
  const textColor = 'text-primary';

  let icon = (
    <div className="flex h-8 w-10 items-center justify-center text-center">
      <LogoIcon />
    </div>
  );
  let url = `/user/${path}`;

  switch (platform) {
    case Platform.INSTAGRAM:
      icon = <InstagramIcon fontSize="large" className={`${textColor}`} />;
      url = `https://www.instagram.com/${path.replace('@', '')}`;
      break;
  }

  return (
    <div className="flex flex-col">
      <a className="items-center text-center" href={url}>
        <div className="h-9">{icon}</div>
        <div>{path}</div>
      </a>
    </div>
  );
};

export default SocialLink;

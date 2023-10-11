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
      icon = (
        <div className="m-0 p-0">
          <InstagramIcon fontSize="large" className={`${textColor}`} />
        </div>
      );
      url = `https://www.instagram.com/${path.replace('@', '')}`;
      break;
  }

  return (
    <a href={url}>
      <div className="flex items-center gap-1">
        {icon}
        {path}
      </div>
    </a>
  );
};

export default SocialLink;

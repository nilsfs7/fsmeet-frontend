import { Platform } from '@/types/enums/platform';
import { LogoFSM } from '../Logo';
import { imgInstagramLogo, imgTikTokLogo, imgYouTubeLogo } from '@/types/consts/images';

interface ISocialLink {
  platform: Platform;
  path: string;
}

const SocialLink = ({ platform, path }: ISocialLink) => {
  const textColor = 'text-primary';

  let icon = (
    <div className="flex h-8 w-10 items-center justify-center text-center">
      <LogoFSM />
    </div>
  );
  let url = `/user/${path}`;

  switch (platform) {
    case Platform.INSTAGRAM:
      icon = <img className="h-8" src={imgInstagramLogo} alt="instagram icon" />;
      url = `https://www.instagram.com/${path.replace('@', '')}`;
      break;

    case Platform.TIKTOK:
      icon = <img className="h-8" src={imgTikTokLogo} alt="tiktok icon" />;
      url = `https://www.tiktok.com/${path}`;
      break;

    case Platform.YOUTUBE:
      icon = <img className="h-8" src={imgYouTubeLogo} alt="youtube icon" />;
      url = `https://www.youtube.com/${path}`;
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

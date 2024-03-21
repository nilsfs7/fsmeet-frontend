import { Platform } from '@/types/enums/platform';
import { LogoFSM } from '../Logo';
import { imgInstagramLogo, imgTikTokLogo, imgWebsiteLogo, imgYouTubeLogo } from '@/types/consts/images';
import { routeUsers } from '@/types/consts/routes';

interface ISocialLink {
  platform: Platform;
  path: string;
  showPath?: boolean;
}

const SocialLink = ({ platform, path, showPath = true }: ISocialLink) => {
  let icon = (
    <div className="flex h-8 w-10 items-center justify-center text-center">
      <LogoFSM />
    </div>
  );
  let url = `${routeUsers}/${path}`;

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

    case Platform.WEBSITE:
      icon = <img className="h-8" src={imgWebsiteLogo} alt="website icon" />;
      url = path;
      path = path.replace('https://', '').replace('http://', '');
      break;
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={url}>
      <div className="flex items-center gap-1 hover:underline">
        {icon}
        {showPath && <>{path}</>}
      </div>
    </a>
  );
};

export default SocialLink;

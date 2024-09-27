import { Platform } from '@/domain/enums/platform';
import { LogoFSM } from '../Logo';
import { imgInstagramLogo, imgTikTokLogo, imgWebsiteLogo, imgYouTubeLogo } from '@/types/consts/images';
import { routeUsers } from '@/types/consts/routes';
import Link from 'next/link';

interface ISocialLink {
  platform: Platform;
  path: string;
  showPath?: boolean;
}

const SocialLink = ({ platform, path, showPath = true }: ISocialLink) => {
  let icon = <></>;
  let url = ``;

  switch (platform) {
    case Platform.FSMEET:
      icon = <LogoFSM />;
      url = `${routeUsers}/${path}`;
      break;

    case Platform.INSTAGRAM:
      icon = <img src={imgInstagramLogo} alt="instagram icon" />;
      url = `https://www.instagram.com/${path.replace('@', '')}`;
      break;

    case Platform.TIKTOK:
      icon = <img src={imgTikTokLogo} alt="tiktok icon" />;
      url = `https://www.tiktok.com/${path}`;
      break;

    case Platform.YOUTUBE:
      icon = <img src={imgYouTubeLogo} alt="youtube icon" />;
      url = `https://www.youtube.com/${path}`;
      break;

    case Platform.WEBSITE:
      icon = <img className="h-8" src={imgWebsiteLogo} alt="website icon" />;
      url = path;
      path = path.replace('https://', '').replace('http://', '');
      break;
  }

  return (
    <>
      {platform === Platform.FSMEET && (
        <Link href={url}>
          <div className="flex items-center gap-1">
            <div className="flex w-10 items-center justify-center text-center">{icon}</div>

            {showPath && <div className="hover:underline">{path}</div>}
          </div>
        </Link>
      )}

      {platform !== Platform.FSMEET && (
        <a target="_blank" rel="noopener noreferrer" href={url}>
          <div className="flex items-center gap-1">
            <div className="flex w-8 items-center justify-center text-center">{icon}</div>

            {showPath && <div className="hover:underline">{path}</div>}
          </div>
        </a>
      )}
    </>
  );
};

export default SocialLink;

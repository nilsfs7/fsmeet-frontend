import { SocialPlatform } from '@/domain/enums/social-platform';
import { LogoFSM } from '../logo';
import { imgInstagramLogo, imgTikTokLogo, imgWebsiteLogo, imgYouTubeLogo } from '@/domain/constants/images';
import { routeUsers } from '@/domain/constants/routes';
import Link from 'next/link';

interface ISocialLink {
  platform: SocialPlatform;
  path: string;
  showPath?: boolean;
  pathNameOverride?: string;
}

const SocialLink = ({ platform, path, showPath = true, pathNameOverride }: ISocialLink) => {
  let icon = <></>;
  let url = ``;

  switch (platform) {
    case SocialPlatform.FSMEET:
      icon = <LogoFSM />;
      url = `${routeUsers}/${path}`;
      break;

    case SocialPlatform.INSTAGRAM:
      icon = <img src={imgInstagramLogo} alt="instagram icon" />;
      url = `https://www.instagram.com/${path.replace('@', '')}`;
      break;

    case SocialPlatform.TIKTOK:
      icon = <img src={imgTikTokLogo} alt="tiktok icon" />;
      url = `https://www.tiktok.com/${path}`;
      break;

    case SocialPlatform.YOUTUBE:
      icon = <img src={imgYouTubeLogo} alt="youtube icon" />;
      url = `https://www.youtube.com/${path}`;
      break;

    case SocialPlatform.WEBSITE:
      icon = <img className="h-8" src={imgWebsiteLogo} alt="website icon" />;
      url = path;
      path = path.replace('https://', '').replace('http://', '');
      break;
  }

  return (
    <>
      {platform === SocialPlatform.FSMEET && (
        <Link href={url}>
          <div className="flex items-center gap-1">
            <div className="flex w-10 items-center justify-center text-center">{icon}</div>

            {showPath && <div className="hover:underline">{pathNameOverride ? pathNameOverride : path}</div>}
          </div>
        </Link>
      )}

      {platform !== SocialPlatform.FSMEET && (
        <a target="_blank" rel="noopener noreferrer" href={url}>
          <div className="flex items-center gap-1">
            <div className="flex w-8 items-center justify-center text-center">{icon}</div>

            {showPath && <div className="hover:underline">{pathNameOverride ? pathNameOverride : path}</div>}
          </div>
        </a>
      )}
    </>
  );
};

export default SocialLink;

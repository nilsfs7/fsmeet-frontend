import SocialLink from '@/components/user/social-link';
import { SocialPlatform } from '@/domain/enums/social-platform';
import type { User } from '@/domain/types/user';

interface ProfileSocialsProps {
  user: User;
}

export function ProfileSocials({ user }: ProfileSocialsProps) {
  const hasSocials = Boolean(user.instagramHandle || user.tikTokHandle || user.youTubeHandle || user.website);
  if (!hasSocials) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {user.instagramHandle && <SocialLink platform={SocialPlatform.INSTAGRAM} path={user.instagramHandle} showPath={false} />}
      {user.tikTokHandle && <SocialLink platform={SocialPlatform.TIKTOK} path={user.tikTokHandle} showPath={false} />}
      {user.youTubeHandle && <SocialLink platform={SocialPlatform.YOUTUBE} path={user.youTubeHandle} showPath={false} />}
      {user.website && <SocialLink platform={SocialPlatform.WEBSITE} path={user.website} showPath={false} />}
    </div>
  );
}

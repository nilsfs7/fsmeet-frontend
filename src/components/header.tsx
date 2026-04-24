import LanguagePicker from './language-picker';
import { appShellContentClass } from '@/components/layout/app-shell-content';
import { LogoFSMeet } from './logo';
import ProfileMenu from './user/profile-menu';
import { cn } from '@/lib/utils';

interface IHeaderProps {
  showMenu?: boolean;
}

/**
 * App bar: aligned with `PageInset` (max-w-content, horizontal padding), sticky with subtle
 * border + glass-style surface so content scrolls cleanly underneath.
 */
export const Header = ({ showMenu = false }: IHeaderProps) => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-secondary-light/85 pt-[max(0px,env(safe-area-inset-top))] shadow-xs backdrop-blur-md supports-[backdrop-filter]:bg-secondary-light/70 dark:border-border/50 dark:bg-background/80 dark:supports-[backdrop-filter]:bg-background/60"
    >
      <div className={cn(appShellContentClass, 'flex h-16 items-center justify-between gap-3 sm:h-[4.5rem] sm:gap-4')}>
        <div className="min-w-0 flex-1 pr-2">
          <LogoFSMeet />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {showMenu && <ProfileMenu />}
          <LanguagePicker />
        </div>
      </div>
    </header>
  );
};

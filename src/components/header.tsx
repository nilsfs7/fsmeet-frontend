import LanguagePicker from './language-picker';
import { LogoFSMeet } from './logo';
import ProfileMenu from './user/profile-menu';

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
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:gap-4 sm:px-6 md:px-8">
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

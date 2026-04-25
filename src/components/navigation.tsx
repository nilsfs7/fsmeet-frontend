import { appShellContentClass } from '@/components/layout/app-shell-content';
import { cn } from '@/lib/utils';

/** Matches `Header` surface: border, glass, shadow, dark tokens. */
const navShellClass = cn(
  'border-t border-border/60 bg-secondary-light/85 shadow-xs backdrop-blur-md',
  'supports-[backdrop-filter]:bg-secondary-light/70',
  'pb-[max(0px,env(safe-area-inset-bottom))]',
  'dark:border-border/50 dark:bg-background/80 dark:supports-[backdrop-filter]:bg-background/60',
);

interface INavigationProps {
  reverse?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Navigation = ({ reverse = false, className, children }: INavigationProps) => {
  const bar = (
    <div
      className={cn(
        'flex min-h-14 w-full min-w-0 items-center sm:min-h-[4.5rem]',
        'flex-shrink-0 gap-2 py-2 sm:gap-3',
        reverse ? 'justify-end' : 'justify-between',
      )}
    >
      {children}
    </div>
  );

  return (
    <div className={cn('mt-auto w-full shrink-0 flex min-w-0 flex-col', className)} role="presentation">
      <div className="h-4 w-full min-h-4 shrink-0" aria-hidden />
      <nav className={navShellClass} aria-label="App">
        <div className={appShellContentClass}>{bar}</div>
      </nav>
    </div>
  );
};

export default Navigation;

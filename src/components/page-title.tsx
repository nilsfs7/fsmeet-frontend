import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface IPageTitle {
  title: string;
  /** Optional muted lead line under the heading. */
  description?: ReactNode;
  className?: string;
}

/** Page heading: layout horizontal padding; top inset below app header; bottom margin 8/16px rhythm. */
const PageTitle = ({ title, description, className }: IPageTitle) => {
  if (!description) {
    return <h1 className={cn('px-4 text-center text-heading-1 sm:px-6 md:px-8', 'mt-4', 'mb-4 sm:mb-6', className)}>{title}</h1>;
  }

  return (
    <div className={cn('flex flex-col items-center gap-1 px-4 text-center sm:px-6 md:px-8', 'mt-4', 'mb-4 sm:mb-6', className)}>
      <h1 className="text-heading-1">{title}</h1>
      <p className="max-w-[44rem] text-balance text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
};

export default PageTitle;

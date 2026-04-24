import { cn } from '@/lib/utils';

interface IPageTitle {
  title: string;
  className?: string;
}

/** Page heading: uses layout contract horizontal padding; bottom margin follows 8/16px rhythm. */
const PageTitle = ({ title, className }: IPageTitle) => {
  return (
    <h1 className={cn('px-4 text-center text-heading-1 sm:px-6 md:px-8', 'mb-4 sm:mb-6', className)}>
      {title}
    </h1>
  );
};

export default PageTitle;

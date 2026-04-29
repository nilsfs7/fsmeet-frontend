import { cn } from '@/lib/utils';

interface IPageTitle {
  title: string;
  className?: string;
}

/** Page heading: layout horizontal padding; top inset below app header; bottom margin 8/16px rhythm. */
const PageTitle = ({ title, className }: IPageTitle) => {
  return <h1 className={cn('px-4 text-center text-heading-1 sm:px-6 md:px-8', 'mt-2f sm:mt-4', 'mb-4 sm:mb-6', className)}>{title}</h1>;
};

export default PageTitle;

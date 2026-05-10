import { cn } from '@/lib/utils';

/** Shared chip look for `Label` and `NotListedLabel` (bordered muted pill). */
export const statusChipClassName = cn(
  'mr-1.5 inline-block align-middle rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5',
  'text-2xs font-medium text-muted-foreground sm:text-xs',
);

interface ILabel {
  text: string;
  capitalize?: boolean;
  className?: string;
}

const Label = ({ text, capitalize = false, className }: ILabel) => {
  return (
    <span className={cn(statusChipClassName, capitalize && 'capitalize', className)}>
      {(text.charAt(0).toUpperCase() + text.slice(1)).replaceAll('_', ' ')}
    </span>
  );
};

export default Label;

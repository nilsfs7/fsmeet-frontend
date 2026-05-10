import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AppDataStateErrorProps = {
  /** Shown in bold; falls back to a generic line if omitted */
  title?: string;
  message: string;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/** Inline fetch / data error (P1: same pattern for lists and details). */
export function AppDataStateError({ title, message, className, onRetry, retryLabel = 'Try again' }: AppDataStateErrorProps) {
  return (
    <Alert variant="destructive" className={cn('w-full max-w-lg', className)}>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-foreground">{message}</span>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

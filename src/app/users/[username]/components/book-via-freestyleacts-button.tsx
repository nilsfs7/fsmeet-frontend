import { ExternalTextLinkButton } from '@/components/common/external-text-link-button';
import { buildFreestyleActsFreestylerUrl } from '@/lib/freestyleacts-url';
import { getTranslations } from 'next-intl/server';

interface BookViaFreestyleActsButtonProps {
  username: string;
  className?: string;
}

export async function BookViaFreestyleActsButton({ username, className }: BookViaFreestyleActsButtonProps) {
  const t = await getTranslations('/users/username');
  const label = t('btnBookViaFreestyleActs');

  return (
    <ExternalTextLinkButton
      href={buildFreestyleActsFreestylerUrl(username)}
      ariaLabel={`${label} — FreestyleActs`}
      className={className}
    >
      {label}
    </ExternalTextLinkButton>
  );
}

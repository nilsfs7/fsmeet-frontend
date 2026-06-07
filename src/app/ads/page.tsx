import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeAds, routeHome } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getAdvertisements } from '@/infrastructure/clients/advertisement.client';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { auth } from '@/auth';

const constrainedContentClass = 'mx-auto w-full max-w-3xl min-w-0 px-3 sm:px-4';

export default async function Ads() {
  const t = await getTranslations('/ads');
  const session = await auth();

  const advertisements = await getAdvertisements(session?.user?.username ?? null);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={constrainedContentClass}>
        <PageTitle title={t('pageTitle')} />
      </div>

      <div className={cn('mt-2 min-h-0 flex-1 overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col gap-3 text-sm">
          <div className="min-h-0 min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableColDescription')}</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">{t('tableColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                      {t('textNoAds')}
                    </TableCell>
                  </TableRow>
                ) : (
                  advertisements.map((advertisement, index) => (
                    <TableRow key={advertisement.id ?? index}>
                      <TableCell className="font-medium">{advertisement.title}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButton href={`${routeAds}/${advertisement.id}/stats`} action={Action.STATISTICS} tooltip={t('tooltipViewStats')} />
                          <ActionButton href={`${routeAds}/${advertisement.id}/edit`} action={Action.EDIT} tooltip={t('tooltipEditAd')} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
        <Button asChild variant="action" className={ctaActionButtonClassName}>
          <Link href={`${routeAds}/create`}>{t('btnCreate')}</Link>
        </Button>
      </Navigation>
    </div>
  );
}

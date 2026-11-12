import { IconClick, IconPointer } from '@tabler/icons-react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import { routeAds } from '@/domain/constants/routes';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import { getTranslations } from 'next-intl/server';
import { getAdvertisement, getAdvertisementActivity } from '@/infrastructure/clients/advertisement.client';
import { auth } from '@/auth';
import { Platform } from '@/domain/enums/platform';
import moment from 'moment';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChartLine } from '@/components/charts/chart-line';
import { ActivityTable, type ActivityTableRow, type DisplayPlatform } from './components/activity-table';

function toDisplayPlatform(platform: Platform): DisplayPlatform {
  return platform === Platform.WEB ? 'web' : 'mobile';
}

function formatMonth(month: string): string {
  const parsed = moment(month, ['YYYY-MM', 'YYYY-MM-DD'], true);
  return parsed.isValid() ? parsed.format('MMM YY') : month;
}

export default async function AdvertisementStatsPage(props: { params: Promise<{ advertisementId: string }> }) {
  const params = await props.params;
  const [t, tGlobal, session] = await Promise.all([getTranslations('/ads/stats'), getTranslations('global/data-states'), auth()]);

  let advertisementTitle: string | undefined;
  let activity: Awaited<ReturnType<typeof getAdvertisementActivity>> = [];
  let loadError = false;

  try {
    const [advertisement, activityRows] = await Promise.all([getAdvertisement(params.advertisementId), getAdvertisementActivity(params.advertisementId, session)]);
    advertisementTitle = advertisement.title;
    activity = activityRows;
  } catch {
    loadError = true;
  }

  const totalClicks = activity.reduce((sum, row) => sum + row.clicks, 0);
  const totalHovers = activity.reduce((sum, row) => sum + row.hovers, 0);

  const aggregatedByKey = new Map<string, ActivityTableRow>();
  activity.forEach(row => {
    const platform = toDisplayPlatform(row.platform);
    const key = `${row.month}|${platform}|${row.countryCode ?? ''}`;
    const current = aggregatedByKey.get(key) ?? { month: row.month, platform, countryCode: row.countryCode, clicks: 0, hovers: 0 };
    current.clicks += row.clicks;
    current.hovers += row.hovers;
    aggregatedByKey.set(key, current);
  });

  const activityRows = [...aggregatedByKey.values()];

  const totalsByMonth = new Map<string, { clicks: number; hovers: number }>();
  activity.forEach(row => {
    const current = totalsByMonth.get(row.month) ?? { clicks: 0, hovers: 0 };
    current.clicks += row.clicks;
    current.hovers += row.hovers;
    totalsByMonth.set(row.month, current);
  });

  const chartData = [...totalsByMonth.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([month, totals]) => ({ date: formatMonth(month), l1: totals.clicks, l2: totals.hovers }));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageTitle title={advertisementTitle ? t('pageTitleWithAd', { title: advertisementTitle }) : t('pageTitle')} />

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {loadError ? (
            <Alert variant="destructive" className="max-w-lg">
              <AlertTitle>{tGlobal('errorTitle')}</AlertTitle>
              <AlertDescription>{t('toastLoadFailed')}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col gap-5 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                    <IconClick className="h-5 w-5" stroke={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('summaryTotalClicks')}</p>
                    <p className="text-2xl font-bold tabular-nums text-foreground">{totalClicks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                    <IconPointer className="h-5 w-5" stroke={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('summaryTotalHovers')}</p>
                    <p className="text-2xl font-bold tabular-nums text-foreground">{totalHovers}</p>
                  </div>
                </div>
              </div>

              {chartData.length > 0 && <ChartLine data={chartData} labels={[t('tableColClicks'), t('tableColHovers')]} title={t('chartActivityTitle')} description={t('chartActivityDescription')} />}

              <ActivityTable rows={activityRows} />
            </div>
          )}
        </div>
      </div>

      <Navigation>
        <ActionButton href={`${routeAds}/${params.advertisementId}/edit`} action={Action.BACK} />
      </Navigation>
    </div>
  );
}

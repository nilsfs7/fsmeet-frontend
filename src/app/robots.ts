import type { MetadataRoute } from 'next';
import { routeAccount, routeAdminOverview, routeEventsCreate, routeEventSubs, routeFeedback, routeJobs, routeVoiceManage, routeWffaOverview } from '@/domain/constants/routes';
import { getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [routeAccount, routeAdminOverview, routeJobs, routeFeedback, routeEventSubs, routeEventsCreate, routeVoiceManage, routeWffaOverview, '/password'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

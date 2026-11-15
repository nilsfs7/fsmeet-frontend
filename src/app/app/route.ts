import { NextResponse, type NextRequest } from 'next/server';
import { appStoreUrl, googlePlayUrl } from '@/domain/constants/app-links';
import { routeHome } from '@/domain/constants/routes';
import { getRequestOrigin } from '@/lib/request-origin';

/**
 * `/app` → the matching store for the scanning device (QR code target in the Home app section).
 * Desktop / unknown devices land on the Home app section instead.
 */
export function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';

  if (/android/i.test(ua)) return NextResponse.redirect(googlePlayUrl, 302);
  if (/iphone|ipad|ipod|macintosh.*mobile/i.test(ua)) return NextResponse.redirect(appStoreUrl, 302);

  return NextResponse.redirect(`${getRequestOrigin(request.headers)}${routeHome}#app`, 302);
}

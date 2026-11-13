import { StripeLoginLinkError } from '@/infrastructure/clients/user.client';

/** Why the Stripe (Express) dashboard could not be opened, mapped from the login-link request. */
export type StripeDashboardIssue = 'unavailable' | 'onboarding' | 'session' | 'generic';

/**
 * Maps the login-link error to what the user can do next.
 * - 412 Precondition Failed: the backend's answer when the connected account hasn't finished Stripe onboarding
 *   (Stripe then refuses the login link) -> "finish Stripe setup".
 * - explicit codes/messages about onboarding -> "finish Stripe setup".
 * - dashboard-type problems (409/422, or a dashboard message without 412) and legacy 500s -> "dashboard not available" (fallback).
 */
export function classifyStripeLoginLinkError(error: unknown): StripeDashboardIssue {
  if (!(error instanceof StripeLoginLinkError)) return 'generic';
  const code = (error.code || '').toLowerCase();
  const message = (error.message || '').toLowerCase();

  if (error.status === 401 || error.status === 403) return 'session';
  if (error.status === 412 || code.includes('onboarding') || message.includes('onboarding') || message.includes('details_submitted')) return 'onboarding';
  if (code.includes('dashboard') || message.includes('express dashboard') || message.includes('not an express account') || message.includes('edit link')) return 'unavailable';
  if (error.status === 409 || error.status === 422 || error.status === 500) return 'unavailable';
  return 'generic';
}

const STORAGE_PREFIX = 'stripeDashboardUnavailable:';

/** Remember (per tab session) that the dashboard isn't available for this account, so the button is disabled with a hint. */
export function rememberDashboardUnavailable(stripeAccountId: string) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + stripeAccountId, '1');
  } catch {
    // storage unavailable (private mode): the hint just won't persist
  }
}

export function forgetDashboardUnavailable(stripeAccountId: string) {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + stripeAccountId);
  } catch {
    // ignore
  }
}

export function isDashboardKnownUnavailable(stripeAccountId: string): boolean {
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + stripeAccountId) === '1';
  } catch {
    return false;
  }
}

/**
 * Opens a tab synchronously in the click handler (so popup blockers allow it) and points it at the URL once known.
 * Falls back to same-tab navigation if the browser blocked the tab.
 */
export function openPendingTab(loadingText: string) {
  const tab = window.open('', '_blank');
  if (tab) {
    try {
      tab.document.title = loadingText;
      tab.document.body.style.cssText = 'font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;color:#475569';
      tab.document.body.textContent = loadingText;
    } catch {
      // cross-origin / restricted documents: ignore, the tab still navigates below
    }
  }
  return {
    go(url: string) {
      if (tab && !tab.closed) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.location.assign(url);
      }
    },
    cancel() {
      if (tab && !tab.closed) tab.close();
    },
  };
}

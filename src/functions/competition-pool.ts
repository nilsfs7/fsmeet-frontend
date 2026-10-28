import { CompetitionGender } from '@/domain/enums/competition-gender';
import { EventRegistrationStatus } from '@/domain/enums/event-registration-status';
import { MaxAge } from '@/domain/enums/max-age';
import { UserType } from '@/domain/enums/user-type';
import { Competition } from '@/domain/types/competition';
import { EventRegistration } from '@/domain/types/event-registration';
import { User } from '@/domain/types/user';

export type PoolMember = { username: string; imageUrl?: string; firstName?: string; lastName?: string };

export type PoolRow = {
  user: User;
  registration: EventRegistration | null;
  signedUp: boolean;
  inPool: boolean;
  eligible: boolean;
};

export type PoolCounts = {
  inPool: number;
  signedUp: number;
  signedUpNotInPool: number;
  inPoolWithoutSignUp: number;
  hiddenIneligible: number;
};

export function isEligibleForCompetition(user: User, competition: Competition): boolean {
  if (user.type !== UserType.FREESTYLER) {
    return false;
  }
  if (competition.gender !== CompetitionGender.MIXED && user.gender !== competition.gender.toString()) {
    return false;
  }
  if (competition.maxAge !== MaxAge.NONE && user.age && user.age > competition.maxAge) {
    return false;
  }
  return true;
}

/** Joins event registrations with the current pool. Denied registrations only appear when they are already in the pool. */
export function buildPoolRows(competition: Competition, registrations: EventRegistration[], pool: PoolMember[]): PoolRow[] {
  const compId = competition.id ?? '';
  const poolUsernames = new Set(pool.map(member => member.username));
  const rows: PoolRow[] = [];
  const seen = new Set<string>();

  for (const registration of registrations) {
    const username = registration.user.username;
    const inPool = poolUsernames.has(username);
    if (registration.status === EventRegistrationStatus.DENIED && !inPool) {
      continue;
    }
    seen.add(username);
    rows.push({
      user: registration.user,
      registration,
      signedUp: registration.competitionSignUps?.includes(compId) ?? false,
      inPool,
      eligible: isEligibleForCompetition(registration.user, competition),
    });
  }

  for (const member of pool) {
    if (seen.has(member.username)) continue;
    rows.push({
      user: { username: member.username, type: UserType.FREESTYLER, imageUrl: member.imageUrl, firstName: member.firstName, lastName: member.lastName },
      registration: null,
      signedUp: false,
      inPool: true,
      eligible: true,
    });
  }

  return rows;
}

export function countPool(rows: PoolRow[]): PoolCounts {
  const counts: PoolCounts = { inPool: 0, signedUp: 0, signedUpNotInPool: 0, inPoolWithoutSignUp: 0, hiddenIneligible: 0 };

  for (const row of rows) {
    if (!row.eligible && !row.inPool) {
      counts.hiddenIneligible++;
      continue;
    }
    if (row.inPool) counts.inPool++;
    if (row.signedUp) counts.signedUp++;
    if (row.signedUp && !row.inPool) counts.signedUpNotInPool++;
    if (row.inPool && !row.signedUp) counts.inPoolWithoutSignUp++;
  }

  return counts;
}

export function formatUserFullName(user: Pick<User, 'username' | 'firstName' | 'lastName'>): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.username;
}

export function userMatchesNameQuery(user: User, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').toLowerCase();
  return full.includes(needle) || user.username.toLowerCase().includes(needle) || (user.nickName?.toLowerCase().includes(needle) ?? false);
}

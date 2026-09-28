import { PpBadgeVariant } from '../../design-system/components/pp-badge/pp-badge';
import { Session } from '../../core/models/openf1.models';

export function sessionBadgeVariant(sessionType: string): PpBadgeVariant {
  const map: Record<string, PpBadgeVariant> = {
    Race: 'race',
    Qualifying: 'qualifying',
    Sprint: 'sprint',
    'Sprint Qualifying': 'sprint',
    Practice: 'practice',
  };
  return map[sessionType] ?? 'default';
}

export function isSessionCompleted(session: Session, now = new Date()): boolean {
  const end = session.date_end ? new Date(session.date_end) : new Date(session.date_start);
  return end <= now;
}

export function isMainRace(session: Session): boolean {
  return session.session_name === 'Race';
}

export function filterActiveSessions(sessions: Session[]): Session[] {
  return sessions.filter((s) => !s.is_cancelled);
}

export function formatRaceTitle(session: Session): string {
  return `${session.location} Grand Prix`;
}

export function formatSessionVenue(session: Session): string {
  return `${session.circuit_short_name} · ${session.country_name}`;
}

export function getReferenceRaceSession(sessions: Session[]): Session | null {
  const active = filterActiveSessions(sessions);
  const mainRaces = active.filter(isMainRace);

  return (
    [...mainRaces]
      .filter((session) => isSessionCompleted(session))
      .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())[0] ??
    [...mainRaces].sort(
      (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    )[0] ??
    null
  );
}

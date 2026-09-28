import { Driver, SessionResult } from '../../core/models/openf1.models';
import { PodiumEntry } from '../models/podium.model';

export function getGapToLeader(result: SessionResult): number | null {
  if (result.position == null || result.position <= 1) return null;
  const gap = result.gap_to_leader;
  return gap != null && gap > 0 ? gap : null;
}

export function getWinner(results: SessionResult[]): SessionResult | undefined {
  return results.find((r) => r.position === 1);
}

export function sortSessionResults(results: SessionResult[]): SessionResult[] {
  return [...results].sort((a, b) => {
    const posA = a.position ?? Number.MAX_SAFE_INTEGER;
    const posB = b.position ?? Number.MAX_SAFE_INTEGER;
    if (posA !== posB) return posA - posB;
    return a.driver_number - b.driver_number;
  });
}

export function formatClassificationPosition(result: SessionResult): string {
  if (result.dsq) return 'DSQ';
  if (result.dns) return 'DNS';
  if (result.dnf) return 'DNF';
  if (result.position != null) return `P${result.position}`;
  return '—';
}

export function isPodiumPosition(position: number | null): position is 1 | 2 | 3 {
  return position != null && position >= 1 && position <= 3;
}

export function buildPodium(results: SessionResult[], drivers: Driver[]): PodiumEntry[] {
  const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));

  return [1, 2, 3]
    .map((position) => {
      const result = results.find((r) => r.position === position);
      if (!result) return null;

      const driver = driverMap.get(result.driver_number);
      return {
        position: position as 1 | 2 | 3,
        acronym: driver?.name_acronym ?? `#${result.driver_number}`,
        fullName: driver?.full_name ?? `Driver #${result.driver_number}`,
        teamColour: driver?.team_colour ?? '6b6b7b',
      };
    })
    .filter((entry): entry is PodiumEntry => entry !== null);
}

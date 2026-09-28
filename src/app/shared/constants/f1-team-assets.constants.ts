/**
 * Local copies of official Formula 1 team renders (2026 season).
 * Source: https://www.formula1.com/en/teams — downloaded for in-app display.
 */
export const F1_TEAM_ASSET_SLUGS: Record<string, string> = {
  McLaren: 'mclaren',
  Ferrari: 'ferrari',
  Mercedes: 'mercedes',
  'Red Bull Racing': 'red-bull',
  Williams: 'williams',
  'Aston Martin': 'aston-martin',
  Alpine: 'alpine',
  RB: 'racing-bulls',
  'Racing Bulls': 'racing-bulls',
  'Haas F1 Team': 'haas',
  Haas: 'haas',
  'Kick Sauber': 'kick-sauber',
  Sauber: 'kick-sauber',
  'Audi Revolut F1 Team': 'audi',
  Audi: 'audi',
  Cadillac: 'cadillac',
};

export function getTeamAssetSlug(teamName: string): string | null {
  return F1_TEAM_ASSET_SLUGS[teamName] ?? null;
}

export function getTeamCarAssetPath(slug: string): string {
  return `/teams/${slug}/car.webp`;
}

export function getTeamLogoAssetPath(slug: string): string {
  return `/teams/${slug}/logo.webp`;
}

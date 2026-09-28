export interface PodiumEntry {
  position: 1 | 2 | 3;
  acronym: string;
  fullName: string;
  teamColour: string;
}

export const PODIUM_TROPHIES: Record<1 | 2 | 3, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

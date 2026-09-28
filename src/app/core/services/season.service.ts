import { Injectable, signal } from '@angular/core';

/** OpenF1 historical data starts in 2023. */
export const AVAILABLE_SEASONS = [2026, 2025, 2024, 2023] as const;

export type SeasonYear = (typeof AVAILABLE_SEASONS)[number];

function defaultSeasonYear(): SeasonYear {
  const current = new Date().getFullYear();
  return AVAILABLE_SEASONS.includes(current as SeasonYear)
    ? (current as SeasonYear)
    : AVAILABLE_SEASONS[0];
}

@Injectable({ providedIn: 'root' })
export class SeasonService {
  readonly availableSeasons = AVAILABLE_SEASONS;
  readonly selectedYear = signal<SeasonYear>(defaultSeasonYear());

  setYear(year: number): void {
    if (AVAILABLE_SEASONS.includes(year as SeasonYear)) {
      this.selectedYear.set(year as SeasonYear);
    }
  }

  isPastSeason(year: number = this.selectedYear()): boolean {
    return year < new Date().getFullYear();
  }
}

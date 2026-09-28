import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { forkJoin, of, switchMap } from 'rxjs';

import { Driver, Session, SessionResult } from '../../core/models/openf1.models';
import { OpenF1ApiService } from '../../core/services/openf1-api.service';
import { SeasonService } from '../../core/services/season.service';
import {
  PpButton,
  PpCard,
  PpDriverAvatar,
  PpEmptyState,
  PpPageHeader,
  PpSpinner,
} from '../../design-system';
import {
  formatClassificationPosition,
  getGapToLeader,
  isPodiumPosition,
} from '../../shared/utils/result.util';
import {
  formatRaceTitle,
  getReferenceRaceSession,
  isSessionCompleted,
} from '../../shared/utils/session.util';
import { formatTeamColor } from '../../shared/utils/team-color.util';
import { formatGap, formatSessionDate } from '../../shared/utils/time.util';

interface TeamGroup {
  teamName: string;
  teamColour: string;
  drivers: Driver[];
}

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [
    PpButton,
    PpCard,
    PpDriverAvatar,
    PpEmptyState,
    PpPageHeader,
    PpSpinner,
  ],
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Drivers {
  private readonly api = inject(OpenF1ApiService);
  readonly seasonService = inject(SeasonService);

  readonly loading = signal(true);
  readonly teamGroups = signal<TeamGroup[]>([]);
  readonly sourceSession = signal<Session | null>(null);
  readonly driverResults = signal<Map<number, SessionResult>>(new Map());
  readonly selectedDriverNumber = signal<number | null>(null);

  readonly selectedDriver = computed(() => {
    const driverNumber = this.selectedDriverNumber();
    if (driverNumber == null) return null;

    for (const team of this.teamGroups()) {
      const driver = team.drivers.find((d) => d.driver_number === driverNumber);
      if (driver) return driver;
    }

    return null;
  });

  readonly selectedResult = computed(() => {
    const driverNumber = this.selectedDriverNumber();
    if (driverNumber == null) return null;
    return this.driverResults().get(driverNumber) ?? null;
  });

  readonly hasRaceResults = computed(() => this.driverResults().size > 0);

  readonly formatTeamColor = formatTeamColor;
  readonly formatRaceTitle = formatRaceTitle;
  readonly formatSessionDate = formatSessionDate;
  readonly formatClassificationPosition = formatClassificationPosition;
  readonly formatGap = formatGap;
  readonly getGapToLeader = getGapToLeader;
  readonly isPodiumPosition = isPodiumPosition;

  constructor() {
    effect(() => {
      this.seasonService.selectedYear();
      this.loadDrivers();
    });
  }

  selectDriver(driverNumber: number): void {
    this.selectedDriverNumber.update((current) =>
      current === driverNumber ? null : driverNumber
    );
  }

  clearSelection(): void {
    this.selectedDriverNumber.set(null);
  }

  resultStatus(result: SessionResult): string {
    if (result.dsq) return 'Disqualified';
    if (result.dns) return 'Did not start';
    if (result.dnf) return 'Did not finish';
    return '';
  }

  private loadDrivers(): void {
    this.loading.set(true);
    this.selectedDriverNumber.set(null);
    this.driverResults.set(new Map());

    this.api
      .getSessions({ session_type: 'Race' })
      .pipe(
        switchMap((sessions) => {
          const referenceRace = getReferenceRaceSession(sessions);

          if (!referenceRace) {
            return of(null);
          }

          this.sourceSession.set(referenceRace);

          const resultsRequest = isSessionCompleted(referenceRace)
            ? this.api.getSessionResults(referenceRace.session_key)
            : of([] as SessionResult[]);

          return forkJoin({
            drivers: this.api.getDrivers({ session_key: referenceRace.session_key }),
            results: resultsRequest,
          });
        })
      )
      .subscribe({
        next: (data) => {
          if (!data) {
            this.teamGroups.set([]);
            this.loading.set(false);
            return;
          }

          this.driverResults.set(
            new Map(data.results.map((result) => [result.driver_number, result]))
          );
          this.teamGroups.set(this.groupByTeam(data.drivers));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  private groupByTeam(drivers: Driver[]): TeamGroup[] {
    const teams = new Map<string, TeamGroup>();

    for (const driver of drivers) {
      if (!teams.has(driver.team_name)) {
        teams.set(driver.team_name, {
          teamName: driver.team_name,
          teamColour: driver.team_colour,
          drivers: [],
        });
      }
      teams.get(driver.team_name)!.drivers.push(driver);
    }

    return [...teams.values()]
      .map((t) => ({
        ...t,
        drivers: t.drivers.sort((a, b) => a.driver_number - b.driver_number),
      }))
      .sort((a, b) => a.teamName.localeCompare(b.teamName));
  }
}

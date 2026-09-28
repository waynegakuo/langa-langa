import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';

import { Driver, Lap } from '../../../core/models/openf1.models';
import { OpenF1ApiService } from '../../../core/services/openf1-api.service';
import { PpCard, PpSpinner } from '../../../design-system';
import { LapTimePipe } from '../../pipes/lap-time-pipe';
import { formatTeamColor } from '../../utils/team-color.util';

@Component({
  selector: 'app-lazy-fastest-laps',
  standalone: true,
  imports: [LapTimePipe, PpCard, PpSpinner],
  template: `
    <section class="lazy-fastest-laps">
      <h2 class="lazy-fastest-laps__heading">Fastest Laps</h2>

      @if (loading()) {
        <pp-spinner size="sm" />
      } @else if (entries().length) {
        <div class="lazy-fastest-laps__grid">
          @for (entry of entries(); track entry.driver.driver_number; let i = $index) {
            <pp-card [teamColor]="formatTeamColor(entry.driver.team_colour)">
              <div class="lazy-fastest-laps__row">
                <span class="lazy-fastest-laps__rank">#{{ i + 1 }}</span>
                <span class="lazy-fastest-laps__driver">{{ entry.driver.name_acronym }}</span>
                <span class="lazy-fastest-laps__time">{{ entry.lap.lap_duration | lapTime }}</span>
              </div>
            </pp-card>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './lazy-fastest-laps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyFastestLaps implements OnInit {
  private readonly api = inject(OpenF1ApiService);

  readonly sessionKey = input.required<number>();

  readonly loading = signal(true);
  readonly entries = signal<{ driver: Driver; lap: Lap }[]>([]);
  readonly formatTeamColor = formatTeamColor;

  ngOnInit(): void {
    this.api.getDrivers({ session_key: this.sessionKey() }).subscribe({
      next: (drivers) => {
        const driverMap = new Map(drivers.map((d) => [d.driver_number, d]));
        this.api.getLaps(this.sessionKey()).subscribe({
          next: (laps) => {
            this.entries.set(this.computeFastestLaps(laps, driverMap).slice(0, 5));
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  private computeFastestLaps(
    laps: Lap[],
    driverMap: Map<number, Driver>
  ): { driver: Driver; lap: Lap }[] {
    const bestByDriver = new Map<number, Lap>();

    for (const lap of laps) {
      if (lap.lap_duration == null || lap.is_pit_out_lap) continue;
      const existing = bestByDriver.get(lap.driver_number);
      if (!existing || (existing.lap_duration ?? Infinity) > lap.lap_duration) {
        bestByDriver.set(lap.driver_number, lap);
      }
    }

    return [...bestByDriver.entries()]
      .map(([num, lap]) => ({ driver: driverMap.get(num)!, lap }))
      .filter((entry) => entry.driver)
      .sort((a, b) => (a.lap.lap_duration ?? Infinity) - (b.lap.lap_duration ?? Infinity));
  }
}

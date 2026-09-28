import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Session } from '../../core/models/openf1.models';
import { OpenF1ApiService } from '../../core/services/openf1-api.service';
import { SeasonService } from '../../core/services/season.service';
import { TeamCarCarousel } from '../../shared/components/team-car-carousel/team-car-carousel';
import { TeamCarouselEntry } from '../../shared/models/team-carousel.model';
import {
  filterActiveSessions,
  formatRaceTitle,
  formatSessionVenue,
  getReferenceRaceSession,
  isMainRace,
  isSessionCompleted,
  sessionBadgeVariant,
} from '../../shared/utils/session.util';
import { buildTeamCarouselEntries } from '../../shared/utils/team-carousel.util';
import {
  LangaBadge,
  LangaButton,
  LangaCard,
  LangaPageLoader,
  LangaStatBlock,
} from '../../design-system';
import { formatSessionDate, formatSessionTime } from '../../shared/utils/time.util';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    LangaBadge,
    LangaButton,
    LangaCard,
    LangaPageLoader,
    LangaStatBlock,
    TeamCarCarousel,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly api = inject(OpenF1ApiService);
  readonly seasonService = inject(SeasonService);

  readonly loading = signal(true);
  readonly nextRace = signal<Session | null>(null);
  readonly recentRaces = signal<Session[]>([]);
  readonly totalRaces = signal(0);
  readonly totalMeetings = signal(0);
  readonly seasonComplete = signal(false);
  readonly carouselTeams = signal<TeamCarouselEntry[]>([]);
  readonly carouselLoading = signal(true);

  readonly sessionBadgeVariant = sessionBadgeVariant;
  readonly formatSessionDate = formatSessionDate;
  readonly formatSessionTime = formatSessionTime;
  readonly formatRaceTitle = formatRaceTitle;
  readonly formatSessionVenue = formatSessionVenue;

  constructor() {
    effect(() => {
      this.seasonService.selectedYear();
      this.loadSeasonData();
    });
  }

  private loadSeasonData(): void {
    this.loading.set(true);
    this.carouselLoading.set(true);
    this.carouselTeams.set([]);

    // Sessions first; drivers for hero carousel use the same reference race as the drivers page.
    this.api.getSessions({ session_type: 'Race' }).subscribe({
      next: (sessions) => {
        const active = filterActiveSessions(sessions);
        const sorted = [...active].sort(
          (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
        );

        const upcoming = sorted.filter((s) => !isSessionCompleted(s));
        const completed = sorted.filter((s) => isSessionCompleted(s));

        this.nextRace.set(upcoming[0] ?? null);
        this.seasonComplete.set(upcoming.length === 0 && completed.length > 0);
        this.totalRaces.set(active.filter(isMainRace).length);
        this.totalMeetings.set(new Set(active.map((s) => s.meeting_key)).size);
        this.recentRaces.set(completed.filter(isMainRace).slice(-3).reverse());
        this.loading.set(false);

        const referenceRace = getReferenceRaceSession(sessions);
        if (!referenceRace) {
          this.carouselLoading.set(false);
          return;
        }

        this.api.getDrivers({ session_key: referenceRace.session_key }).subscribe({
          next: (drivers) => {
            this.carouselTeams.set(buildTeamCarouselEntries(drivers));
            this.carouselLoading.set(false);
          },
          error: () => this.carouselLoading.set(false),
        });
      },
      error: () => {
        this.loading.set(false);
        this.carouselLoading.set(false);
      },
    });
  }
}

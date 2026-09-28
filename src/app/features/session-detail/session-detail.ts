import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';

import { PODIUM_COLORS } from '../../core/constants/f1.constants';
import { Driver, Session, SessionResult } from '../../core/models/openf1.models';
import { OpenF1ApiService } from '../../core/services/openf1-api.service';
import { LazyFastestLaps } from '../../shared/components/lazy-fastest-laps/lazy-fastest-laps';
import {
  PpBadge,
  PpButton,
  PpCard,
  PpCircuitMap,
  PpDriverAvatar,
  PpEmptyState,
  PpPodium,
  PpPageLoader,
} from '../../design-system';
import { PodiumEntry } from '../../shared/models/podium.model';
import {
  buildPodium,
  formatClassificationPosition,
  getGapToLeader,
  isPodiumPosition,
  sortSessionResults,
} from '../../shared/utils/result.util';
import {
  formatRaceTitle,
  formatSessionVenue,
  isMainRace,
  isSessionCompleted,
  sessionBadgeVariant,
} from '../../shared/utils/session.util';
import { formatTeamColor } from '../../shared/utils/team-color.util';
import { formatGap, formatSessionDate, formatSessionTime } from '../../shared/utils/time.util';

interface ResultRow {
  result: SessionResult;
  driver: Driver | undefined;
}

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [
    RouterLink,
    LazyFastestLaps,
    PpCircuitMap,
    PpBadge,
    PpButton,
    PpCard,
    PpDriverAvatar,
    PpEmptyState,
    PpPodium,
    PpPageLoader,
  ],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetail implements OnInit {
  private readonly api = inject(OpenF1ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly session = signal<Session | null>(null);
  readonly results = signal<ResultRow[]>([]);
  readonly podium = signal<PodiumEntry[]>([]);
  readonly circuitImage = signal<string | null>(null);

  readonly sessionBadgeVariant = sessionBadgeVariant;
  readonly formatSessionDate = formatSessionDate;
  readonly formatSessionTime = formatSessionTime;
  readonly formatRaceTitle = formatRaceTitle;
  readonly formatSessionVenue = formatSessionVenue;
  readonly isMainRace = isMainRace;
  readonly isSessionCompleted = isSessionCompleted;
  readonly formatTeamColor = formatTeamColor;
  readonly formatGap = formatGap;
  readonly getGapToLeader = getGapToLeader;
  readonly formatClassificationPosition = formatClassificationPosition;
  readonly isPodiumPosition = isPodiumPosition;
  readonly podiumColors = PODIUM_COLORS;

  ngOnInit(): void {
    const sessionKey = Number(this.route.snapshot.paramMap.get('sessionKey'));

    this.api
      .getSession(sessionKey)
      .pipe(
        switchMap((session) => {
          this.session.set(session);
          return forkJoin({
            drivers: this.api.getDrivers({ session_key: sessionKey }),
            results: this.api.getSessionResults(sessionKey),
            meeting: this.api.getMeeting(session!.meeting_key),
          });
        })
      )
      .subscribe({
        next: ({ drivers, results, meeting }) => {
          const sortedResults = sortSessionResults(results);

          this.results.set(
            sortedResults.map((result) => ({
              result,
              driver: drivers.find((d) => d.driver_number === result.driver_number),
            }))
          );
          this.podium.set(buildPodium(results, drivers));
          this.circuitImage.set(meeting?.circuit_image ?? null);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  resultStatus(row: ResultRow): string {
    const { dnf, dns, dsq } = row.result;
    if (dsq) return 'DSQ';
    if (dns) return 'DNS';
    if (dnf) return 'DNF';
    return '';
  }
}

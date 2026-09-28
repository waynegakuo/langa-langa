import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Session } from '../../core/models/openf1.models';
import { OpenF1ApiService } from '../../core/services/openf1-api.service';
import { SeasonService } from '../../core/services/season.service';
import {
  PpBadge,
  PpCard,
  PpEmptyState,
  PpPageHeader,
  PpPageLoader,
} from '../../design-system';
import {
  filterActiveSessions,
  formatRaceTitle,
  formatSessionVenue,
  isMainRace,
  isSessionCompleted,
  sessionBadgeVariant,
} from '../../shared/utils/session.util';
import { formatSessionDate, formatSessionTime } from '../../shared/utils/time.util';

export interface MeetingGroup {
  meetingKey: number;
  location: string;
  countryName: string;
  circuitName: string;
  sessions: Session[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    RouterLink,
    PpBadge,
    PpCard,
    PpEmptyState,
    PpPageHeader,
    PpPageLoader,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {
  private readonly api = inject(OpenF1ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private roundObserver: IntersectionObserver | null = null;

  readonly seasonService = inject(SeasonService);

  readonly loading = signal(true);
  readonly meetingGroups = signal<MeetingGroup[]>([]);
  readonly activeRound = signal<number | null>(null);

  readonly sessionBadgeVariant = sessionBadgeVariant;
  readonly formatSessionDate = formatSessionDate;
  readonly formatSessionTime = formatSessionTime;
  readonly formatRaceTitle = formatRaceTitle;
  readonly formatSessionVenue = formatSessionVenue;
  readonly isSessionCompleted = isSessionCompleted;
  readonly isMainRace = isMainRace;

  constructor() {
    effect(() => {
      this.seasonService.selectedYear();
      this.loadCalendar();
    });

    effect(() => {
      const groups = this.meetingGroups();
      if (this.loading() || !groups.length) {
        return;
      }

      afterNextRender(() => this.initRoundObserver(), { injector: this.injector });
    });

    this.destroyRef.onDestroy(() => this.roundObserver?.disconnect());
  }

  roundId(meetingKey: number): string {
    return `calendar-round-${meetingKey}`;
  }

  isRoundCompleted(group: MeetingGroup): boolean {
    return group.sessions.every((session) => isSessionCompleted(session));
  }

  scrollToRound(meetingKey: number): void {
    document.getElementById(this.roundId(meetingKey))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    this.activeRound.set(meetingKey);
  }

  private loadCalendar(): void {
    this.loading.set(true);
    this.activeRound.set(null);
    this.roundObserver?.disconnect();
    this.roundObserver = null;

    this.api.getSessions().subscribe({
      next: (sessions) => {
        this.meetingGroups.set(this.buildMeetingGroups(filterActiveSessions(sessions)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private initRoundObserver(): void {
    this.roundObserver?.disconnect();

    const sections = document.querySelectorAll<HTMLElement>('.calendar__weekend');
    if (!sections.length) {
      return;
    }

    this.roundObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target as HTMLElement | undefined;
        if (!top?.id.startsWith('calendar-round-')) {
          return;
        }

        const meetingKey = Number(top.id.replace('calendar-round-', ''));
        if (!Number.isNaN(meetingKey)) {
          this.activeRound.set(meetingKey);
        }
      },
      {
        rootMargin: '-12% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => this.roundObserver!.observe(section));

    if (this.activeRound() === null) {
      const firstKey = this.meetingGroups()[0]?.meetingKey ?? null;
      this.activeRound.set(firstKey);
    }
  }

  private buildMeetingGroups(sessions: Session[]): MeetingGroup[] {
    const groups = new Map<number, MeetingGroup>();

    for (const session of sessions) {
      if (!groups.has(session.meeting_key)) {
        groups.set(session.meeting_key, {
          meetingKey: session.meeting_key,
          location: session.location,
          countryName: session.country_name,
          circuitName: session.circuit_short_name,
          sessions: [],
        });
      }
      groups.get(session.meeting_key)!.sessions.push(session);
    }

    return [...groups.values()]
      .map((g) => ({
        ...g,
        sessions: g.sessions.sort(
          (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
        ),
      }))
      .sort(
        (a, b) =>
          new Date(a.sessions[0].date_start).getTime() -
          new Date(b.sessions[0].date_start).getTime()
      );
  }
}

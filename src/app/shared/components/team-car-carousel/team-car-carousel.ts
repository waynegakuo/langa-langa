import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { TeamCarouselEntry } from '../../models/team-carousel.model';
import { formatTeamColor } from '../../utils/team-color.util';

const AUTO_ADVANCE_MS = 4500;
const SWIPE_THRESHOLD_PX = 48;
const SWIPE_MAX_VERTICAL_DRIFT_PX = 80;

@Component({
  selector: 'app-team-car-carousel',
  standalone: true,
  templateUrl: './team-car-carousel.html',
  styleUrl: './team-car-carousel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCarCarousel {
  private readonly destroyRef = inject(DestroyRef);
  private autoAdvanceTimer: ReturnType<typeof setInterval> | null = null;
  private paused = false;
  private swipeStartX: number | null = null;
  private swipeStartY: number | null = null;
  private swipePausedForGesture = false;

  readonly teams = input<TeamCarouselEntry[]>([]);
  readonly loading = input(false);

  readonly currentIndex = signal(0);
  readonly transitionDirection = signal<'next' | 'prev'>('next');

  readonly activeTeam = computed(() => {
    const teams = this.teams();
    if (!teams.length) return null;
    return teams[this.currentIndex()] ?? teams[0];
  });

  readonly formatTeamColor = formatTeamColor;

  constructor() {
    effect(() => {
      const count = this.teams().length;
      if (this.currentIndex() >= count && count > 0) {
        this.currentIndex.set(0);
      }
      this.restartAutoAdvance();
    });

    this.destroyRef.onDestroy(() => this.stopAutoAdvance());
  }

  goTo(index: number): void {
    const count = this.teams().length;
    if (!count) return;

    const nextIndex = (index + count) % count;
    const currentIndex = this.currentIndex();
    if (nextIndex === currentIndex) return;

    const forward = (currentIndex + 1) % count;
    const backward = (currentIndex - 1 + count) % count;
    this.transitionDirection.set(
      nextIndex === backward ? 'prev' : nextIndex === forward ? 'next' : 'next'
    );
    this.currentIndex.set(nextIndex);
  }

  next(): void {
    this.goTo(this.currentIndex() + 1);
  }

  prev(): void {
    this.goTo(this.currentIndex() - 1);
  }

  pause(): void {
    this.paused = true;
    this.stopAutoAdvance();
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.restartAutoAdvance();
  }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  onCarSwipeStart(event: PointerEvent): void {
    if (this.teams().length <= 1) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    this.swipeStartX = event.clientX;
    this.swipeStartY = event.clientY;

    if (!this.paused) {
      this.pause();
      this.swipePausedForGesture = true;
    }
  }

  onCarSwipeEnd(event: PointerEvent): void {
    if (this.swipeStartX === null || this.swipeStartY === null) {
      return;
    }

    const deltaX = event.clientX - this.swipeStartX;
    const deltaY = event.clientY - this.swipeStartY;

    this.swipeStartX = null;
    this.swipeStartY = null;

    if (this.swipePausedForGesture) {
      this.swipePausedForGesture = false;
      this.resume();
    }

    if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL_DRIFT_PX) {
      return;
    }

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      return;
    }

    if (deltaX < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  onCarSwipeCancel(): void {
    this.swipeStartX = null;
    this.swipeStartY = null;

    if (this.swipePausedForGesture) {
      this.swipePausedForGesture = false;
      this.resume();
    }
  }

  private restartAutoAdvance(): void {
    this.stopAutoAdvance();
    if (this.paused || this.teams().length <= 1) return;

    this.autoAdvanceTimer = setInterval(() => {
      this.next();
    }, AUTO_ADVANCE_MS);
  }

  private stopAutoAdvance(): void {
    if (this.autoAdvanceTimer) {
      clearInterval(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
  }
}

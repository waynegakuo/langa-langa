import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { SeasonService, SeasonYear } from '../../../core/services/season.service';

@Component({
  selector: 'langa-season-selector',
  standalone: true,
  templateUrl: './langa-season-selector.html',
  styleUrl: './langa-season-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaSeasonSelector {
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');

  readonly season = inject(SeasonService);
  readonly open = signal(false);

  toggle(): void {
    this.open.update((isOpen) => !isOpen);
  }

  close(): void {
    this.open.set(false);
  }

  selectYear(year: SeasonYear): void {
    this.season.setYear(year);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const el = this.root()?.nativeElement;
    if (!el || !this.open()) {
      return;
    }

    if (!el.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}

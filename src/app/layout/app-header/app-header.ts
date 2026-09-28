import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  viewChild,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LangaSeasonSelector } from '../../design-system';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LangaSeasonSelector],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private readonly menuRoot = viewChild<ElementRef<HTMLElement>>('menuRoot');

  readonly menuOpen = signal(false);

  readonly navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/calendar', label: 'Calendar', exact: false },
    { path: '/drivers', label: 'Drivers', exact: false },
  ];

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const root = this.menuRoot()?.nativeElement;
    if (!root || !this.menuOpen()) {
      return;
    }

    if (!root.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 767 && this.menuOpen()) {
      this.closeMenu();
    }
  }
}

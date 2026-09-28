import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-page-header',
  standalone: true,
  template: `
    <header class="pp-page-header">
      @if (eyebrow()) {
        <span class="pp-page-header__eyebrow">{{ eyebrow() }}</span>
      }
      <h1 class="pp-page-header__title">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="pp-page-header__subtitle">{{ subtitle() }}</p>
      }
    </header>
  `,
  styleUrl: './pp-page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpPageHeader {
  readonly eyebrow = input<string | undefined>(undefined);
  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-page-header',
  standalone: true,
  template: `
    <header class="langa-page-header">
      @if (eyebrow()) {
        <span class="langa-page-header__eyebrow">{{ eyebrow() }}</span>
      }
      <h1 class="langa-page-header__title">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="langa-page-header__subtitle">{{ subtitle() }}</p>
      }
    </header>
  `,
  styleUrl: './langa-page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaPageHeader {
  readonly eyebrow = input<string | undefined>(undefined);
  readonly title = input('');
  readonly subtitle = input<string | undefined>(undefined);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-stat-block',
  standalone: true,
  template: `
    <div class="langa-stat-block">
      <span class="langa-stat-block__label">{{ label() }}</span>
      <span class="langa-stat-block__value">{{ value() }}</span>
      @if (subtext()) {
        <span class="langa-stat-block__subtext">{{ subtext() }}</span>
      }
    </div>
  `,
  styleUrl: './langa-stat-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaStatBlock {
  readonly label = input('');
  readonly value = input('');
  readonly subtext = input<string | undefined>(undefined);
}

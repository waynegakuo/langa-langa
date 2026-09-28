import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-stat-block',
  standalone: true,
  template: `
    <div class="pp-stat-block">
      <span class="pp-stat-block__label">{{ label() }}</span>
      <span class="pp-stat-block__value">{{ value() }}</span>
      @if (subtext()) {
        <span class="pp-stat-block__subtext">{{ subtext() }}</span>
      }
    </div>
  `,
  styleUrl: './pp-stat-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpStatBlock {
  readonly label = input('');
  readonly value = input('');
  readonly subtext = input<string | undefined>(undefined);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PpBadgeVariant = 'default' | 'race' | 'qualifying' | 'sprint' | 'practice' | 'podium';

@Component({
  selector: 'pp-badge',
  standalone: true,
  template: `
    <span
      class="pp-badge"
      [class]="'pp-badge pp-badge--' + variant()"
      [style.background-color]="customColor() || null"
    >
      <ng-content />
    </span>
  `,
  styleUrl: './pp-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpBadge {
  readonly variant = input<PpBadgeVariant>('default');
  readonly customColor = input<string | undefined>(undefined);
}

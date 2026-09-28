import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LangaBadgeVariant = 'default' | 'race' | 'qualifying' | 'sprint' | 'practice' | 'podium';

@Component({
  selector: 'langa-badge',
  standalone: true,
  template: `
    <span
      class="langa-badge"
      [class]="'langa-badge langa-badge--' + variant()"
      [style.background-color]="customColor() || null"
    >
      <ng-content />
    </span>
  `,
  styleUrl: './langa-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaBadge {
  readonly variant = input<LangaBadgeVariant>('default');
  readonly customColor = input<string | undefined>(undefined);
}

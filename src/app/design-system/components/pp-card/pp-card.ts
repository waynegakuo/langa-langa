import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-card',
  standalone: true,
  template: `
    <div
      class="pp-card"
      [class.pp-card--interactive]="interactive()"
      [class.pp-card--selected]="selected()"
      [class.pp-card--accent]="!!teamColor()"
      [style.--team-color]="teamColor() ? '#' + teamColor() : null"
    >
      @if (teamColor()) {
        <div class="pp-card__stripe"></div>
      }
      <div class="pp-card__body">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './pp-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpCard {
  readonly interactive = input(false);
  readonly selected = input(false);
  readonly teamColor = input<string | undefined>(undefined);
}

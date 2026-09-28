import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-card',
  standalone: true,
  template: `
    <div
      class="langa-card"
      [class.langa-card--interactive]="interactive()"
      [class.langa-card--selected]="selected()"
      [class.langa-card--accent]="!!teamColor()"
      [style.--team-color]="teamColor() ? '#' + teamColor() : null"
    >
      @if (teamColor()) {
        <div class="langa-card__stripe"></div>
      }
      <div class="langa-card__body">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './langa-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaCard {
  readonly interactive = input(false);
  readonly selected = input(false);
  readonly teamColor = input<string | undefined>(undefined);
}

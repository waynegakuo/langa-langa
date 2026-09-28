import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PodiumEntry, PODIUM_TROPHIES } from '../../../shared/models/podium.model';
import { formatTeamColor } from '../../../shared/utils/team-color.util';

@Component({
  selector: 'langa-podium',
  standalone: true,
  template: `
    @if (entries().length) {
      <div class="langa-podium" [class.langa-podium--compact]="compact()">
        @for (entry of entries(); track entry.position) {
          <div
            class="langa-podium__slot"
            [class.langa-podium__slot--p1]="entry.position === 1"
            [title]="entry.fullName"
          >
            <span class="langa-podium__trophy">{{ trophies[entry.position] }}</span>
            <span
              class="langa-podium__dot"
              [style.background-color]="'#' + formatTeamColor(entry.teamColour)"
            ></span>
            <span class="langa-podium__driver">{{ entry.acronym }}</span>
          </div>
        }
      </div>
    }
  `,
  styleUrl: './langa-podium.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaPodium {
  readonly entries = input<PodiumEntry[]>([]);
  readonly compact = input(false);

  readonly trophies = PODIUM_TROPHIES;
  readonly formatTeamColor = formatTeamColor;
}

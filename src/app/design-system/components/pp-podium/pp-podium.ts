import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PodiumEntry, PODIUM_TROPHIES } from '../../../shared/models/podium.model';
import { formatTeamColor } from '../../../shared/utils/team-color.util';

@Component({
  selector: 'pp-podium',
  standalone: true,
  template: `
    @if (entries().length) {
      <div class="pp-podium" [class.pp-podium--compact]="compact()">
        @for (entry of entries(); track entry.position) {
          <div
            class="pp-podium__slot"
            [class.pp-podium__slot--p1]="entry.position === 1"
            [title]="entry.fullName"
          >
            <span class="pp-podium__trophy">{{ trophies[entry.position] }}</span>
            <span
              class="pp-podium__dot"
              [style.background-color]="'#' + formatTeamColor(entry.teamColour)"
            ></span>
            <span class="pp-podium__driver">{{ entry.acronym }}</span>
          </div>
        }
      </div>
    }
  `,
  styleUrl: './pp-podium.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpPodium {
  readonly entries = input<PodiumEntry[]>([]);
  readonly compact = input(false);

  readonly trophies = PODIUM_TROPHIES;
  readonly formatTeamColor = formatTeamColor;
}

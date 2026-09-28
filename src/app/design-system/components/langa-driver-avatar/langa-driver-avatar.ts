import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-driver-avatar',
  standalone: true,
  template: `
    <div
      class="langa-driver-avatar"
      [class.langa-driver-avatar--sm]="size() === 'sm'"
      [class.langa-driver-avatar--lg]="size() === 'lg'"
      [class.langa-driver-avatar--xl]="size() === 'xl'"
      [style.--team-color]="'#' + teamColor()"
    >
      @if (headshotUrl()) {
        <img [src]="headshotUrl()" [alt]="name()" loading="lazy" />
      } @else {
        <span class="langa-driver-avatar__initials">{{ acronym() }}</span>
      }
      <span class="langa-driver-avatar__number">{{ driverNumber() }}</span>
    </div>
  `,
  styleUrl: './langa-driver-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaDriverAvatar {
  readonly headshotUrl = input<string | undefined>(undefined);
  readonly name = input('');
  readonly acronym = input('');
  readonly driverNumber = input(0);
  readonly teamColor = input('6b6b7b');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
}

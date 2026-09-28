import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-driver-avatar',
  standalone: true,
  template: `
    <div
      class="pp-driver-avatar"
      [class.pp-driver-avatar--sm]="size() === 'sm'"
      [class.pp-driver-avatar--lg]="size() === 'lg'"
      [class.pp-driver-avatar--xl]="size() === 'xl'"
      [style.--team-color]="'#' + teamColor()"
    >
      @if (headshotUrl()) {
        <img [src]="headshotUrl()" [alt]="name()" loading="lazy" />
      } @else {
        <span class="pp-driver-avatar__initials">{{ acronym() }}</span>
      }
      <span class="pp-driver-avatar__number">{{ driverNumber() }}</span>
    </div>
  `,
  styleUrl: './pp-driver-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpDriverAvatar {
  readonly headshotUrl = input<string | undefined>(undefined);
  readonly name = input('');
  readonly acronym = input('');
  readonly driverNumber = input(0);
  readonly teamColor = input('6b6b7b');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
}

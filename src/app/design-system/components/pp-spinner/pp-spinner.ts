import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-spinner',
  standalone: true,
  template: `
    <div class="pp-spinner" [class.pp-spinner--sm]="size() === 'sm'" role="status" aria-label="Loading">
      <div class="pp-spinner__ring"></div>
    </div>
  `,
  styleUrl: './pp-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpSpinner {
  readonly size = input<'sm' | 'md'>('md');
}

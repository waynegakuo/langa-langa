import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-spinner',
  standalone: true,
  template: `
    <div class="langa-spinner" [class.langa-spinner--sm]="size() === 'sm'" role="status" aria-label="Loading">
      <div class="langa-spinner__ring"></div>
    </div>
  `,
  styleUrl: './langa-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaSpinner {
  readonly size = input<'sm' | 'md'>('md');
}

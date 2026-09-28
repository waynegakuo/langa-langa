import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-empty-state',
  standalone: true,
  template: `
    <div class="langa-empty-state">
      <div class="langa-empty-state__icon">{{ icon() }}</div>
      <h3 class="langa-empty-state__title">{{ title() }}</h3>
      @if (message()) {
        <p class="langa-empty-state__message">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './langa-empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaEmptyState {
  readonly icon = input('🏁');
  readonly title = input('No data available');
  readonly message = input<string | undefined>(undefined);
}

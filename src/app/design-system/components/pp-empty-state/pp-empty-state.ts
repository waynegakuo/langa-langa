import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-empty-state',
  standalone: true,
  template: `
    <div class="pp-empty-state">
      <div class="pp-empty-state__icon">{{ icon() }}</div>
      <h3 class="pp-empty-state__title">{{ title() }}</h3>
      @if (message()) {
        <p class="pp-empty-state__message">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './pp-empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpEmptyState {
  readonly icon = input('🏁');
  readonly title = input('No data available');
  readonly message = input<string | undefined>(undefined);
}

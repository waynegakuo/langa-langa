import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'pp-circuit-map',
  standalone: true,
  template: `
    <figure class="pp-circuit-map">
      <figcaption class="pp-circuit-map__caption">
        <span class="pp-circuit-map__label">Circuit layout</span>
        <span class="pp-circuit-map__name">{{ circuitName() }}</span>
      </figcaption>

      @if (loading()) {
        <div class="pp-circuit-map__placeholder">
          <span class="pp-circuit-map__loading-text">Loading circuit…</span>
        </div>
      } @else if (imageUrl()) {
        <img
          class="pp-circuit-map__image"
          [src]="imageUrl()!"
          [alt]="circuitName() + ' circuit layout'"
          loading="lazy"
        />
      } @else {
        <div class="pp-circuit-map__placeholder pp-circuit-map__placeholder--empty">
          <span>Circuit image unavailable for this session</span>
        </div>
      }
    </figure>
  `,
  styleUrl: './pp-circuit-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpCircuitMap {
  readonly imageUrl = input<string | null>(null);
  readonly circuitName = input('');
  readonly loading = input(false);
}

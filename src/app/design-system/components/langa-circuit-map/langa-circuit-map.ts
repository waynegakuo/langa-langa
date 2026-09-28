import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'langa-circuit-map',
  standalone: true,
  template: `
    <figure class="langa-circuit-map">
      <figcaption class="langa-circuit-map__caption">
        <span class="langa-circuit-map__label">Circuit layout</span>
        <span class="langa-circuit-map__name">{{ circuitName() }}</span>
      </figcaption>

      @if (loading()) {
        <div class="langa-circuit-map__placeholder">
          <span class="langa-circuit-map__loading-text">Loading circuit…</span>
        </div>
      } @else if (imageUrl()) {
        <img
          class="langa-circuit-map__image"
          [src]="imageUrl()!"
          [alt]="circuitName() + ' circuit layout'"
          loading="lazy"
        />
      } @else {
        <div class="langa-circuit-map__placeholder langa-circuit-map__placeholder--empty">
          <span>Circuit image unavailable for this session</span>
        </div>
      }
    </figure>
  `,
  styleUrl: './langa-circuit-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaCircuitMap {
  readonly imageUrl = input<string | null>(null);
  readonly circuitName = input('');
  readonly loading = input(false);
}

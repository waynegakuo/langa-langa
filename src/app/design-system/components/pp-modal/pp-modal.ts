import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'pp-modal',
  standalone: true,
  templateUrl: './pp-modal.html',
  styleUrl: './pp-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape($event)',
  },
})
export class PpModal {
  private readonly destroyRef = inject(DestroyRef);

  readonly open = input(false);
  readonly title = input('');
  readonly ariaLabel = input('');
  readonly closed = output<void>();

  constructor() {
    effect(() => {
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });

    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
    });
  }

  onEscape(event: Event): void {
    if (!this.open()) return;
    event.preventDefault();
    this.closed.emit();
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PpButtonVariant = 'primary' | 'secondary' | 'ghost';
export type PpButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'pp-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled()"
      [type]="type()"
    >
      <ng-content />
    </button>
  `,
  styleUrl: './pp-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PpButton {
  readonly variant = input<PpButtonVariant>('primary');
  readonly size = input<PpButtonSize>('md');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit'>('button');

  get buttonClasses(): string {
    return ['pp-btn', `pp-btn--${this.variant()}`, `pp-btn--${this.size()}`].join(' ');
  }
}

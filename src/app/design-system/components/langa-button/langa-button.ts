import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LangaButtonVariant = 'primary' | 'secondary' | 'ghost';
export type LangaButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'langa-button',
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
  styleUrl: './langa-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaButton {
  readonly variant = input<LangaButtonVariant>('primary');
  readonly size = input<LangaButtonSize>('md');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit'>('button');

  get buttonClasses(): string {
    return ['langa-btn', `langa-btn--${this.variant()}`, `langa-btn--${this.size()}`].join(' ');
  }
}

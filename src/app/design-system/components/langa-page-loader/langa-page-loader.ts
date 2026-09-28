import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

const DEFAULT_MESSAGES = [
  'Warming tyres…',
  'Box box, loading data…',
  'Checking parc fermé…',
  'Syncing with pit wall…',
  'Green light — almost there…',
  'Fetching lap times…',
  'Scanning the timing tower…',
];

const MESSAGE_INTERVAL_MS = 2800;

@Component({
  selector: 'langa-page-loader',
  standalone: true,
  templateUrl: './langa-page-loader.html',
  styleUrl: './langa-page-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangaPageLoader {
  private readonly destroyRef = inject(DestroyRef);

  /** Center in the viewport when the page has no other content yet. */
  readonly fullViewport = input(false);
  readonly messages = input<string[] | null>(null);

  readonly lights = [0, 1, 2, 3, 4] as const;
  readonly messageIndex = signal(0);

  readonly displayMessages = computed(() => {
    const custom = this.messages();
    return custom?.length ? custom : DEFAULT_MESSAGES;
  });

  readonly currentMessage = computed(() => {
    const list = this.displayMessages();
    return list[this.messageIndex() % list.length];
  });

  constructor() {
    const timer = setInterval(() => {
      this.messageIndex.update((index) => index + 1);
    }, MESSAGE_INTERVAL_MS);

    this.destroyRef.onDestroy(() => clearInterval(timer));
  }
}

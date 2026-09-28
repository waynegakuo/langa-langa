import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../app-header/app-header';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, AppHeader],
  template: `
    <app-header />
    <main class="app-shell">
      <div class="app-shell__content">
        <router-outlet />
      </div>
    </main>
    <footer class="app-shell__footer">
      <p>Data powered by <a href="https://openf1.org" target="_blank" rel="noopener">OpenF1</a></p>
    </footer>
  `,
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {}

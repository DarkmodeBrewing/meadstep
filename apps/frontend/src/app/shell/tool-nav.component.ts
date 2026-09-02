import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tool-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Tool navigation">
      <a routerLink="/planner" routerLinkActive="active">Planner</a>
      <a routerLink="/honey-og" routerLinkActive="active">Honey OG</a>
      <a routerLink="/abv" routerLinkActive="active">ABV</a>
      <a routerLink="/gravity" routerLinkActive="active">Gravity</a>
    </nav>
  `,
  styles: `
    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    a {
      min-height: 2.5rem;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
      color: inherit;
      font-weight: 800;
      text-decoration: none;
    }

    .active {
      border-color: var(--accent);
      color: var(--accent);
    }
  `,
})
export class ToolNavComponent {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shell/app-header.component';
import { ToolNavComponent } from './shell/tool-nav.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [AppHeaderComponent, RouterOutlet, ToolNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

import { Routes } from '@angular/router';
import { PlannerScreenComponent } from './features/planner/planner-screen.component';
import { GravityToolScreenComponent } from './features/tools/gravity/gravity-tool-screen.component';
import { HoneyOgToolScreenComponent } from './features/tools/honey-og/honey-og-tool-screen.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'planner' },
  { path: 'planner', component: PlannerScreenComponent },
  { path: 'honey-og', component: HoneyOgToolScreenComponent },
  { path: 'gravity', component: GravityToolScreenComponent },
  { path: '**', redirectTo: 'planner' },
];

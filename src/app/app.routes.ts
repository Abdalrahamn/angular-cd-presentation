import { Routes } from '@angular/router';
import { PresentationSlider } from './presentation-slider/presentation-slider';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/slide/1',
    pathMatch: 'full',
  },
  {
    path: 'slide/:slideNumber',
    component: PresentationSlider,
  },
  {
    path: '**',
    redirectTo: '/slide/1',
  },
];

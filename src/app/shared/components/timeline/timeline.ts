import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideContent } from '../../../models/slide.interface';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class TimelineComponent {
  content = input.required<SlideContent>();
}

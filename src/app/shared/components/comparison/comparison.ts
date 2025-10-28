import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideContent } from '../../../models/slide.interface';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison.html',
  styleUrl: './comparison.scss',
})
export class ComparisonComponent {
  content = input.required<SlideContent>();
}

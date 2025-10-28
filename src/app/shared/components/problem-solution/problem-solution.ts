import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemSolution } from '../../../models/slide.interface';

@Component({
  selector: 'app-problem-solution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem-solution.html',
  styleUrl: './problem-solution.scss',
})
export class ProblemSolutionComponent {
  problemSolution = input.required<ProblemSolution>();
}

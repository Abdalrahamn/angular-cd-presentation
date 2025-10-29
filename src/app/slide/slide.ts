import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideData } from '../models/slide.interface';
import { VsCodeBlockComponent } from '../shared/components/vs-code-block/vs-code-block';
import { ComparisonComponent } from '../shared/components/comparison/comparison';
import { TimelineComponent } from '../shared/components/timeline/timeline';
import { ChangeDetectionDiagramComponent } from '../shared/components/change-detection-diagram/change-detection-diagram';
import { ProblemSolutionComponent } from '../shared/components/problem-solution/problem-solution';
import {
  SynchronousDemoComponent,
  AsynchronousDemoComponent,
  SignalsDemoComponent,
  OnPushDemoComponent,
  ZonelessDemoComponent,
  AngularJSDemoComponent,
  ZoneFlowDemoComponent,
  PerformanceDemoComponent,
  ZoneBeforeAfterDemoComponent,
  AsyncPipeDemoComponent,
} from '../shared/components/live-demos';
import { UserComparisonDemoComponent } from '../components/user-comparison-demo.component';

@Component({
  selector: 'app-slide',
  standalone: true,
  imports: [
    CommonModule,
    VsCodeBlockComponent,
    ComparisonComponent,
    TimelineComponent,
    ChangeDetectionDiagramComponent,
    ProblemSolutionComponent,
    SynchronousDemoComponent,
    AsynchronousDemoComponent,
    SignalsDemoComponent,
    OnPushDemoComponent,
    ZonelessDemoComponent,
    AngularJSDemoComponent,
    ZoneFlowDemoComponent,
    PerformanceDemoComponent,
    ZoneBeforeAfterDemoComponent,
    AsyncPipeDemoComponent,
    UserComparisonDemoComponent,
  ],
  templateUrl: './slide.html',
  styleUrl: './slide.scss',
})
export class Slide {
  // Signal input for slide data
  slideData = input.required<SlideData>();

  // Signal for animation state
  isVisible = signal(false);

  // Computed properties for enhanced presentation
  hasCodeExample = computed(() => !!this.slideData().codeExample);
  hasComparison = computed(() =>
    this.slideData().content.some((item) => item.type === 'comparison')
  );
  hasTimeline = computed(() => this.slideData().content.some((item) => item.type === 'timeline'));

  // Live demo logic
  hasLiveDemo = computed(() => {
    const slideId = this.slideData().id;
    return this.getLiveDemoType() !== null;
  });

  getLiveDemoType = computed(() => {
    const slideId = this.slideData().id;

    // Map slide IDs to demo types
    const demoMap: Record<string, string> = {
      'synchronous-change-detection': 'synchronous',
      'asynchronous-problems': 'asynchronous',
      'async-problem-explanation': 'asynchronous',
      'async-problem-demo': 'asynchronous',
      'signals-basic-example': 'signals',
      'signals-fundamentals': 'signals',
      'signals-introduction': 'signals',
      'signals-computed': 'signals',
      'signals-effects': 'signals',
      'onpush-overview': 'onpush',
      'onpush-triggers': 'onpush',
      'onpush-best-practices': 'onpush',
      'onpush-strategy': 'onpush',
      'onpush-optimization': 'onpush',
      'immutability-deep-dive': 'onpush',
      'onpush-with-observables': 'async-pipe',
      'async-pipe-implementation': 'async-pipe',
      'async-pipe-marking-demo': 'async-pipe',
      'zoneless-introduction': 'zoneless',
      'zoneless-scheduler': 'zoneless',
      'zoneless-performance-benefits': 'zoneless',
      'angularjs-introduction': 'angularjs',
      'angularjs-digest-cycle': 'angularjs',
      'zone-flow': 'zone-flow',
      'zone-monkey-patching': 'zone-flow',
      'zone-js-deep-dive': 'zone-before-after',
      'zone-js-introduction': 'zone-before-after',
      'performance-comparison': 'performance',
      'default-vs-onpush': 'performance',
    };

    return demoMap[slideId] || null;
  });

  // Method to show slide with animation
  show() {
    this.isVisible.set(true);
  }

  // Method to hide slide
  hide() {
    this.isVisible.set(false);
  }
}

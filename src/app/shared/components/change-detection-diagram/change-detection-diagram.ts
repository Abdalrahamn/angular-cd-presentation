import { Component, input, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DiagramType =
  | 'component-tree'
  | 'zone-flow'
  | 'signals-flow'
  | 'performance-comparison'
  | 'strategy-comparison'
  | 'onpush-tree'
  | 'targeted-change-detection'
  | 'dirty-marking-flow'
  | 'zoneless-architecture'
  | 'signal-dependency-graph'
  | 'async-problem-demo'
  | 'signal-apis-flow'
  | 'migration-flow'
  | 'future-roadmap'
  | 'angularjs-overview'
  | 'angularjs-performance'
  | 'angularjs-to-angular-evolution'
  | 'ngzone-wrapper'
  | 'immutability-patterns'
  | 'onpush-triggers'
  | 'async-pipe-flow'
  | 'manual-cd-methods'
  | 'angular-bootstrap-flow'
  | 'cd-tick-cycle'
  | 'dirty-marking-tree'
  | 'event-listener-wrapping'
  | 'ngzone-component-tree';

@Component({
  selector: 'app-change-detection-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './change-detection-diagram.html',
  styleUrl: './change-detection-diagram.scss',
})
export class ChangeDetectionDiagramComponent {
  diagramType = input.required<DiagramType>();
  title = input<string>('');
  animated = input<boolean>(true);

  // Animation state
  isAnimating = signal(false);
  currentStep = signal(0);

  // Performance data for charts
  performanceData = computed(() => [
    { name: 'Zone.js Default', value: 100, time: '100ms', color: '#ff6b9d' },
    { name: 'OnPush Strategy', value: 60, time: '60ms', color: '#ffb86c' },
    { name: 'Signals + Zone', value: 30, time: '30ms', color: '#50fa7b' },
    { name: 'Zoneless', value: 15, time: '15ms', color: '#40e0d0' },
  ]);

  constructor() {
    effect(() => {
      if (this.animated()) {
        this.startAnimation();
      }
    });
  }

  startAnimation() {
    this.isAnimating.set(true);
    this.currentStep.set(0);

    const interval = setInterval(() => {
      this.currentStep.update((step) => {
        const nextStep = step + 1;
        if (nextStep > this.getMaxSteps()) {
          clearInterval(interval);
          this.isAnimating.set(false);
          return 0;
        }
        return nextStep;
      });
    }, 1500);
  }

  private getMaxSteps(): number {
    switch (this.diagramType()) {
      case 'component-tree':
      case 'onpush-tree':
        return 4;
      case 'zone-flow':
        return 5;
      case 'signals-flow':
        return 3;
      case 'async-problem-demo':
        return 4;
      case 'dirty-marking-flow':
        return 3;
      case 'targeted-change-detection':
        return 4;
      case 'signal-dependency-graph':
        return 4;
      case 'zoneless-architecture':
        return 1;
      case 'angularjs-overview':
        return 4; // Controllers -> Scope -> Digest -> DOM
      case 'angularjs-performance':
        return 5; // Performance points animation
      case 'angularjs-to-angular-evolution':
        return 3; // AngularJS -> Angular 2+ -> Angular 20+
      case 'signal-apis-flow':
        return 3;
      case 'migration-flow':
        return 4;
      case 'future-roadmap':
        return 3;
      case 'ngzone-wrapper':
        return 4; // Root -> NgZone -> Outer/Inner Zones -> Components
      case 'immutability-patterns':
        return 3; // Mutation -> Immutable update -> Result
      case 'onpush-triggers':
        return 4; // Input change, Event, Async pipe, Manual
      case 'async-pipe-flow':
        return 3; // Observable -> Async pipe -> Change detection
      case 'manual-cd-methods':
        return 4; // detectChanges, markForCheck, detach, reattach
      case 'angular-bootstrap-flow':
        return 3; // browser.ts -> bootstrapApplication -> internalCreateApplication
      case 'cd-tick-cycle':
        return 6; // CD will run -> componentFactory.create -> renderView -> tick -> detectChanges -> refreshView
      case 'dirty-marking-tree':
        return 3; // Root -> Dirty marking -> Component tree
      case 'event-listener-wrapping':
        return 3; // Angular Will -> wrapListener -> markViewDirty
      case 'ngzone-component-tree':
        return 4; // NgZone -> Root -> Component tree with states
      default:
        return 0;
    }
  }
}

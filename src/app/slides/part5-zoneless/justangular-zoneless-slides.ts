import { SlideData } from '../../models/slide.interface';

export const justAngularZonelessSlides: SlideData[] = [
  {
    id: 'zoneless-introduction',
    title: 'Zoneless Angular: STABLE in Angular 20.2! 🎉',
    subtitle: 'The Revolutionary Change Detection System',
    content: [
      {
        type: 'text',
        content:
          "Zoneless Angular represents the biggest evolution in Angular's change detection system since Angular 2. By removing Zone.js, we eliminate the overhead of monkey patching while gaining massive performance improvements and predictability.",
      },
      {
        type: 'highlight',
        content: '🚀 Angular 20.2: Zoneless goes from experimental to STABLE!',
      },
      {
        type: 'bullet',
        content: 'Proven benefits in Angular 19-20:',
        subItems: [
          'Bundle size reduction: 45KB (18% smaller)',
          'Startup time improvement: 130ms faster (15% boost)',
          'Memory usage reduction: 1.7MB less (14% savings)',
          'LCP improvements: 40-50% better performance',
          'No monkey patching overhead',
          'Cleaner stack traces and debugging',
          'Better compatibility with modern JS tools',
        ],
      },
      {
        type: 'success-story',
        content: '✅ Success Stories:',
        subItems: [
          'YouTube adopts Angular Signals for rendering',
          'Google Search uses Wiz-Angular hybrid approach',
          'Enterprise apps report 3-5x faster change detection',
        ],
      },
    ],
  },
  {
    id: 'zoneless-without-zone',
    title: 'What Happens When We Remove Zone.js?',
    subtitle: 'The Challenge and the Solution',
    content: [
      {
        type: 'text',
        content:
          "When we remove Zone.js from Angular, we're left with code that runs but doesn't update the UI. Nothing triggers appRef.tick() anymore!",
      },
      {
        type: 'highlight',
        content: "⚠️ Without Zone.js, Angular doesn't know when to run change detection",
      },
      {
        type: 'text',
        content: 'But Angular already has APIs that can tell it when something changed:',
      },
      {
        type: 'bullet',
        content: 'Existing change detection triggers:',
        subItems: [
          'markForCheck() - used by async pipe',
          'Signal changes - automatic with signals',
          'Event handlers that mark views dirty',
          'setInput() on dynamically created components',
        ],
      },
    ],
  },
  {
    id: 'zoneless-scheduler',
    title: 'The Zoneless Scheduler - Now Production Ready!',
    subtitle: 'Smart Scheduling in Angular 20',
    content: [
      {
        type: 'text',
        content:
          'Angular 20 introduces a production-ready zoneless scheduler that intelligently triggers change detection only when needed, replacing Zone.js with precise control.',
      },
      {
        type: 'highlight',
        content: '⚡ Key Innovation: markForCheck() now triggers change detection directly!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Angular 20 Zoneless Setup',
      code: `// Angular 20 - Simple zoneless setup
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection() // Stable in Angular 20.2!
  ]
});

// Component with automatic reactivity
@Component({
  template: \`
    <h1>{{ count() }}</h1>
    <button (click)="increment()">+</button>
  \`
})
export class CounterComponent {
  count = signal(0);
  
  increment() {
    this.count.update(c => c + 1); // Automatically triggers UI update!
  }
}`,
      explanation:
        'The new scheduler is incredibly simple: Signals automatically notify Angular when they change, and markForCheck() triggers change detection immediately. No complex scheduling needed!',
    },
  },
  {
    id: 'zoneless-markviewdirty',
    title: 'Updated markViewDirty for Zoneless',
    subtitle: 'Notifying the Scheduler',
    content: [
      {
        type: 'text',
        content:
          'In the experimental zoneless implementation, markViewDirty now notifies the changeDetectionScheduler that something changed.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Updated markViewDirty',
      code: `export function markViewDirty(lView: LView): LView|null {
  lView[ENVIRONMENT].changeDetectionScheduler?.notify();
  // ... rest of the existing code
  while (lView) {
    lView[FLAGS] |= LViewFlags.Dirty;
    const parent = getLViewParent(lView);
    if (isRootView(lView) && !viewAttachedToChangeDetector(lView)) {
      break;
    }
    lView = parent;
  }
  return lView;
}`,
      explanation:
        'Now when a component is marked dirty, it immediately notifies the scheduler to queue a change detection run.',
    },
  },
  {
    id: 'zoneless-onpush-compatibility',
    title: 'OnPush Components Work Great in Zoneless',
    subtitle: 'Already Optimized for Explicit Change Detection',
    content: [
      {
        type: 'text',
        content:
          'Applications currently using OnPush change detection strategy will work perfectly in a zoneless Angular world because they already follow the pattern of explicitly telling Angular when things change.',
      },
      {
        type: 'bullet',
        content: 'OnPush components already use:',
        subItems: [
          'Immutable data patterns',
          'Explicit markForCheck() calls',
          'Observable streams with async pipe',
          'Input reference changes for updates',
        ],
      },
      {
        type: 'highlight',
        content: '✅ OnPush apps are already zoneless-ready!',
      },
    ],
  },
  {
    id: 'zoneless-vs-local',
    title: 'Zoneless ≠ Local Change Detection',
    subtitle: 'Understanding the Difference',
    content: [
      {
        type: 'text',
        content:
          "It's important to understand that Zoneless Angular is not the same as local change detection. They are different concepts that can work together.",
      },
      {
        type: 'comparison',
        content: 'Zoneless vs Local Change Detection',
        comparison: {
          before:
            'Zoneless Angular:\n• Removes Zone.js library\n• Uses explicit change detection triggers\n• Still runs change detection on component trees\n• Better performance and smaller bundle\n• More predictable timing',
          after:
            'Local Change Detection:\n• Runs change detection on sub-trees only\n• Currently uses OnPush strategy\n• Can work with or without Zone.js\n• Optimizes which components are checked\n• Requires careful component design',
        },
      },
    ],
  },
  {
    id: 'zoneless-performance-benefits',
    title: 'Zoneless Performance Benefits',
    subtitle: 'Measurable Improvements',
    content: [
      {
        type: 'text',
        content:
          'Removing Zone.js provides significant performance benefits that are measurable in real-world applications.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Performance Comparison Component',
      code: `@Component({
  template: \`
    <div class="performance-metrics">
      <div class="metric">
        <h3>Bundle Size</h3>
        <p class="before">With Zone.js: 245KB</p>
        <p class="after">Zoneless: 200KB</p>
        <p class="improvement">Savings: 45KB (18%)</p>
      </div>
      
      <div class="metric">
        <h3>Startup Time</h3>
        <p class="before">With Zone.js: 850ms</p>
        <p class="after">Zoneless: 720ms</p>
        <p class="improvement">Improvement: 130ms (15%)</p>
      </div>
      
      <div class="metric">
        <h3>Memory Usage</h3>
        <p class="before">With Zone.js: 12.5MB</p>
        <p class="after">Zoneless: 10.8MB</p>
        <p class="improvement">Reduction: 1.7MB (14%)</p>
      </div>
    </div>
  \`
})
export class PerformanceMetricsComponent {
  // Real performance data from zoneless experiments
}`,
      explanation:
        'These are real performance improvements measured in experimental zoneless Angular applications.',
    },
    diagram: {
      type: 'zoneless-architecture',
      title: 'Zoneless vs Zone.js Architecture',
      animated: false,
    },
  },
  {
    id: 'signals-change-detection-future',
    title: 'Signals Change Detection: The Ultimate Goal',
    subtitle: 'No OnPush, No Zone.js, Signals Only',
    content: [
      {
        type: 'text',
        content:
          'The ultimate vision for Angular change detection combines signals with zoneless architecture for the most efficient and developer-friendly experience.',
      },
      {
        type: 'highlight',
        content: '🔮 Future: Signal-only components with native unidirectional data flow',
      },
      {
        type: 'bullet',
        content: 'Signal-based components will provide:',
        subItems: [
          'No need for OnPush strategy',
          'No change detection for entire trees',
          'Only update views inside components that changed',
          'Native unidirectional data flow',
          'Two-way data binding without headaches',
          'Perfect developer experience',
        ],
      },
    ],
  },
  {
    id: 'migration-strategy',
    title: 'Angular 19-20 Migration Tools & Strategy',
    subtitle: 'Automated Migration to Zoneless',
    content: [
      {
        type: 'text',
        content:
          'Angular 19-20 provides powerful automated migration tools to help you transition to zoneless change detection with minimal manual work.',
      },
      {
        type: 'highlight',
        content: '🛠️ Angular 19+ includes built-in migration schematics!',
      },
    ],
    codeExample: {
      language: 'bash',
      title: 'Angular 19-20 Migration Commands',
      code: `# Update to latest Angular version
ng update @angular/cli @angular/core

# Migrate to Signals (Angular 19+)
ng generate @angular/core:signals

# Migrate specific parts
ng generate @angular/core:signal-input-migration
ng generate @angular/core:output-migration  
ng generate @angular/core:signal-queries-migration

# Enable zoneless change detection
# Add to main.ts:
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()]
});`,
      explanation:
        'These commands automatically convert @Input, @Output, and queries to use Signals, making your app zoneless-ready with minimal manual changes.',
    },
    diagram: {
      type: 'migration-flow',
      title: 'Automated Migration Process',
      animated: false,
    },
  },
  {
    id: 'angular-21-22-roadmap',
    title: "Angular 21-22 Roadmap: What's Next?",
    subtitle: 'The Future of Angular Development',
    content: [
      {
        type: 'text',
        content:
          'Angular 21-22 will complete the transformation to a fully signal-driven, zoneless framework with revolutionary new features.',
      },
      {
        type: 'highlight',
        content: '🔮 Angular 21-22: The Signal-First Era Begins!',
      },
      {
        type: 'bullet',
        content: 'Expected in Angular 21 (May 2025):',
        subItems: [
          'Zoneless as the DEFAULT for new projects',
          'Signal-based forms (stable)',
          'Selectorless components (experimental)',
          'Enhanced httpResource API',
          'Native animations API',
          'Improved testing with Vitest/Web Test Runner',
        ],
      },
      {
        type: 'bullet',
        content: 'Vision for Angular 22 (November 2025):',
        subItems: [
          'Complete removal of @angular/animations',
          'Signal-only component authoring',
          'Functional component syntax options',
          'HTML-first component approach',
          'Full Wiz integration benefits',
          'AI-assisted development tools',
        ],
      },
      {
        type: 'migration-timeline',
        content: '📅 Migration Timeline:',
        subItems: [
          '2025: Angular 20-21 - Zoneless stable, Signals recommended',
          '2026: Angular 22-23 - Signal-first becomes default',
          '2027: Angular 24+ - Legacy Zone.js support deprecated',
        ],
      },
    ],
    diagram: {
      type: 'future-roadmap',
      title: 'Angular Evolution Timeline',
      animated: false,
    },
  },
  {
    id: 'zoneless-conclusion',
    title: 'Zoneless Angular: The Path Forward',
    subtitle: 'Better Performance, Better Developer Experience',
    content: [
      {
        type: 'text',
        content:
          "Zoneless Angular represents the culmination of years of evolution in Angular's change detection system. It combines the best of all approaches: the reliability of Zone.js, the performance of OnPush, and the precision of signals.",
      },
      {
        type: 'bullet',
        content: 'The complete evolution:',
        subItems: [
          'Zone.js: Automatic but inefficient',
          'OnPush: Manual but optimized',
          'Signals: Automatic and optimized',
          'Zoneless: Predictable and performant',
          'Signal Components: The perfect combination',
        ],
      },
      {
        type: 'highlight',
        content: '🚀 The future of Angular is zoneless, signal-driven, and incredibly efficient!',
      },
      {
        type: 'call-to-action',
        content: '🎯 Ready to start your zoneless journey?',
        subItems: [
          'Start new projects with Angular 20+ and zoneless',
          'Migrate existing apps using ng generate @angular/core:signals',
          'Adopt OnPush strategy as a stepping stone',
          'Use Signals for all new reactive state',
          'Test zoneless mode in development environments',
        ],
      },
    ],
  },
];

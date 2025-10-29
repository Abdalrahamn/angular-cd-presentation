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
      {
        type: 'comparison',
        content: 'Performance Comparison: Zone.js vs Zoneless',
        comparison: {
          before:
            'With Zone.js:\n• Bundle Size: 245KB\n• Startup Time: 850ms\n• Memory Usage: 12.5MB\n• Monkey patching overhead\n• Complex stack traces',
          after:
            'Zoneless Angular:\n• Bundle Size: 200KB (45KB savings - 18%)\n• Startup Time: 720ms (130ms faster - 15%)\n• Memory Usage: 10.8MB (1.7MB less - 14%)\n• No monkey patching\n• Clean stack traces',
        },
      },
    ],
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
      {
        type: 'bullet',
        content: 'Automated Migration Process:',
        subItems: [
          '1. Update Angular CLI and Core packages',
          '2. Run signal migration schematics',
          '3. Convert @Input, @Output, and queries to signals',
          '4. Remove Zone.js from polyfills.ts',
          '5. Enable zoneless change detection',
          '6. Test and validate the migration',
        ],
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

# Remove Zone.js from polyfills.ts
# Delete or comment out: import 'zone.js/dist/zone';

# Enable zoneless change detection (see previous slide for setup)`,
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
    id: 'practical-example',
    title: 'Practical Example: HTTP Client with OnPush',
    subtitle: 'Real-World Implementation',
    content: [
      {
        type: 'text',
        content:
          "Here's a practical example showing how to implement an Angular component that fetches user data using HttpClient with OnPush change detection strategy.",
      },
      {
        type: 'highlight',
        content: '🔧 This pattern works perfectly in both Zone.js and Zoneless environments!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'User List Component with OnPush',
      code: `@Component({
  selector: 'app-root',
  template: \`
    <h1>Users</h1>
    <ul>
      @for (user of users; track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private http = inject(HttpClient);
  users: User[] = [];

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe((users) => {
        this.users = users;
      });
  }
}`,
      explanation:
        'This component demonstrates OnPush change detection with HTTP requests. In a zoneless environment, you would need to call markForCheck() after setting the users array, or better yet, use signals for automatic reactivity.',
    },
  },
  {
    id: 'practical-example-zoneless',
    title: 'Same Example: Zoneless with Signals',
    subtitle: 'Modern Angular Approach',
    content: [
      {
        type: 'text',
        content:
          "Here's how the same component would look in a zoneless Angular application using signals for automatic reactivity.",
      },
      {
        type: 'highlight',
        content: '⚡ No manual change detection needed - signals handle everything!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Zoneless User List Component',
      code: `@Component({
  selector: 'app-zoneless-user-list',
  template: \`
    <div class="user-list-container">
      <h2>Users (Zoneless with Signals)</h2>
      <div class="loading" *ngIf="loading()">Loading users...</div>
      <ul class="user-list" *ngIf="!loading()">
        @for (user of users(); track user.id) {
          <li class="user-item">
            <strong>{{ user.name }}</strong>
            <span>@{{ user.username }}</span>
            <div>{{ user.email }}</div>
          </li>
        }
      </ul>
    </div>
  \`,
  // No changeDetection strategy needed in zoneless!
})
export class ZonelessUserListComponent {
  private http = inject(HttpClient);
  users = signal<User[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe((users) => {
        this.users.set(users); // Automatically triggers UI update!
        this.loading.set(false);
      });
  }
}`,
      explanation:
        'In the zoneless version, signals automatically notify Angular when they change, eliminating the need for manual change detection calls.',
    },
  },
  {
    id: 'live-demo-result',
    title: 'Live Demo: See It In Action! 🚀',
    subtitle: 'Working Components Side by Side',
    content: [
      {
        type: 'text',
        content:
          "Here's the actual working result of both approaches - you can see how they both fetch and display user data, but with different change detection strategies.",
      },
      {
        type: 'highlight',
        content:
          '👀 Notice: Both components work, but the zoneless version is more reactive and efficient!',
      },
      {
        type: 'code-demo',
        content:
          '🎯 Interactive Demo: Both components are now available in the codebase at /src/app/components/',
      },
      {
        type: 'bullet',
        content: 'Key observations from the demo:',
        subItems: [
          'Both components fetch the same data from JSONPlaceholder API',
          'OnPush version uses traditional properties and change detection',
          'Zoneless version uses signals for automatic reactivity',
          'The UI updates happen automatically in both cases',
          'Zoneless approach requires less boilerplate code',
          'Signals provide better type safety and reactivity',
        ],
      },
    ],
  },
  {
    id: 'angular-memes-finale',
    title: 'The End: Angular Change Detection Memes! 😂',
    subtitle: 'Because Every Good Presentation Needs Memes',
    content: [
      {
        type: 'highlight',
        content: '🎉 Congratulations! You survived the Angular Change Detection journey!',
      },
      {
        type: 'image',
        content: 'When you migrate from Zone.js to Zoneless',
        imageUrl: 'https://i.imgflip.com/2/30b1gx.jpg',
        imageAlt: 'This is fine dog meme - Migrating to zoneless',
      },
      {
        type: 'text',
        content:
          '🚀 From AngularJS digest cycles to Zoneless Signals - what a journey! Thanks for joining me on this epic adventure through the evolution of Angular change detection.',
      },
      {
        type: 'highlight',
        content:
          '💡 Remember: With great power comes great responsibility... to optimize your change detection! 😄',
      },
    ],
  },
];

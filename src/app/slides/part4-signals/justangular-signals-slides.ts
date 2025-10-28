import { SlideData } from '../../models/slide.interface';

export const justAngularSignalsSlides: SlideData[] = [
  {
    id: 'signals-introduction',
    title: 'Angular 19-20 Signals: Production Ready Revolution',
    subtitle: 'Fine-grained Reactivity at Scale',
    content: [
      {
        type: 'text',
        content:
          'Signals represent the biggest shift in Angular since the framework began. Angular 19-20 brings mature, production-ready Signals with new APIs that enable surgical updates to only the parts that actually changed.',
      },
      {
        type: 'highlight',
        content: '🎯 Angular 19-20: Signals are now the recommended approach for new projects!',
      },
      {
        type: 'bullet',
        content: 'New in Angular 19-20:',
        subItems: [
          'linkedSignal() - Create derived signals with dependencies',
          'resource() & rxResource() - Async data management',
          'httpResource() - Signal-based HTTP client alternative',
          'Signal-based forms (experimental)',
          'Automatic dependency tracking',
          'Surgical DOM updates (3-5x faster)',
          'Perfect zoneless compatibility',
        ],
      },
      {
        type: 'success-metrics',
        content: '📊 Real-world performance gains (2024-2025):',
        subItems: [
          'YouTube: 40% faster rendering with Signals',
          'Google Search: Wiz-Angular hybrid performance',
          'Enterprise apps: 60% fewer change detection cycles',
          'Bundle size: 45KB reduction (18% smaller)',
          'Startup time: 130ms improvement (15% faster)',
          'Memory usage: 1.7MB reduction (14% less)',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Angular 19-20 Signals Overview',
      code: `import { Component, signal, computed, linkedSignal, resource } from '@angular/core';

@Component({
  template: \`
    <div class="signals-demo">
      <!-- Basic Signal -->
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">+</button>
      
      <!-- Computed Signal -->
      <p>Doubled: {{ doubled() }}</p>
      
      <!-- Linked Signal (Angular 19+) -->
      <p>Status: {{ status() }}</p>
      
      <!-- Resource Signal (Angular 20+) -->
      <div>
        @if (userResource.loading()) {
          <p>Loading user...</p>
        } @else if (userResource.error()) {
          <p>Error: {{ userResource.error() }}</p>
        } @else {
          <p>User: {{ userResource.value()?.name }}</p>
        }
      </div>
    </div>
  \`
})
export class SignalsComponent {
  // Basic writable signal
  count = signal(0);
  
  // Computed signal - automatically updates when count changes
  doubled = computed(() => this.count() * 2);
  
  // Linked signal - derives from other signals (Angular 19+)
  status = linkedSignal(() => 
    this.count() > 10 ? 'High' : 'Low'
  );
  
  // Resource signal - for async data (Angular 20+)
  userResource = resource({
    request: () => ({ id: this.count() }),
    loader: ({ request }) => 
      fetch(\`/api/users/\${request.id}\`).then(r => r.json())
  });
  
  increment() {
    this.count.update(n => n + 1);
    // Only components using count(), doubled(), or status() will update!
  }
}`,
      explanation:
        'Signals provide fine-grained reactivity - only the specific DOM nodes that depend on changed signals are updated, not the entire component tree.',
    },
  },
  {
    id: 'signals-basic-example',
    title: 'Signals Basic Example',
    subtitle: 'Creating and Using Signals',
    codeExample: {
      language: 'typescript',
      title: 'Basic Signal Usage',
      code: `import { Component, signal, computed } from '@angular/core';

@Component({
  template: \`
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  \`
})
export class CounterComponent {
  // Create a signal
  count = signal(0);
  
  // Create a computed signal that automatically updates
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    // Update the signal
    this.count.update(value => value + 1);
  }
}`,
      explanation:
        'Signals are reactive primitives that automatically track dependencies and update consumers when they change.',
    },
    content: [
      {
        type: 'text',
        content:
          'When count() changes, only the DOM nodes that depend on count or doubleCount are updated - not the entire component!',
      },
    ],
  },
  {
    id: 'targeted-change-detection',
    title: 'Targeted Change Detection',
    subtitle: 'New Flags: RefreshView & HAS_CHILD_VIEWS_TO_REFRESH',
    content: [
      {
        type: 'text',
        content:
          'Angular introduced two new flags to enable targeted change detection with signals:',
      },
      {
        type: 'bullet',
        content: 'New LView flags:',
        subItems: [
          'RefreshView - Marks a component that needs to be refreshed',
          'HAS_CHILD_VIEWS_TO_REFRESH - Marks ancestors that have children to refresh',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'markViewForRefresh Function',
      code: `/**
 * Adds the \`RefreshView\` flag from the lView and updates HAS_CHILD_VIEWS_TO_REFRESH flag of
 * parents.
 */
export function markViewForRefresh(lView: LView) {
  if (lView[FLAGS] & LViewFlags.RefreshView) {
    return;
  }
  lView[FLAGS] |= LViewFlags.RefreshView;
  if (viewAttachedToChangeDetector(lView)) {
    markAncestorsForTraversal(lView);
  }
}`,
      explanation:
        'When a signal changes, Angular marks the component with RefreshView and marks all ancestors with HAS_CHILD_VIEWS_TO_REFRESH.',
    },
  },
  {
    id: 'targeted-mode-rules',
    title: 'Targeted Mode Rules',
    subtitle: 'How Angular Decides What to Check',
    content: [
      {
        type: 'text',
        content:
          'Angular now has two change detection modes: GlobalMode and TargetedMode, with specific rules for when to switch between them.',
      },
      {
        type: 'bullet',
        content: 'GlobalMode (traditional):',
        subItems: [
          'Triggered by NgZone (Zone.js)',
          'Checks CheckAlways components',
          'Checks Dirty OnPush components',
          'Goes top-down through entire tree',
        ],
      },
      {
        type: 'bullet',
        content: 'TargetedMode (signals):',
        subItems: [
          'Triggered when encountering Non-Dirty OnPush component',
          'Only refreshes views with RefreshView flag',
          'Skips CheckAlways components without RefreshView',
          'Switches back to GlobalMode when RefreshView is found',
        ],
      },
    ],
  },
  {
    id: 'targeted-mode-flow',
    title: 'Targeted Mode Change Detection Flow',
    subtitle: 'Step-by-Step Process',
    content: [
      {
        type: 'bullet',
        content: 'The targeted change detection process:',
        subItems: [
          '1. Start with root component (CheckAlways) - check & refresh normally',
          '2. Continue with CheckAlways components - refresh as usual',
          '3. Hit OnPush + HAS_CHILD_VIEWS_TO_REFRESH but not dirty → Switch to TargetedMode',
          '4. In TargetedMode: Skip CheckAlways components without RefreshView',
          '5. Find RefreshView component → Refresh it and switch to GlobalMode',
          '6. Continue in GlobalMode for children',
        ],
      },
      {
        type: 'highlight',
        content: '🎯 Targeted Change Detection = OnPush without footguns!',
      },
    ],
    diagram: {
      type: 'targeted-change-detection',
      title: 'Targeted Change Detection Flow',
      animated: false,
    },
  },
  {
    id: 'signals-vs-zone-comparison',
    title: 'Signals vs Zone.js Comparison',
    subtitle: 'Performance and Developer Experience',
    content: [
      {
        type: 'comparison',
        content: 'Zone.js vs Signals',
        comparison: {
          before:
            'Zone.js Change Detection:\n• Automatic but checks entire tree\n• Works with any code pattern\n• Can be inefficient for large apps\n• Harder to debug and predict\n• Monkey patches browser APIs',
          after:
            'Signals Change Detection:\n• Fine-grained and surgical updates\n• Explicit dependency tracking\n• Better performance\n• Easier to debug and reason about\n• No monkey patching needed',
        },
      },
    ],
    diagram: {
      type: 'strategy-comparison',
      title: 'Zone.js vs Signals Performance',
      animated: false,
    },
  },
  {
    id: 'signals-dependency-tracking',
    title: 'Automatic Dependency Tracking',
    subtitle: 'How Signals Track Dependencies',
    content: [
      {
        type: 'text',
        content:
          'Signals automatically track dependencies between computed values and source signals, enabling precise updates.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Complex Dependency Example',
      code: `@Component({
  template: \`
    <div>
      <h2>User Profile</h2>
      <p>Name: {{ fullName() }}</p>
      <p>Status: {{ userStatus() }}</p>
      <p>Badge: {{ badge() }}</p>
      
      <input [value]="firstName()" (input)="updateFirstName($event)">
      <input [value]="lastName()" (input)="updateLastName($event)">
      <button (click)="toggleActive()">Toggle Active</button>
    </div>
  \`
})
export class UserProfileComponent {
  firstName = signal('John');
  lastName = signal('Doe');
  isActive = signal(true);
  
  // Computed signals automatically track dependencies
  fullName = computed(() => \`\${this.firstName()} \${this.lastName()}\`);
  
  userStatus = computed(() => this.isActive() ? 'Active' : 'Inactive');
  
  badge = computed(() => {
    const status = this.userStatus();
    const name = this.fullName();
    return \`\${name} - \${status}\`;
  });
  
  updateFirstName(event: Event) {
    const target = event.target as HTMLInputElement;
    this.firstName.set(target.value);
    // Only DOM nodes depending on firstName, fullName, and badge update!
  }
  
  updateLastName(event: Event) {
    const target = event.target as HTMLInputElement;
    this.lastName.set(target.value);
    // Only DOM nodes depending on lastName, fullName, and badge update!
  }
  
  toggleActive() {
    this.isActive.update(active => !active);
    // Only DOM nodes depending on isActive, userStatus, and badge update!
  }
}`,
      explanation:
        'Signals automatically track which computed values depend on which source signals. When firstName changes, only fullName and badge are recalculated and their DOM nodes updated.',
    },
    diagram: {
      type: 'signal-dependency-graph',
      title: 'Signal Dependency Tracking',
      animated: false,
    },
  },
  {
    id: 'angular-19-20-signal-apis',
    title: 'Angular 19-20 New Signal APIs',
    subtitle: 'linkedSignal, resource, and rxResource',
    content: [
      {
        type: 'text',
        content:
          'Angular 19-20 introduces powerful new Signal APIs that solve common reactive programming challenges.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'New Signal APIs in Action',
      code: `import { Component, signal, linkedSignal, resource } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  template: \`
    <div>
      <!-- linkedSignal - derived signal with dependency -->
      <h2>Original: {{ original() }}</h2>
      <h2>Working Copy: {{ workingCopy() }}</h2>
      <button (click)="updateOriginal()">Update Original</button>
      <button (click)="updateWorkingCopy()">Update Working Copy</button>
      
      <!-- resource - async data management -->
      <div *ngIf="userResource.loading()">Loading user...</div>
      <div *ngIf="userResource.error()">Error: {{ userResource.error() }}</div>
      <div *ngIf="userResource.value()">
        User: {{ userResource.value().name }}
      </div>
      
      <!-- rxResource - RxJS integration -->
      <div>Posts: {{ postsResource.value()?.length || 0 }}</div>
    </div>
  \`
})
export class ModernSignalsComponent {
  // linkedSignal - creates a working copy that syncs with original
  original = signal('Hello');
  workingCopy = linkedSignal(() => this.original());
  
  // resource - handles async operations with loading/error states
  userId = signal(1);
  userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: ({ request }) => 
      fetch(\`/api/users/\${request.id}\`).then(r => r.json())
  });
  
  // rxResource - combines RxJS with Signals
  postsResource = rxResource({
    request: () => ({ userId: this.userId() }),
    loader: ({ request }) => 
      this.http.get(\`/api/users/\${request.userId}/posts\`)
  });
  
  updateOriginal() {
    this.original.set('Updated Original');
    // workingCopy automatically updates!
  }
  
  updateWorkingCopy() {
    this.workingCopy.set('Modified Working Copy');
    // original remains unchanged
  }
}`,
      explanation:
        'These new APIs solve major pain points: linkedSignal for working copies, resource for async data with built-in loading states, and rxResource for RxJS integration.',
    },
    diagram: {
      type: 'signal-apis-flow',
      title: 'Angular 19-20 Signal APIs',
      animated: false,
    },
  },
  {
    id: 'signals-effects',
    title: 'Effects: Side Effects with Signals',
    subtitle: 'Reactive Side Effects',
    content: [
      {
        type: 'text',
        content:
          'Effects provide a way to perform side effects when signals change, perfect for updating external state or making API calls.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Using Effects for Side Effects',
      code: `import { Component, signal, computed, effect } from '@angular/core';

@Component({
  template: \`
    <div>
      <p>Theme: {{ currentTheme() }}</p>
      <p>Count: {{ count() }}</p>
      <button (click)="increment()">Increment</button>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
  \`
})
export class ThemeComponent {
  count = signal(0);
  theme = signal<'light' | 'dark'>('light');
  
  currentTheme = computed(() => this.theme());
  
  constructor() {
    // Effect runs when signals it reads change
    effect(() => {
      const currentTheme = this.theme();
      const currentCount = this.count();
      
      // Side effect: update document class and localStorage
      document.body.className = currentTheme;
      localStorage.setItem('app-theme', currentTheme);
      localStorage.setItem('app-count', currentCount.toString());
      
      console.log(\`Theme: \${currentTheme}, Count: \${currentCount}\`);
    });
  }
  
  increment() {
    this.count.update(c => c + 1);
  }
  
  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}`,
      explanation:
        'Effects automatically run when any signal they read changes. Perfect for side effects like updating localStorage, making API calls, or updating global state.',
    },
  },
  {
    id: 'signals-vs-traditional-comparison',
    title: 'Signals vs Traditional Approach',
    subtitle: 'Side-by-Side Comparison',
    content: [
      {
        type: 'text',
        content:
          "Let's see how signals simplify reactive programming compared to traditional OnPush + Zone.js approach.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Traditional vs Signals Approach',
      code: `// ❌ Traditional approach with Zone.js + OnPush
@Component({
  selector: 'app-traditional',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <h2>{{ user.name }}</h2>
      <p>Posts: {{ user.posts.length }}</p>
      <p>Status: {{ userStatus }}</p>
      <p>Last update: {{ lastUpdate | date:'medium' }}</p>
    </div>
  \`
})
export class TraditionalComponent implements OnChanges {
  @Input() user!: User;
  
  userStatus = '';
  lastUpdate = new Date();
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      // Manual computation on input change
      this.userStatus = this.user.isActive ? 'Active' : 'Inactive';
      this.lastUpdate = new Date();
      
      // Manual change detection trigger
      this.cdr.markForCheck();
    }
  }
  
  updateUser(updates: Partial<User>) {
    // Must create new reference for OnPush
    this.user = { ...this.user, ...updates };
    this.userStatus = this.user.isActive ? 'Active' : 'Inactive';
    this.lastUpdate = new Date();
  }
}

// ✅ Modern approach with Signals
@Component({
  selector: 'app-signals',
  template: \`
    <div>
      <h2>{{ user().name }}</h2>
      <p>Posts: {{ user().posts.length }}</p>
      <p>Status: {{ userStatus() }}</p>
      <p>Last update: {{ lastUpdate() | date:'medium' }}</p>
    </div>
  \`
})
export class SignalsComponent {
  // Signal input - automatically reactive
  user = input.required<User>();
  
  // Computed signals - automatically update when dependencies change
  userStatus = computed(() => 
    this.user().isActive ? 'Active' : 'Inactive'
  );
  
  lastUpdate = computed(() => {
    // Depends on user signal - updates automatically
    this.user(); // Read to create dependency
    return new Date();
  });
  
  updateUser(updates: Partial<User>) {
    // Direct signal update - automatically triggers reactivity
    this.user.update(current => ({ ...current, ...updates }));
    // userStatus and lastUpdate automatically recalculate!
  }
}`,
      explanation:
        'Signals eliminate the need for manual change detection triggers, lifecycle hooks for reactive computations, and careful immutability management. Everything becomes automatically reactive.',
    },
  },
];

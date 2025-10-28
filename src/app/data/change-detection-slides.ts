import { PresentationData } from '../models/slide.interface';

export const changeDetectionPresentation: PresentationData = {
  title: 'Angular Change Detection: From A to Z',
  theme: 'angular',
  slides: [
    {
      id: 'intro',
      title: 'Angular Change Detection Evolution',
      subtitle: 'From Angular 2 to Angular 20 - A Complete Journey',
      content: [
        {
          type: 'text',
          content: 'Welcome to the complete guide of Angular Change Detection evolution!',
        },
        {
          type: 'bullet',
          content: "What we'll cover:",
          subItems: [
            'History from Angular 2 to Angular 20',
            'Zone.js and its role in change detection',
            'OnPush strategy and performance optimization',
            'Signals - The game changer',
            'Zoneless change detection',
            'Future of Angular change detection',
          ],
        },
      ],
    },
    {
      id: 'what-is-cd',
      title: 'What is Change Detection?',
      content: [
        {
          type: 'text',
          content:
            "Change Detection is Angular's mechanism to keep the UI in sync with application state.",
        },
        {
          type: 'highlight',
          content:
            "It's the process of checking if any data used by templates has changed and updating the DOM accordingly.",
        },
        {
          type: 'bullet',
          content: 'Key responsibilities:',
          subItems: [
            'Monitor data changes in components',
            'Update the DOM when changes occur',
            'Ensure UI reflects current application state',
            'Optimize performance through strategic updates',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Simple Change Detection Example',
        code: `@Component({
  template: \`<p>{{ counter }}</p>
             <button (click)="increment()">+</button>\`
})
export class CounterComponent {
  counter = 0;
  
  increment() {
    this.counter++; // Change detection will update the DOM
  }
}`,
        explanation: 'When increment() is called, Angular detects the change and updates the DOM',
      },
    },
    {
      id: 'angular2-era',
      title: 'Angular 2 Era (2016)',
      subtitle: 'The Birth of Modern Change Detection',
      content: [
        {
          type: 'text',
          content: 'Angular 2 introduced a revolutionary change detection system built on Zone.js',
        },
        {
          type: 'timeline',
          content: 'Key innovations:',
          subItems: [
            'Zone.js for automatic change detection triggering',
            'Unidirectional data flow',
            'Component tree traversal',
            'Default change detection strategy',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Angular 2 Component Example',
        code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  template: \`
    <div>
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button (click)="updateUser()">Update</button>
    </div>
  \`
})
export class UserComponent {
  user = { name: 'John', email: 'john@example.com' };
  
  updateUser() {
    this.user.name = 'Jane'; // Zone.js triggers change detection
  }
}`,
        explanation:
          'Zone.js automatically triggers change detection on DOM events, HTTP requests, and timers',
      },
    },
    {
      id: 'angular-bootstrap',
      title: 'The Beginning - Angular Bootstrap',
      subtitle: 'How Angular Application Starts',
      content: [
        {
          type: 'text',
          content: 'Understanding how Angular bootstraps and initializes the application',
        },
        {
          type: 'bullet',
          content: 'Bootstrap process:',
          subItems: [
            'browser.ts searches for bootstrapApplication() function',
            'bootstrapApplication() calls internalCreateApplication()',
            'ApplicationRef.ts calls bootstrap() function',
            'Application is initialized and ready',
          ],
        },
      ],
      diagram: {
        type: 'angular-bootstrap-flow',
        title: 'Angular Bootstrap Flow',
        animated: true,
      },
    },
    {
      id: 'cd-tick-cycle',
      title: 'Change Detection Tick Cycle',
      subtitle: 'Deep Dive into the CD Mechanism',
      content: [
        {
          type: 'text',
          content: 'The tick() function is the heart of Angular change detection',
        },
        {
          type: 'bullet',
          content: 'Tick cycle steps:',
          subItems: [
            'CD will run when triggered',
            'Creation Mode: componentFactory.create()',
            'Update Mode: _loadComponent()',
            'Both modes call renderView()',
            'tick() iterates through views and calls detectChanges()',
            'refreshView() updates the DOM',
          ],
        },
        {
          type: 'highlight',
          content: 'The tick() function sets _runningTick flag and processes all views',
        },
      ],
      diagram: {
        type: 'cd-tick-cycle',
        title: 'Change Detection Tick Cycle',
        animated: true,
      },
    },
    {
      id: 'dirty-marking-deep-dive',
      title: "Let's Deep Dive Again",
      subtitle: 'Dirty Marking in Component Tree',
      content: [
        {
          type: 'text',
          content: 'When a component becomes dirty, Angular marks it and its ancestors',
        },
        {
          type: 'bullet',
          content: 'Dirty marking behavior:',
          subItems: [
            'Root component is always checked',
            'Dirty components are marked with special flag',
            'Marking propagates up to root',
            'Only marked path is checked during CD',
          ],
        },
        {
          type: 'highlight',
          content: 'Dirty marking optimizes change detection by skipping clean branches',
        },
      ],
      diagram: {
        type: 'dirty-marking-tree',
        title: 'Dirty Marking in Component Tree',
        animated: true,
      },
    },
    {
      id: 'event-listener-wrapping',
      title: 'wrapListenerIn_markDirtyAndPreventDefault()',
      subtitle: 'How Angular Wraps Event Listeners',
      content: [
        {
          type: 'text',
          content: 'Angular wraps all event listeners to automatically trigger change detection',
        },
        {
          type: 'bullet',
          content: 'Event wrapping process:',
          subItems: [
            'Angular intercepts addEventListener calls',
            'Wraps listener with markDirtyAndPreventDefault',
            'When event fires, marks component as dirty',
            'Triggers change detection automatically',
          ],
        },
        {
          type: 'highlight',
          content: 'This is how Angular knows when to run change detection on user interactions!',
        },
      ],
      diagram: {
        type: 'event-listener-wrapping',
        title: 'Event Listener Wrapping',
        animated: true,
      },
    },
    {
      id: 'ngzone-component-tree-visualization',
      title: "let's click again!",
      subtitle: 'NgZone with Component Tree States',
      content: [
        {
          type: 'text',
          content: 'Visualizing how NgZone manages different component states during change detection',
        },
        {
          type: 'bullet',
          content: 'Component states:',
          subItems: [
            'Default Change Detection - Always checked',
            'Dirty - Marked for checking',
            'OnPush Change Detection - Only checked when inputs change',
            'OnPush + Dirty - OnPush component marked dirty',
            'Bindings Refreshed - UI updated',
          ],
        },
        {
          type: 'highlight',
          content: 'NgZone wraps the entire component tree and manages all state transitions',
        },
      ],
      diagram: {
        type: 'ngzone-component-tree',
        title: 'NgZone with Component Tree',
        animated: true,
      },
    },
    {
      id: 'zone-js-deep-dive',
      title: 'Zone.js - The Magic Behind the Scenes',
      content: [
        {
          type: 'text',
          content: 'Zone.js patches browser APIs to know when to trigger change detection',
        },
        {
          type: 'bullet',
          content: 'What Zone.js patches:',
          subItems: [
            'DOM Events (click, keyup, etc.)',
            'HTTP Requests (XMLHttpRequest, fetch)',
            'Timers (setTimeout, setInterval)',
            'Promises and async operations',
          ],
        },
        {
          type: 'highlight',
          content:
            'Zone.js runs change detection for the entire component tree on every async operation!',
        },
        {
          type: 'code-demo',
          content: 'Zone.js Change Detection Flow',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'How Zone.js Works',
        code: `// Without Zone.js (manual)
button.addEventListener('click', () => {
  this.counter++;
  this.cdr.detectChanges(); // Manual trigger
});

// With Zone.js (automatic)
button.addEventListener('click', () => {
  this.counter++; // Zone.js automatically triggers CD
});

// Zone.js patches setTimeout
setTimeout(() => {
  this.data = newData; // Automatic change detection
}, 1000);`,
        explanation: 'Zone.js eliminates the need for manual change detection triggering',
      },
    },
    {
      id: 'types-of-zones',
      title: 'Types of Zones',
      content: [
        {
          type: 'text',
          content: 'NgZone wraps the entire Angular application and provides two main zones',
        },
        {
          type: 'bullet',
          content: 'Outer Zone (also called Parent Zone):',
          subItems: [
            'Use this zone by calling the ngZone.runOutsideAngular() function',
            'Example: drag and drop operations',
            'Code runs outside Angular\'s change detection',
            'Better performance for frequent updates',
          ],
        },
        {
          type: 'bullet',
          content: 'Inner Zone (also called Angular Zone):',
          subItems: [
            'Default zone where Angular code runs',
            'Automatically triggers change detection',
            'All component code runs here by default',
            'Use ngZone.run() to explicitly run code here',
          ],
        },
        {
          type: 'highlight',
          content: 'NgZone wraps your entire Angular application and manages these two zones!',
        },
      ],
      diagram: {
        type: 'ngzone-wrapper',
        title: 'NgZone wraps Angular app',
        animated: true,
      },
      codeExample: {
        language: 'typescript',
        title: 'Using Different Zones',
        code: `import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-zone-demo',
  template: \`
    <div (mousemove)="onMouseMove($event)">
      Mouse position: {{ mouseX }}, {{ mouseY }}
    </div>
  \`
})
export class ZoneDemoComponent {
  mouseX = 0;
  mouseY = 0;
  
  constructor(private ngZone: NgZone) {}
  
  // ❌ Bad: Runs in Angular Zone - triggers CD on every mousemove
  onMouseMoveBad(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
  
  // ✅ Good: Runs outside Angular Zone - no CD triggered
  onMouseMove(event: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      
      // Update DOM manually or run in Angular zone when needed
      if (this.mouseX > 500) {
        this.ngZone.run(() => {
          // This will trigger change detection
          console.log('Mouse crossed threshold!');
        });
      }
    });
  }
}`,
        explanation: 'Use runOutsideAngular() for performance-critical operations that don\'t need change detection',
      },
    },
    {
      id: 'default-strategy',
      title: 'Default Change Detection Strategy',
      content: [
        {
          type: 'text',
          content:
            'The default strategy checks every component in the tree on every change detection cycle',
        },
        {
          type: 'comparison',
          content: 'Performance implications:',
          comparison: {
            before: 'Simple to understand and use - no configuration needed',
            after: 'Can be slow with large component trees - checks everything every time',
          },
        },
        {
          type: 'bullet',
          content: 'Default strategy behavior:',
          subItems: [
            'Checks all components from root to leaves',
            'Compares all template bindings',
            'Updates DOM for any changes found',
            'Runs on every async operation',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Default Strategy in Action',
        code: `@Component({
  // No changeDetection specified = ChangeDetectionStrategy.Default
  template: \`
    <div>{{ expensiveCalculation() }}</div>
    <child-component [data]="data"></child-component>
  \`
})
export class ParentComponent {
  data = { value: 1 };
  
  expensiveCalculation() {
    console.log('Expensive calculation running!');
    return this.data.value * 1000;
  }
}`,
        explanation: 'expensiveCalculation() runs on every change detection cycle!',
      },
    },
    {
      id: 'angular4-onpush',
      title: 'Angular 4 & OnPush Strategy (2017)',
      subtitle: 'Performance Optimization Arrives',
      content: [
        {
          type: 'text',
          content: 'Angular 4 popularized OnPush strategy for performance optimization',
        },
        {
          type: 'bullet',
          content: 'OnPush triggers change detection only when:',
          subItems: [
            'Input properties change (reference change)',
            'Event is emitted from the component',
            'Manual trigger via ChangeDetectorRef',
            'Async pipe receives new value',
          ],
        },
        {
          type: 'highlight',
          content: 'OnPush requires immutable data patterns for optimal performance',
        },
        {
          type: 'code-demo',
          content: 'OnPush Strategy Component Tree',
        },
      ],
      diagram: {
        type: 'onpush-triggers',
        title: 'OnPush Change Detection Triggers',
        animated: true,
      },
      codeExample: {
        language: 'typescript',
        title: 'OnPush Strategy Implementation',
        code: `@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="onClick()">Click me</button>
    </div>
  \`
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() userClick = new EventEmitter<User>();
  
  onClick() {
    this.userClick.emit(this.user); // Triggers change detection
  }
}

// Usage - reference change triggers CD
this.user = { ...this.user, name: 'New Name' };`,
        explanation: 'OnPush only checks when inputs change by reference or events occur',
      },
    },
    {
      id: 'immutability-patterns',
      title: 'Immutability Patterns with OnPush',
      content: [
        {
          type: 'text',
          content: 'OnPush strategy works best with immutable data patterns',
        },
        {
          type: 'comparison',
          content: 'Mutable vs Immutable updates:',
          comparison: {
            before: 'user.name = "New Name" // Won\'t trigger OnPush',
            after: 'user = {...user, name: "New Name"} // Will trigger OnPush',
          },
        },
      ],
      diagram: {
        type: 'immutability-patterns',
        title: 'Mutation vs Immutable Updates',
        animated: true,
      },
      codeExample: {
        language: 'typescript',
        title: 'Immutable Update Patterns',
        code: `// ❌ Mutable updates (won't work with OnPush)
updateUserMutable() {
  this.user.name = 'New Name';
  this.users.push(newUser);
  this.settings.theme = 'dark';
}

// ✅ Immutable updates (works with OnPush)
updateUserImmutable() {
  this.user = { ...this.user, name: 'New Name' };
  this.users = [...this.users, newUser];
  this.settings = { ...this.settings, theme: 'dark' };
}

// ✅ Using Array methods that return new arrays
addUser() {
  this.users = this.users.concat(newUser);
}

removeUser(id: string) {
  this.users = this.users.filter(user => user.id !== id);
}`,
        explanation: 'Immutable patterns ensure OnPush detects changes correctly',
      },
    },
    {
      id: 'async-pipe',
      title: 'Async Pipe & Change Detection',
      content: [
        {
          type: 'text',
          content: 'The async pipe is a powerful tool that automatically triggers change detection',
        },
        {
          type: 'bullet',
          content: 'Async pipe benefits:',
          subItems: [
            'Automatically subscribes and unsubscribes',
            'Triggers change detection on new values',
            'Works perfectly with OnPush strategy',
            'Handles null/undefined values gracefully',
          ],
        },
      ],
      diagram: {
        type: 'async-pipe-flow',
        title: 'Async Pipe Flow',
        animated: true,
      },
      codeExample: {
        language: 'typescript',
        title: 'Async Pipe with OnPush',
        code: `@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
    
    <div>Total: {{ (users$ | async)?.length }}</div>
    
    <div *ngIf="loading$ | async">Loading...</div>
  \`
})
export class UserListComponent {
  users$ = this.userService.getUsers();
  loading$ = this.userService.loading$;
  
  constructor(private userService: UserService) {}
}`,
        explanation: 'Async pipe automatically triggers change detection when observables emit',
      },
    },
    {
      id: 'manual-cd',
      title: 'Manual Change Detection Control',
      content: [
        {
          type: 'text',
          content: 'Sometimes you need fine-grained control over when change detection runs',
        },
        {
          type: 'bullet',
          content: 'ChangeDetectorRef methods:',
          subItems: [
            'detectChanges() - Run change detection once',
            'markForCheck() - Mark for next CD cycle',
            'detach() - Remove from CD tree',
            'reattach() - Add back to CD tree',
          ],
        },
      ],
      diagram: {
        type: 'manual-cd-methods',
        title: 'ChangeDetectorRef Methods',
        animated: true,
      },
      codeExample: {
        language: 'typescript',
        title: 'Manual Change Detection Control',
        code: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualCDComponent {
  data: any;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  // Immediate change detection
  updateDataNow() {
    this.data = newData;
    this.cdr.detectChanges();
  }
  
  // Mark for next cycle
  updateDataLater() {
    this.data = newData;
    this.cdr.markForCheck();
  }
  
  // Detach from change detection
  pauseCD() {
    this.cdr.detach();
  }
  
  // Reattach to change detection
  resumeCD() {
    this.cdr.reattach();
  }
}`,
        explanation: 'ChangeDetectorRef gives you precise control over change detection timing',
      },
    },
    {
      id: 'angular9-ivy',
      title: 'Angular 9 & Ivy Renderer (2020)',
      subtitle: 'Revolutionary Rendering Engine',
      content: [
        {
          type: 'text',
          content: 'Ivy brought significant improvements to change detection performance',
        },
        {
          type: 'bullet',
          content: 'Ivy improvements:',
          subItems: [
            'Smaller bundle sizes',
            'Faster change detection',
            'Better tree-shaking',
            'Incremental compilation',
            'Improved debugging experience',
          ],
        },
        {
          type: 'highlight',
          content: 'Ivy made change detection more predictable and debuggable',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: "Ivy's Impact on Change Detection",
        code: `// Before Ivy - larger bundles, slower CD
@Component({
  template: \`<div>{{ getValue() }}</div>\`
})
export class BeforeIvyComponent {
  getValue() {
    return this.expensiveOperation();
  }
}

// With Ivy - optimized change detection
@Component({
  template: \`<div>{{ value }}</div>\`
})
export class IvyOptimizedComponent {
  value = this.expensiveOperation();
  
  // Ivy can better optimize when to call this
  updateValue() {
    this.value = this.expensiveOperation();
  }
}`,
        explanation:
          'Ivy optimizes change detection by better understanding component dependencies',
      },
    },
    {
      id: 'angular14-signals-preview',
      title: 'Angular 14 - Signals Preview (2022)',
      subtitle: 'The Beginning of a New Era',
      content: [
        {
          type: 'text',
          content: 'Angular 14 introduced experimental signals - a new reactive primitive',
        },
        {
          type: 'bullet',
          content: 'Signals preview features:',
          subItems: [
            'Fine-grained reactivity',
            'Automatic dependency tracking',
            'Better performance than Zone.js',
            'Simplified state management',
          ],
        },
        {
          type: 'highlight',
          content:
            'Signals promised to solve the performance issues of traditional change detection',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Early Signals API (Experimental)',
        code: `// Angular 14 experimental signals
import { signal, computed, effect } from '@angular/core';

@Component({
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
  \`
})
export class SignalsPreviewComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
  
  increment() {
    this.count.set(this.count() + 1);
  }
}`,
        explanation: 'Early signals showed the potential for fine-grained reactivity',
      },
    },
    {
      id: 'signals-stable',
      title: 'Angular 16-17 - Signals Stable (2023)',
      subtitle: 'Signals Become Production Ready',
      content: [
        {
          type: 'text',
          content: 'Angular 16-17 made signals stable and production-ready',
        },
        {
          type: 'bullet',
          content: 'Stable signals features:',
          subItems: [
            'signal() - writable signals',
            'computed() - derived values',
            'effect() - side effects',
            'Signal inputs and queries',
            'Better TypeScript support',
          ],
        },
        {
          type: 'code-demo',
          content: 'Signals Flow Diagram',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Stable Signals API',
        code: `import { Component, signal, computed, effect, input } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <h2>{{ title() }}</h2>
    <p>Count: {{ count() }}</p>
    <p>Status: {{ status() }}</p>
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
  \`
})
export class CounterComponent {
  // Signal input
  title = input<string>('Counter');
  
  // Writable signal
  count = signal(0);
  
  // Computed signal
  status = computed(() => {
    const value = this.count();
    return value > 0 ? 'Positive' : value < 0 ? 'Negative' : 'Zero';
  });
  
  constructor() {
    // Effect for side effects
    effect(() => {
      console.log(\`Count is now: \${this.count()}\`);
      if (this.count() > 10) {
        console.log('High count detected!');
      }
    });
  }
  
  increment() {
    this.count.update(value => value + 1);
  }
  
  decrement() {
    this.count.set(this.count() - 1);
  }
}`,
        explanation: 'Stable signals provide a complete reactive programming model',
      },
    },
    {
      id: 'signals-vs-zone',
      title: 'Signals vs Zone.js Comparison',
      content: [
        {
          type: 'comparison',
          content: 'Performance comparison:',
          comparison: {
            before: 'Zone.js: Checks entire component tree on every async operation',
            after: 'Signals: Only updates components that use changed signals',
          },
        },
        {
          type: 'bullet',
          content: 'Key differences:',
          subItems: [
            'Zone.js: Global, automatic, but can be inefficient',
            'Signals: Granular, explicit, highly efficient',
            'Zone.js: Harder to debug and predict',
            'Signals: Clear dependency tracking and updates',
            'Zone.js: Works with any code pattern',
            'Signals: Requires adopting signal-based patterns',
          ],
        },
        {
          type: 'code-demo',
          content: 'Zone.js vs Signals Comparison',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Zone.js vs Signals Performance',
        code: `// Zone.js approach - checks everything
@Component({
  template: \`
    <div>{{ user.name }}</div>
    <div>{{ user.email }}</div>
    <expensive-component [data]="expensiveData"></expensive-component>
  \`
})
export class ZoneComponent {
  user = { name: 'John', email: 'john@example.com' };
  expensiveData = this.calculateExpensiveData();
  
  updateUser() {
    this.user.name = 'Jane'; // Triggers CD for entire tree
  }
}

// Signals approach - surgical updates
@Component({
  template: \`
    <div>{{ user().name }}</div>
    <div>{{ user().email }}</div>
    <expensive-component [data]="expensiveData()"></expensive-component>
  \`
})
export class SignalsComponent {
  user = signal({ name: 'John', email: 'john@example.com' });
  expensiveData = computed(() => this.calculateExpensiveData());
  
  updateUser() {
    this.user.update(u => ({ ...u, name: 'Jane' })); // Only updates user display
  }
}`,
        explanation: 'Signals provide surgical updates instead of tree-wide change detection',
      },
    },
    {
      id: 'signal-inputs',
      title: 'Signal Inputs & Queries',
      content: [
        {
          type: 'text',
          content: 'Angular 17+ introduced signal-based inputs and queries for better reactivity',
        },
        {
          type: 'bullet',
          content: 'Signal-based APIs:',
          subItems: [
            'input() - Signal inputs',
            'viewChild() - Signal view queries',
            'viewChildren() - Signal view children queries',
            'contentChild() - Signal content queries',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Signal Inputs and Queries',
        code: `import { Component, input, viewChild, ElementRef, computed } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: \`
    <div #container>
      <h2>{{ displayName() }}</h2>
      <p>Age: {{ user().age }}</p>
      <input #nameInput [value]="user().name" (input)="updateName($event)">
    </div>
  \`
})
export class UserProfileComponent {
  // Signal input - automatically reactive
  user = input.required<{ name: string; age: number }>();
  
  // Signal view child query
  container = viewChild<ElementRef>('container');
  nameInput = viewChild<ElementRef>('nameInput');
  
  // Computed based on signal input
  displayName = computed(() => {
    const user = this.user();
    return \`\${user.name} (\${user.age} years old)\`;
  });
  
  updateName(event: Event) {
    const target = event.target as HTMLInputElement;
    // Update parent component through output or service
  }
  
  ngAfterViewInit() {
    // Signal queries are available immediately
    console.log('Container:', this.container()?.nativeElement);
  }
}`,
        explanation: 'Signal inputs and queries provide reactive access to component data',
      },
    },
    {
      id: 'angular18-material3',
      title: 'Angular 18 - Material 3 & Signals Integration',
      content: [
        {
          type: 'text',
          content: 'Angular 18 brought better signals integration across the ecosystem',
        },
        {
          type: 'bullet',
          content: 'Angular 18 improvements:',
          subItems: [
            'Material 3 design system',
            'Better signals performance',
            'Improved developer experience',
            'Enhanced debugging tools',
            'Hybrid rendering improvements',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Angular 18 Signals Best Practices',
        code: `import { Component, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-dashboard',
  template: \`
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ title() }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Total Items: {{ totalItems() }}</p>
        <p>Status: {{ loadingStatus() }}</p>
        <mat-progress-bar *ngIf="isLoading()" mode="indeterminate"></mat-progress-bar>
      </mat-card-content>
    </mat-card>
  \`
})
export class DataDashboardComponent {
  private http = inject(HttpClient);
  
  title = signal('Data Dashboard');
  data = signal<any[]>([]);
  isLoading = signal(false);
  
  totalItems = computed(() => this.data().length);
  
  loadingStatus = computed(() => {
    if (this.isLoading()) return 'Loading...';
    return \`Loaded \${this.totalItems()} items\`;
  });
  
  constructor() {
    // Effect to log data changes
    effect(() => {
      console.log(\`Data updated: \${this.totalItems()} items\`);
    });
    
    this.loadData();
  }
  
  async loadData() {
    this.isLoading.set(true);
    try {
      const result = await this.http.get<any[]>('/api/data').toPromise();
      this.data.set(result || []);
    } finally {
      this.isLoading.set(false);
    }
  }
}`,
        explanation:
          'Angular 18 provides seamless integration between signals and Material components',
      },
    },
    {
      id: 'zoneless-cd',
      title: 'Angular 19-20 - Zoneless Change Detection',
      subtitle: 'The Future is Here',
      content: [
        {
          type: 'text',
          content: 'Angular 19-20 introduced experimental zoneless change detection',
        },
        {
          type: 'bullet',
          content: 'Zoneless benefits:',
          subItems: [
            'No Zone.js dependency',
            'Smaller bundle size',
            'Better performance',
            'Signals-first approach',
            'Easier debugging',
            'Better integration with other frameworks',
          ],
        },
        {
          type: 'highlight',
          content: 'Zoneless is the future of Angular change detection!',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Zoneless Configuration',
        code: `// app.config.ts - Angular 20 Zoneless Setup
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable zoneless change detection
    provideExperimentalZonelessChangeDetection(),
    // Other providers...
  ]
};

// Component optimized for zoneless
@Component({
  selector: 'app-zoneless-demo',
  template: \`
    <h2>{{ title() }}</h2>
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">{{ buttonText() }}</button>
  \`
})
export class ZonelessDemoComponent {
  title = signal('Zoneless Demo');
  count = signal(0);
  
  buttonText = computed(() => \`Clicked \${this.count()} times\`);
  
  increment() {
    this.count.update(c => c + 1);
  }
}`,
        explanation: 'Zoneless change detection relies on signals for reactivity',
      },
    },
    {
      id: 'migration-strategy',
      title: 'Migration Strategy: Zone.js to Zoneless',
      content: [
        {
          type: 'text',
          content: 'Migrating from Zone.js to zoneless requires a strategic approach',
        },
        {
          type: 'bullet',
          content: 'Migration steps:',
          subItems: [
            '1. Convert properties to signals',
            '2. Replace @Input with input()',
            '3. Use signal-based queries',
            '4. Replace async pipe with signals',
            '5. Handle manual change detection',
            '6. Test thoroughly',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Migration Example',
        code: `// Before - Zone.js based
@Component({
  template: \`
    <div>{{ user.name }}</div>
    <div>{{ computedValue }}</div>
  \`
})
export class OldComponent {
  @Input() user!: User;
  
  get computedValue() {
    return this.user.name.toUpperCase();
  }
  
  updateUser() {
    this.user = { ...this.user, name: 'New Name' };
  }
}

// After - Signals based (Zoneless ready)
@Component({
  template: \`
    <div>{{ user().name }}</div>
    <div>{{ computedValue() }}</div>
  \`
})
export class NewComponent {
  user = input.required<User>();
  
  computedValue = computed(() => this.user().name.toUpperCase());
  
  updateUser() {
    // Signal inputs are read-only, emit event to parent
    this.userChange.emit({ ...this.user(), name: 'New Name' });
  }
  
  @Output() userChange = new EventEmitter<User>();
}`,
        explanation:
          'Migration involves converting properties to signals and inputs to signal inputs',
      },
    },
    {
      id: 'performance-comparison',
      title: 'Performance: Zone.js vs Signals vs Zoneless',
      content: [
        {
          type: 'text',
          content: "Let's compare the performance characteristics of each approach",
        },
        {
          type: 'bullet',
          content: 'Performance metrics:',
          subItems: [
            'Zone.js: Good for small apps, can struggle with large component trees',
            'Signals with Zone.js: Better performance, still has Zone.js overhead',
            'Zoneless with Signals: Best performance, minimal overhead',
            'Bundle size: Zoneless is smallest (no Zone.js)',
            'Memory usage: Signals use less memory than traditional CD',
          ],
        },
        {
          type: 'code-demo',
          content: 'Performance Comparison Chart',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Performance Comparison Demo',
        code: `// Performance test component
@Component({
  template: \`
    <div>
      <h3>{{ strategy }}</h3>
      <p>Updates: {{ updateCount() }}</p>
      <p>Render time: {{ renderTime() }}ms</p>
      <button (click)="performUpdate()">Update</button>
    </div>
  \`
})
export class PerformanceTestComponent {
  strategy = 'Zoneless with Signals';
  updateCount = signal(0);
  renderTime = signal(0);
  
  performUpdate() {
    const start = performance.now();
    
    // Simulate complex update
    for (let i = 0; i < 1000; i++) {
      this.updateCount.update(count => count + 1);
    }
    
    const end = performance.now();
    this.renderTime.set(end - start);
  }
}

// Results (approximate):
// Zone.js: ~50-100ms for 1000 updates
// Signals + Zone.js: ~20-40ms for 1000 updates  
// Zoneless + Signals: ~5-15ms for 1000 updates`,
        explanation: 'Zoneless with signals provides the best performance characteristics',
      },
    },
    {
      id: 'debugging-tools',
      title: 'Debugging Change Detection',
      content: [
        {
          type: 'text',
          content: 'Angular provides excellent tools for debugging change detection issues',
        },
        {
          type: 'bullet',
          content: 'Debugging tools:',
          subItems: [
            'Angular DevTools - visualize component tree and change detection',
            'ng.profiler.timeChangeDetection() - measure CD performance',
            'Signal debugging in console',
            'Zone.js debugging options',
            'Performance profiler integration',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Debugging Techniques',
        code: `// Enable change detection profiling
import { enableProdMode } from '@angular/core';

if (!environment.production) {
  // Enable debugging
  (window as any).ng.profiler.timeChangeDetection();
}

// Component with debugging
@Component({
  template: \`<div>{{ debugInfo() }}</div>\`
})
export class DebuggingComponent {
  count = signal(0);
  
  debugInfo = computed(() => {
    console.log('Computing debug info, count:', this.count());
    return \`Count: \${this.count()}, Updated: \${new Date().toLocaleTimeString()}\`;
  });
  
  constructor() {
    // Debug effect
    effect(() => {
      console.log('Effect triggered, count:', this.count());
    });
  }
  
  increment() {
    console.log('Before update:', this.count());
    this.count.update(c => c + 1);
    console.log('After update:', this.count());
  }
}

// Browser console debugging
// ng.getComponent($0) - get component instance
// ng.getContext($0) - get component context
// ng.getDirectives($0) - get directives on element`,
        explanation: 'Use Angular DevTools and console methods to debug change detection',
      },
    },
    {
      id: 'best-practices',
      title: 'Change Detection Best Practices',
      content: [
        {
          type: 'text',
          content: 'Follow these best practices for optimal change detection performance',
        },
        {
          type: 'bullet',
          content: 'Best practices:',
          subItems: [
            'Use OnPush strategy when possible',
            'Prefer signals over traditional properties',
            'Use computed() for derived values',
            'Avoid function calls in templates',
            'Use trackBy functions in *ngFor',
            'Consider zoneless for new applications',
            'Profile and measure performance regularly',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Best Practices Example',
        code: `@Component({
  selector: 'app-best-practices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- ✅ Good: Using signals -->
    <div>{{ userName() }}</div>
    <div>{{ userStatus() }}</div>
    
    <!-- ✅ Good: trackBy function -->
    <div *ngFor="let item of items(); trackBy: trackByFn">
      {{ item.name }}
    </div>
    
    <!-- ❌ Avoid: Function calls in templates -->
    <!-- <div>{{ getExpensiveValue() }}</div> -->
    
    <!-- ✅ Good: Use computed instead -->
    <div>{{ expensiveValue() }}</div>
  \`
})
export class BestPracticesComponent {
  user = signal({ name: 'John', status: 'active' });
  items = signal([{ id: 1, name: 'Item 1' }]);
  
  // ✅ Computed for derived values
  userName = computed(() => this.user().name);
  userStatus = computed(() => this.user().status.toUpperCase());
  expensiveValue = computed(() => this.performExpensiveCalculation());
  
  // ✅ TrackBy function
  trackByFn(index: number, item: any) {
    return item.id;
  }
  
  // ✅ Private method for expensive calculations
  private performExpensiveCalculation() {
    // Expensive operation here
    return 'Calculated value';
  }
  
  // ✅ Update using signals
  updateUser(name: string) {
    this.user.update(user => ({ ...user, name }));
  }
}`,
        explanation: 'Following best practices ensures optimal change detection performance',
      },
    },
    {
      id: 'future-outlook',
      title: 'The Future of Angular Change Detection',
      content: [
        {
          type: 'text',
          content:
            "Angular's change detection continues to evolve toward better performance and developer experience",
        },
        {
          type: 'bullet',
          content: "What's coming:",
          subItems: [
            'Zoneless becomes the default',
            'Even better signals performance',
            'Improved debugging tools',
            'Better integration with web standards',
            'Simplified migration tools',
            'Enhanced developer experience',
          ],
        },
        {
          type: 'highlight',
          content: 'The future is signals-first, zoneless, and highly performant!',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Future Angular Component',
        code: `// Future Angular component (conceptual)
@Component({
  selector: 'app-future',
  // Zoneless is default, no need to specify
  template: \`
    <div>{{ greeting() }}</div>
    <input [model]="userName">
    <button (click)="save()">Save</button>
  \`
})
export class FutureComponent {
  // Signal inputs are the default
  title = input<string>('Hello');
  
  // Two-way binding with signals
  userName = signal('');
  
  // Computed values
  greeting = computed(() => \`\${this.title()}, \${this.userName()}!\`);
  
  // Effects are more powerful
  saveEffect = effect(() => {
    if (this.userName().length > 3) {
      this.autoSave();
    }
  });
  
  save() {
    // Save logic
  }
  
  private autoSave() {
    // Auto-save logic
  }
}`,
        explanation: 'Future Angular will be signals-first with even better developer experience',
      },
    },
    {
      id: 'conclusion',
      title: 'Conclusion: The Evolution Continues',
      content: [
        {
          type: 'text',
          content:
            "Angular's change detection has evolved tremendously from Angular 2 to Angular 20",
        },
        {
          type: 'timeline',
          content: 'The journey:',
          subItems: [
            'Angular 2: Zone.js and default change detection',
            'Angular 4+: OnPush strategy for performance',
            'Angular 9: Ivy renderer improvements',
            'Angular 14: Experimental signals',
            'Angular 16-17: Stable signals',
            'Angular 18: Better signals integration',
            'Angular 19-20: Zoneless change detection',
          ],
        },
        {
          type: 'highlight',
          content:
            'From global change detection to surgical updates - Angular keeps getting better!',
        },
      ],
    },
  ],
};

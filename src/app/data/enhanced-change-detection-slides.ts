import { PresentationData } from '../models/slide.interface';

export const enhancedChangeDetectionPresentation: PresentationData = {
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
          content:
            'Welcome to the complete guide of Angular Change Detection evolution! This presentation covers the journey from Zone.js-based change detection to the modern signals-based approach.',
        },
        {
          type: 'bullet',
          content: "What we'll explore together:",
          subItems: [
            'The evolution from Angular 2 to Angular 20',
            'Understanding Zone.js and its role in change detection',
            'OnPush strategy and performance optimization techniques',
            'Signals - The revolutionary approach to reactivity',
            'Zoneless change detection and its benefits',
            'Migration strategies and best practices',
            'Future roadmap of Angular change detection',
          ],
        },
      ],
      problemSolution: {
        problem:
          "Developers struggle to understand Angular's change detection mechanism, leading to performance issues and unpredictable behavior in applications.",
        solution:
          "This comprehensive guide provides a structured learning path through Angular's change detection evolution, explaining each concept with practical examples and visualizations.",
        benefits: [
          'Clear understanding of change detection concepts',
          'Improved application performance',
          'Better debugging capabilities',
          'Future-ready development skills',
        ],
      },
    },
    {
      id: 'what-is-cd',
      title: 'What is Change Detection?',
      content: [
        {
          type: 'text',
          content:
            "Change Detection is Angular's fundamental mechanism that keeps your application's UI synchronized with the underlying data state.",
        },
        {
          type: 'highlight',
          content:
            "It's the process of detecting when application state changes and updating the DOM to reflect those changes efficiently.",
        },
        {
          type: 'bullet',
          content: 'Core responsibilities of Change Detection:',
          subItems: [
            'Monitor data changes across all components',
            'Determine which parts of the UI need updates',
            'Execute DOM updates in the correct order',
            'Optimize performance through strategic update cycles',
            'Handle asynchronous operations seamlessly',
            'Maintain consistency between model and view',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Basic Change Detection in Action',
        code: `@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter-container">
      <h2>Counter: {{ counter }}</h2>
      <p>Status: {{ getStatus() }}</p>
      <button (click)="increment()">Increment</button>
      <button (click)="reset()">Reset</button>
    </div>
  \`
})
export class CounterComponent {
  counter = 0;
  
  increment() {
    this.counter++; // Change detection automatically updates DOM
    console.log('Counter updated:', this.counter);
  }
  
  reset() {
    this.counter = 0; // DOM reflects this change immediately
  }
  
  getStatus() {
    // This method runs on every change detection cycle
    return this.counter > 10 ? 'High' : 'Normal';
  }
}`,
        explanation:
          'When increment() or reset() is called, Angular automatically detects the change and updates all template bindings, including the counter display and status.',
      },
      problemSolution: {
        problem:
          'Without change detection, developers would need to manually update the DOM every time data changes, leading to complex, error-prone code.',
        solution:
          "Angular's change detection system automatically synchronizes the UI with data changes, providing a declarative programming model.",
        benefits: [
          'Automatic UI synchronization',
          'Declarative programming model',
          'Reduced boilerplate code',
          'Consistent data-view binding',
        ],
      },
    },
    {
      id: 'angular2-era',
      title: 'Angular 2 Era (2016)',
      subtitle: 'The Birth of Modern Change Detection',
      content: [
        {
          type: 'text',
          content:
            "Angular 2 introduced a revolutionary change detection system built on Zone.js, marking a significant departure from Angular 1's digest cycle.",
        },
        {
          type: 'timeline',
          content: 'Key innovations introduced in Angular 2:',
          subItems: [
            'Zone.js for automatic change detection triggering',
            'Unidirectional data flow (top-down)',
            'Component tree traversal strategy',
            'Default change detection strategy for all components',
            'Hierarchical component architecture',
            'Immutable change detection optimization',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Angular 2 Component with Zone.js Integration',
        code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="user-profile">
      <h2>{{ user.name }}</h2>
      <p>Email: {{ user.email }}</p>
      <p>Last Updated: {{ lastUpdated }}</p>
      <button (click)="updateUser()">Update Profile</button>
      <button (click)="fetchData()">Fetch Data</button>
    </div>
  \`
})
export class UserProfileComponent {
  user = { 
    name: 'John Doe', 
    email: 'john@example.com' 
  };
  lastUpdated = new Date().toLocaleString();
  
  updateUser() {
    // Zone.js automatically detects this synchronous change
    this.user.name = 'Jane Doe';
    this.lastUpdated = new Date().toLocaleString();
  }
  
  fetchData() {
    // Zone.js also handles asynchronous operations
    setTimeout(() => {
      this.user.email = 'jane@example.com';
      this.lastUpdated = new Date().toLocaleString();
    }, 1000);
  }
}`,
        explanation:
          'Zone.js automatically triggers change detection for both synchronous operations (updateUser) and asynchronous operations (setTimeout in fetchData), eliminating the need for manual triggering.',
      },
      problemSolution: {
        problem:
          "Angular 1's digest cycle was unpredictable, required manual triggering in many cases, and could lead to infinite digest loops.",
        solution:
          "Angular 2's Zone.js-based system provides automatic, predictable change detection that works with both sync and async operations.",
        benefits: [
          'Automatic change detection triggering',
          'Support for asynchronous operations',
          'Predictable unidirectional data flow',
          'Elimination of digest loops',
          'Better performance than Angular 1',
        ],
        implementation:
          'Zone.js patches browser APIs to know when asynchronous operations complete, automatically triggering change detection at the right time.',
      },
    },
    {
      id: 'zone-js-deep-dive',
      title: 'Zone.js - The Magic Behind the Scenes',
      content: [
        {
          type: 'text',
          content:
            'Zone.js is a library that patches browser APIs to provide execution context and automatic change detection triggering in Angular applications.',
        },
        {
          type: 'bullet',
          content: 'Browser APIs that Zone.js patches:',
          subItems: [
            'DOM Events (click, keyup, mouseover, etc.)',
            'HTTP Requests (XMLHttpRequest, fetch API)',
            'Timers (setTimeout, setInterval, requestAnimationFrame)',
            'Promises and async/await operations',
            'WebSocket connections',
            'Geolocation API calls',
            'File API operations',
          ],
        },
        {
          type: 'highlight',
          content:
            'Zone.js runs change detection for the ENTIRE component tree on every async operation, which can be inefficient for large applications.',
        },
        {
          type: 'code-demo',
          content: 'Zone.js Change Detection Flow',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Understanding Zone.js Patching',
        code: `// Without Zone.js - Manual change detection required
class ManualComponent {
  data = 'initial';
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  onClick() {
    this.data = 'clicked';
    this.cdr.detectChanges(); // Manual trigger required
  }
  
  fetchData() {
    fetch('/api/data').then(response => {
      this.data = response.data;
      this.cdr.detectChanges(); // Manual trigger required
    });
  }
}

// With Zone.js - Automatic change detection
class AutomaticComponent {
  data = 'initial';
  
  onClick() {
    this.data = 'clicked';
    // Zone.js automatically triggers change detection
  }
  
  async fetchData() {
    const response = await fetch('/api/data');
    this.data = await response.json();
    // Zone.js handles async operations automatically
  }
  
  setupTimer() {
    setInterval(() => {
      this.data = new Date().toISOString();
      // Zone.js detects timer callbacks
    }, 1000);
  }
}

// Zone.js execution flow
console.log('1. Event occurs (click, HTTP response, timer)');
console.log('2. Zone.js intercepts the event');
console.log('3. Your code executes');
console.log('4. Zone.js triggers change detection');
console.log('5. DOM updates automatically');`,
        explanation:
          'Zone.js eliminates the need for manual change detection by automatically detecting when asynchronous operations complete and triggering the change detection cycle.',
      },
      problemSolution: {
        problem:
          'Manual change detection was error-prone, required developers to remember when to trigger updates, and often led to missed updates or unnecessary triggers.',
        solution:
          'Zone.js provides automatic change detection by patching browser APIs and triggering updates when asynchronous operations complete.',
        benefits: [
          'Eliminates manual change detection calls',
          'Handles all types of async operations',
          'Provides consistent behavior across the app',
          'Reduces developer cognitive load',
        ],
        implementation:
          'Zone.js monkey-patches browser APIs at runtime, wrapping them with logic to track execution context and trigger change detection.',
      },
    },
    {
      id: 'default-strategy',
      title: 'Default Change Detection Strategy',
      content: [
        {
          type: 'text',
          content:
            'The default strategy checks every component in the application tree on every change detection cycle, ensuring consistency but potentially impacting performance.',
        },
        {
          type: 'comparison',
          content: 'Default Strategy Trade-offs:',
          comparison: {
            before:
              'Simple to use - no configuration needed, works with any code pattern, guaranteed consistency',
            after:
              'Can be slow with large component trees - checks everything every time, may cause performance issues in complex apps',
          },
        },
        {
          type: 'bullet',
          content: 'How Default Strategy works:',
          subItems: [
            'Starts from the root component',
            'Traverses the entire component tree top-down',
            'Checks all template bindings in every component',
            'Compares current values with previous values',
            'Updates DOM elements that have changed',
            'Runs on every async operation (events, HTTP, timers)',
            'Executes getter methods and computed properties repeatedly',
          ],
        },
        {
          type: 'code-demo',
          content: 'Default Strategy Component Tree',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Default Strategy Performance Impact',
        code: `@Component({
  selector: 'app-parent',
  // Default strategy (ChangeDetectionStrategy.Default) is implicit
  template: \`
    <div class="parent">
      <h2>Parent: {{ getParentData() }}</h2>
      <app-child [data]="childData"></app-child>
      <app-expensive-list [items]="items"></app-expensive-list>
    </div>
  \`
})
export class ParentComponent {
  childData = { value: 1 };
  items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));
  
  getParentData() {
    console.log('Parent getParentData() called'); // Runs on EVERY change detection
    return \`Parent data: \${Date.now()}\`;
  }
  
  updateChild() {
    this.childData.value++; // This triggers change detection for ENTIRE tree
  }
}

@Component({
  selector: 'app-expensive-list',
  template: \`
    <div>
      <h3>Expensive List ({{ getListSize() }} items)</h3>
      <div *ngFor="let item of items">
        {{ formatItem(item) }}
      </div>
    </div>
  \`
})
export class ExpensiveListComponent {
  @Input() items: any[] = [];
  
  getListSize() {
    console.log('ExpensiveList getListSize() called'); // Called on EVERY change detection
    return this.items.length;
  }
  
  formatItem(item: any) {
    console.log('formatItem called for:', item.id); // Called 1000 times per cycle!
    return \`\${item.name} - \${new Date().toLocaleTimeString()}\`;
  }
}`,
        explanation:
          "With default strategy, every method call in templates (getParentData, getListSize, formatItem) runs on every change detection cycle, even when their data hasn't changed. In this example, formatItem runs 1000 times per cycle!",
      },
      problemSolution: {
        problem:
          'Default change detection checks every component on every cycle, leading to performance issues in large applications with complex component trees.',
        solution:
          'Understanding the default strategy helps developers identify performance bottlenecks and choose appropriate optimization strategies.',
        benefits: [
          'Guaranteed data consistency',
          'No configuration required',
          'Works with any coding pattern',
          'Easy to understand and debug',
        ],
        implementation:
          'Angular traverses the component tree from root to leaves, checking all bindings and executing all template expressions in every component.',
      },
    },
    {
      id: 'angular4-onpush',
      title: 'Angular 4 & OnPush Strategy (2017)',
      subtitle: 'Performance Optimization Revolution',
      content: [
        {
          type: 'text',
          content:
            'Angular 4 popularized the OnPush strategy, providing a way to optimize change detection by reducing the number of checks performed.',
        },
        {
          type: 'bullet',
          content: 'OnPush strategy triggers change detection only when:',
          subItems: [
            'Input properties change by reference (not deep equality)',
            'An event is emitted from the component or its children',
            'Change detection is manually triggered via ChangeDetectorRef',
            'An async pipe receives a new value from an Observable',
            'A bound event handler is executed',
          ],
        },
        {
          type: 'highlight',
          content:
            'OnPush requires immutable data patterns and reference-based change detection for optimal performance.',
        },
        {
          type: 'code-demo',
          content: 'OnPush Strategy Component Tree',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'OnPush Strategy Implementation',
        code: `@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p>Posts: {{ user.posts.length }}</p>
      <button (click)="onEditClick()">Edit User</button>
      <button (click)="addPost()">Add Post</button>
    </div>
  \`
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() userEdit = new EventEmitter<User>();
  @Output() userUpdate = new EventEmitter<User>();
  
  onEditClick() {
    // Event emission triggers change detection for this component
    this.userEdit.emit(this.user);
  }
  
  addPost() {
    // ❌ This WON'T trigger change detection (mutating existing object)
    this.user.posts.push({ title: 'New Post', content: 'Content' });
    
    // ✅ This WILL trigger change detection (new reference)
    this.user = {
      ...this.user,
      posts: [...this.user.posts, { title: 'New Post', content: 'Content' }]
    };
    
    this.userUpdate.emit(this.user);
  }
}

// Parent component usage
@Component({
  template: \`
    <app-user-card 
      [user]="currentUser" 
      (userEdit)="editUser($event)"
      (userUpdate)="updateUser($event)">
    </app-user-card>
  \`
})
export class ParentComponent {
  currentUser: User = { name: 'John', email: 'john@example.com', posts: [] };
  
  updateUser(updatedUser: User) {
    // ✅ Reference change - triggers OnPush change detection
    this.currentUser = updatedUser;
  }
  
  editUserName(newName: string) {
    // ✅ Create new object reference for OnPush
    this.currentUser = { ...this.currentUser, name: newName };
  }
}`,
        explanation:
          'OnPush components only check for changes when inputs change by reference or when events are emitted. This dramatically reduces the number of change detection cycles.',
      },
      problemSolution: {
        problem:
          'Default change detection checks every component on every cycle, causing performance issues in applications with many components or complex templates.',
        solution:
          'OnPush strategy dramatically reduces change detection cycles by only checking components when their inputs change by reference or events occur.',
        benefits: [
          'Significant performance improvement',
          'Reduced CPU usage',
          'Predictable change detection behavior',
          'Forces better data architecture',
        ],
        implementation:
          'Set changeDetection: ChangeDetectionStrategy.OnPush in component decorator and ensure immutable data patterns.',
      },
    },
    {
      id: 'immutability-patterns',
      title: 'Immutability Patterns with OnPush',
      content: [
        {
          type: 'text',
          content:
            'OnPush strategy works optimally with immutable data patterns, where changes create new object references instead of modifying existing ones.',
        },
        {
          type: 'comparison',
          content: 'Mutable vs Immutable Updates:',
          comparison: {
            before: 'user.name = "New Name" // Mutation - OnPush won\'t detect this change',
            after: 'user = {...user, name: "New Name"} // New reference - OnPush will detect this',
          },
        },
        {
          type: 'bullet',
          content: 'Benefits of Immutable Patterns:',
          subItems: [
            'Predictable change detection behavior',
            'Better performance with OnPush strategy',
            'Easier debugging and testing',
            'Time-travel debugging capabilities',
            'Undo/redo functionality becomes trivial',
            'Better integration with state management libraries',
          ],
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Immutable Update Patterns & Techniques',
        code: `interface User {
  id: number;
  name: string;
  email: string;
  preferences: UserPreferences;
  posts: Post[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementComponent {
  users: User[] = [];
  
  // ❌ Mutable updates (won't work with OnPush)
  updateUserMutable(userId: number, newName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.name = newName; // Mutating existing object
      user.preferences.theme = 'dark'; // Nested mutation
      this.users.push(newUser); // Array mutation
    }
  }
  
  // ✅ Immutable updates (works perfectly with OnPush)
  updateUserImmutable(userId: number, newName: string) {
    this.users = this.users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            name: newName,
            preferences: { ...user.preferences, theme: 'dark' }
          }
        : user
    );
  }
  
  // ✅ Array operations with immutable patterns
  addUser(newUser: User) {
    this.users = [...this.users, newUser]; // Spread operator
    // Alternative: this.users = this.users.concat(newUser);
  }
  
  removeUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
  }
  
  updateUserPosts(userId: number, newPost: Post) {
    this.users = this.users.map(user =>
      user.id === userId
        ? {
            ...user,
            posts: [...user.posts, newPost] // Immutable array update
          }
        : user
    );
  }
  
  // ✅ Using utility libraries for complex updates
  updateUserWithImmer(userId: number, updates: Partial<User>) {
    this.users = produce(this.users, draft => {
      const user = draft.find(u => u.id === userId);
      if (user) {
        Object.assign(user, updates); // Immer handles immutability
      }
    });
  }
  
  // ✅ Nested object updates
  updateUserPreference(userId: number, key: string, value: any) {
    this.users = this.users.map(user =>
      user.id === userId
        ? {
            ...user,
            preferences: {
              ...user.preferences,
              [key]: value
            }
          }
        : user
    );
  }
}`,
        explanation:
          'Immutable patterns ensure OnPush components detect changes by creating new object references. Libraries like Immer can simplify complex immutable updates.',
      },
      problemSolution: {
        problem:
          "OnPush strategy requires reference changes to detect updates, but developers often use mutable operations that don't create new references.",
        solution:
          'Adopt immutable data patterns that create new object references for every change, ensuring OnPush components detect all updates.',
        benefits: [
          'Guaranteed OnPush compatibility',
          'Predictable change detection',
          'Better debugging experience',
          'Time-travel debugging support',
          'Easier state management',
        ],
        implementation:
          'Use spread operators, Object.assign, Array methods like map/filter, or libraries like Immer for complex updates.',
      },
    },
    {
      id: 'async-pipe',
      title: 'Async Pipe & Change Detection',
      content: [
        {
          type: 'text',
          content:
            'The async pipe is a powerful Angular feature that automatically manages subscriptions and triggers change detection when Observable values change.',
        },
        {
          type: 'bullet',
          content: 'Async pipe capabilities:',
          subItems: [
            'Automatically subscribes to Observables/Promises',
            'Automatically unsubscribes to prevent memory leaks',
            'Triggers change detection when new values arrive',
            'Works seamlessly with OnPush strategy',
            'Handles null/undefined values gracefully',
            'Supports both Observables and Promises',
            'Provides loading state management',
          ],
        },
        {
          type: 'highlight',
          content:
            'The async pipe is the recommended way to consume Observables in templates, especially with OnPush components.',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Async Pipe with OnPush Strategy',
        code: `@Component({
  selector: 'app-user-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="dashboard">
      <!-- Loading states with async pipe -->
      <div *ngIf="loading$ | async" class="loading">
        Loading users...
      </div>
      
      <!-- User list with async pipe -->
      <div *ngFor="let user of users$ | async" class="user-item">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <span class="status" [class.online]="user.isOnline">
          {{ user.isOnline ? 'Online' : 'Offline' }}
        </span>
      </div>
      
      <!-- Statistics with multiple async pipes -->
      <div class="stats">
        <p>Total Users: {{ (users$ | async)?.length || 0 }}</p>
        <p>Online Users: {{ onlineCount$ | async }}</p>
        <p>Last Updated: {{ lastUpdated$ | async | date:'medium' }}</p>
      </div>
      
      <!-- Error handling with async pipe -->
      <div *ngIf="error$ | async as error" class="error">
        Error: {{ error.message }}
      </div>
      
      <!-- Complex data transformations -->
      <div class="summary">
        <h4>User Summary</h4>
        <div *ngFor="let summary of userSummary$ | async">
          {{ summary.department }}: {{ summary.count }} users
        </div>
      </div>
    </div>
  \`
})
export class UserDashboardComponent implements OnInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<Error | null>;
  onlineCount$: Observable<number>;
  lastUpdated$: Observable<Date>;
  userSummary$: Observable<{department: string, count: number}[]>;
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    // Create reactive data streams
    this.users$ = this.userService.getUsers().pipe(
      shareReplay(1), // Cache the latest value
      catchError(error => {
        this.error$ = of(error);
        return of([]);
      })
    );
    
    this.loading$ = this.userService.loading$;
    
    // Derived observables
    this.onlineCount$ = this.users$.pipe(
      map(users => users.filter(user => user.isOnline).length)
    );
    
    this.lastUpdated$ = this.users$.pipe(
      map(() => new Date())
    );
    
    this.userSummary$ = this.users$.pipe(
      map(users => {
        const summary = new Map();
        users.forEach(user => {
          const count = summary.get(user.department) || 0;
          summary.set(user.department, count + 1);
        });
        return Array.from(summary.entries()).map(([department, count]) => ({
          department,
          count
        }));
      })
    );
    
    // Error handling
    this.error$ = this.userService.error$;
  }
}

// Service example
@Injectable()
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);
  
  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  getUsers(): Observable<User[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.errorSubject.next(error);
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }
}`,
        explanation:
          'The async pipe automatically handles subscriptions and triggers change detection in OnPush components. Multiple async pipes can be used safely, and the pipe handles loading states and errors gracefully.',
      },
      problemSolution: {
        problem:
          "Manual subscription management is error-prone, can cause memory leaks, and doesn't automatically trigger change detection in OnPush components.",
        solution:
          'The async pipe provides automatic subscription management and change detection triggering, making reactive programming safer and more efficient.',
        benefits: [
          'Automatic subscription management',
          'No memory leaks',
          'OnPush compatible',
          'Cleaner template code',
          'Built-in error handling',
        ],
        implementation:
          'Use | async in templates instead of manual subscriptions, and structure services to return Observables that the async pipe can consume.',
      },
    },
    {
      id: 'manual-cd',
      title: 'Manual Change Detection Control',
      content: [
        {
          type: 'text',
          content:
            'Sometimes you need fine-grained control over when change detection runs, especially when integrating with third-party libraries or optimizing performance.',
        },
        {
          type: 'bullet',
          content: 'ChangeDetectorRef methods for manual control:',
          subItems: [
            'detectChanges() - Run change detection immediately for this component and children',
            'markForCheck() - Mark component for checking in the next change detection cycle',
            'detach() - Remove component from the change detection tree',
            'reattach() - Add component back to the change detection tree',
            'checkNoChanges() - Check that no changes have occurred (dev mode only)',
          ],
        },
        {
          type: 'highlight',
          content:
            'Manual change detection is powerful but should be used sparingly and with careful consideration of performance implications.',
        },
      ],
      codeExample: {
        language: 'typescript',
        title: 'Advanced Manual Change Detection Patterns',
        code: `@Component({
  selector: 'app-performance-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="component">
      <h3>Performance Optimized Component</h3>
      <p>Counter: {{ counter }}</p>
      <p>Heavy Calculation: {{ heavyResult }}</p>
      <p>Third Party Data: {{ thirdPartyData }}</p>
      
      <button (click)="increment()">Increment</button>
      <button (click)="runHeavyCalculation()">Calculate</button>
      <button (click)="pauseDetection()">Pause Detection</button>
      <button (click)="resumeDetection()">Resume Detection</button>
    </div>
  \`
})
export class PerformanceOptimizedComponent implements OnInit, OnDestroy {
  counter = 0;
  heavyResult = 0;
  thirdPartyData = '';
  private isDetached = false;
  private thirdPartyLib: any;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit() {
    // Integration with third-party library
    this.initThirdPartyLibrary();
    
    // High-frequency updates that we want to control
    this.setupHighFrequencyUpdates();
  }
  
  increment() {
    this.counter++;
    // Immediate update for user interaction
    this.cdr.detectChanges();
  }
  
  runHeavyCalculation() {
    // Detach during heavy computation to prevent interruptions
    this.cdr.detach();
    
    setTimeout(() => {
      // Simulate heavy calculation
      this.heavyResult = this.performHeavyCalculation();
      
      // Reattach and trigger detection
      this.cdr.reattach();
      this.cdr.detectChanges();
    }, 100);
  }
  
  pauseDetection() {
    this.cdr.detach();
    this.isDetached = true;
    console.log('Change detection paused');
  }
  
  resumeDetection() {
    if (this.isDetached) {
      this.cdr.reattach();
      this.cdr.markForCheck();
      this.isDetached = false;
      console.log('Change detection resumed');
    }
  }
  
  private initThirdPartyLibrary() {
    // Example: Chart.js, D3, or any non-Angular library
    this.thirdPartyLib = new ThirdPartyLibrary();
    
    this.thirdPartyLib.onDataChange((newData: string) => {
      // Third-party library doesn't trigger Angular change detection
      this.thirdPartyData = newData;
      
      // Manually trigger detection
      this.cdr.detectChanges();
    });
  }
  
  private setupHighFrequencyUpdates() {
    // Example: WebSocket or real-time data
    const subscription = interval(100).subscribe(() => {
      // Update data
      this.updateRealtimeData();
      
      // Only mark for check instead of immediate detection
      // This batches updates with the next change detection cycle
      this.cdr.markForCheck();
    });
    
    // Store subscription for cleanup
    this.subscriptions.push(subscription);
  }
  
  private performHeavyCalculation(): number {
    // Simulate CPU-intensive work
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }
  
  private updateRealtimeData() {
    // Update component state with real-time data
    // This method is called frequently
  }
  
  // Advanced: Custom change detection strategy
  shouldUpdate(changes: SimpleChanges): boolean {
    // Custom logic to determine if component should update
    return Object.keys(changes).some(key => {
      const change = changes[key];
      return !change.isFirstChange() && 
             change.currentValue !== change.previousValue;
    });
  }
  
  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Clean up third-party library
    if (this.thirdPartyLib) {
      this.thirdPartyLib.destroy();
    }
  }
}

// Example of a service that provides manual control
@Injectable()
export class PerformanceService {
  private components = new Set<ChangeDetectorRef>();
  
  registerComponent(cdr: ChangeDetectorRef) {
    this.components.add(cdr);
  }
  
  unregisterComponent(cdr: ChangeDetectorRef) {
    this.components.delete(cdr);
  }
  
  // Batch update multiple components
  batchUpdate(updateFn: () => void) {
    // Detach all components
    this.components.forEach(cdr => cdr.detach());
    
    // Perform updates
    updateFn();
    
    // Reattach and trigger detection
    this.components.forEach(cdr => {
      cdr.reattach();
      cdr.detectChanges();
    });
  }
}`,
        explanation:
          'Manual change detection control allows fine-tuning of when components update, which is essential for performance optimization and third-party library integration.',
      },
      problemSolution: {
        problem:
          'Automatic change detection may be too frequent for performance-critical components or inadequate for third-party library integration.',
        solution:
          'ChangeDetectorRef provides methods to manually control when and how change detection runs for specific components.',
        benefits: [
          'Fine-grained performance control',
          'Third-party library integration',
          'Batched updates for efficiency',
          'Reduced unnecessary checks',
        ],
        implementation:
          'Inject ChangeDetectorRef and use its methods strategically, typically with OnPush strategy for maximum control.',
      },
    },
  ],
};

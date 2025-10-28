import { SlideData } from '../../models/slide.interface';

export const part4SignalsSlides: SlideData[] = [
  {
    id: 'signals-revolution',
    title: 'Part 4: The Revolution (Signals)',
    subtitle: 'Fine-Grained Reactive "Push" Model',
    content: [
      {
        type: 'text',
        content:
          'Signals represent a fundamental shift in Angular\'s reactivity model. Instead of Angular asking "has anything changed?", signals push notifications when they change, creating a fine-grained reactive system.',
      },
      {
        type: 'highlight',
        content:
          'Signals flip the model from "pull-based" change detection to "push-based" reactivity, creating a dependency graph independent of the component tree.',
      },
      {
        type: 'bullet',
        content: 'Problems signals solve:',
        subItems: [
          'Zone.js complexity and performance overhead',
          'OnPush requires careful immutability management',
          'Difficulty tracking reactive dependencies',
          'Pull-based model checks everything unnecessarily',
          'Complex state management patterns',
          'Debugging reactive flows is challenging',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Signals vs Traditional Approach',
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
  
  // Effects for side effects
  constructor() {
    effect(() => {
      console.log(\`User \${this.user().name} status changed to \${this.userStatus()}\`);
    });
  }
  
  updateUser(updates: Partial<User>) {
    // Direct signal update - all dependents update automatically
    this.user.set({ ...this.user(), ...updates });
    // No manual change detection needed!
    // userStatus() and lastUpdate() update automatically!
  }
}

// The key differences:
// 1. No ChangeDetectionStrategy.OnPush needed
// 2. No manual change detection triggering
// 3. No ngOnChanges lifecycle
// 4. Automatic dependency tracking
// 5. Computed values update automatically
// 6. Effects run when dependencies change`,
      explanation:
        'Signals eliminate the complexity of manual change detection and immutability management while providing automatic dependency tracking and updates.',
    },
    diagram: {
      type: 'signals-flow',
      title: 'Signals Reactive Flow',
      animated: false,
    },
    problemSolution: {
      problem:
        'Traditional change detection is pull-based, checking everything on every cycle, while OnPush requires complex immutability patterns and manual triggering.',
      solution:
        'Signals provide a push-based reactive system with automatic dependency tracking, eliminating the need for manual change detection and immutability management.',
      benefits: [
        'Automatic dependency tracking',
        'Fine-grained reactivity',
        'No manual change detection needed',
        'Simplified state management',
        'Better performance characteristics',
        'Clearer reactive relationships',
      ],
      implementation:
        'Use signal(), computed(), and effect() to create reactive data flows that automatically update when dependencies change.',
    },
  },
  {
    id: 'signals-fundamentals',
    title: 'Signals Fundamentals: signal(), computed(), effect()',
    subtitle: 'The Building Blocks of Reactive Programming',
    content: [
      {
        type: 'text',
        content:
          'Signals provide three fundamental primitives: signal() for writable state, computed() for derived values, and effect() for side effects. Understanding these building blocks is essential for reactive programming.',
      },
      {
        type: 'bullet',
        content: 'Core signal primitives:',
        subItems: [
          'signal(initialValue) - Creates writable reactive state',
          'computed(() => ...) - Creates derived read-only values',
          'effect(() => ...) - Executes side effects when dependencies change',
          'Automatic dependency tracking across all primitives',
          'Lazy evaluation and memoization for performance',
          'Glitch-free updates with topological sorting',
        ],
      },
      {
        type: 'highlight',
        content:
          'Signals use automatic dependency tracking - any signal read inside computed() or effect() becomes a dependency.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Complete Signals API Guide',
      code: `@Component({
  selector: 'app-signals-fundamentals',
  template: \`
    <div class="signals-demo">
      <!-- Reading signals in templates -->
      <h2>{{ title() }}</h2>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubled() }}</p>
      <p>Status: {{ status() }}</p>
      <p>History: {{ history().join(', ') }}</p>
      
      <!-- Signal updates through events -->
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
      <button (click)="reset()">Reset</button>
      <button (click)="setRandom()">Random</button>
    </div>
  \`
})
export class SignalsFundamentalsComponent {
  // ✅ 1. WRITABLE SIGNALS
  
  // Basic signal with initial value
  count = signal(0);
  title = signal('Signals Demo');
  
  // Signal with complex data
  user = signal({
    name: 'John',
    email: 'john@example.com',
    preferences: { theme: 'dark', notifications: true }
  });
  
  // Array signal
  history = signal<number[]>([]);
  
  // ✅ 2. COMPUTED SIGNALS (Derived State)
  
  // Simple computed - automatically updates when count changes
  doubled = computed(() => this.count() * 2);
  
  // Complex computed with multiple dependencies
  status = computed(() => {
    const currentCount = this.count();
    const currentHistory = this.history();
    
    if (currentCount === 0) return 'Zero';
    if (currentCount > 0) return 'Positive';
    return 'Negative';
  });
  
  // Computed with conditional logic
  summary = computed(() => {
    const count = this.count();
    const doubled = this.doubled(); // Can depend on other computed signals
    const historyLength = this.history().length;
    
    return \`Count: \${count}, Doubled: \${doubled}, History: \${historyLength} items\`;
  });
  
  // Expensive computed - only recalculates when dependencies change
  expensiveCalculation = computed(() => {
    console.log('Expensive calculation running...'); // Only logs when count changes
    const count = this.count();
    
    // Simulate expensive operation
    let result = 0;
    for (let i = 0; i < count * 1000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  });
  
  // ✅ 3. EFFECTS (Side Effects)
  
  constructor() {
    // Basic effect - runs when count changes
    effect(() => {
      console.log(\`Count changed to: \${this.count()}\`);
    });
    
    // Effect with multiple dependencies
    effect(() => {
      const count = this.count();
      const status = this.status();
      console.log(\`Status update: \${status} (count: \${count})\`);
    });
    
    // Effect with cleanup
    effect((onCleanup) => {
      const count = this.count();
      
      if (count > 10) {
        const timer = setInterval(() => {
          console.log('High count detected!');
        }, 1000);
        
        // Cleanup function - called when effect re-runs or component destroys
        onCleanup(() => {
          clearInterval(timer);
          console.log('Timer cleaned up');
        });
      }
    });
    
    // Conditional effect
    effect(() => {
      const user = this.user();
      
      if (user.preferences.notifications) {
        console.log(\`Notifications enabled for \${user.name}\`);
        // Setup notification listener
      }
    });
  }
  
  // ✅ 4. SIGNAL UPDATES
  
  // .set() - Replace entire value
  increment() {
    this.count.set(this.count() + 1);
    
    // Update history array
    this.history.set([...this.history(), this.count()]);
  }
  
  decrement() {
    this.count.set(this.count() - 1);
    this.history.set([...this.history(), this.count()]);
  }
  
  // .update() - Transform current value
  reset() {
    this.count.update(() => 0);
    this.history.update(hist => [...hist, 0]);
  }
  
  setRandom() {
    this.count.update(() => Math.floor(Math.random() * 100));
    this.history.update(hist => [...hist, this.count()]);
  }
  
  // Complex object updates
  updateUserName(newName: string) {
    this.user.update(currentUser => ({
      ...currentUser,
      name: newName
    }));
  }
  
  toggleNotifications() {
    this.user.update(currentUser => ({
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        notifications: !currentUser.preferences.notifications
      }
    }));
  }
  
  // ✅ 5. ADVANCED PATTERNS
  
  // Derived signals from other signals
  createDerivedSignals() {
    // Chain computed signals
    const base = signal(10);
    const doubled = computed(() => base() * 2);
    const quadrupled = computed(() => doubled() * 2);
    const formatted = computed(() => \`Value: \${quadrupled()}\`);
    
    return { base, doubled, quadrupled, formatted };
  }
  
  // Signal composition
  createComposedSignal() {
    const firstName = signal('John');
    const lastName = signal('Doe');
    const fullName = computed(() => \`\${firstName()} \${lastName()}\`);
    
    return { firstName, lastName, fullName };
  }
  
  // Conditional computed
  createConditionalComputed() {
    const showDetails = signal(false);
    const details = signal({ age: 30, city: 'New York' });
    
    const displayText = computed(() => {
      if (!showDetails()) return 'Details hidden';
      
      const { age, city } = details();
      return \`Age: \${age}, City: \${city}\`;
    });
    
    return { showDetails, details, displayText };
  }
}

// ✅ SIGNALS WITH SERVICES

@Injectable()
export class SignalsService {
  // Private writable signals
  private _users = signal<User[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  
  // Computed signals
  userCount = computed(() => this._users().length);
  activeUsers = computed(() => this._users().filter(u => u.isActive));
  usersByDepartment = computed(() => {
    const users = this._users();
    const groups = new Map<string, User[]>();
    
    users.forEach(user => {
      const dept = user.department;
      if (!groups.has(dept)) groups.set(dept, []);
      groups.get(dept)!.push(user);
    });
    
    return groups;
  });
  
  constructor(private http: HttpClient) {}
  
  async loadUsers() {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      const users = await this.http.get<User[]>('/api/users').toPromise();
      this._users.set(users || []);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this._loading.set(false);
    }
  }
  
  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }
  
  updateUser(id: number, updates: Partial<User>) {
    this._users.update(users =>
      users.map(user => user.id === id ? { ...user, ...updates } : user)
    );
  }
  
  removeUser(id: number) {
    this._users.update(users => users.filter(user => user.id !== id));
  }
}`,
      explanation:
        'Signals provide automatic dependency tracking, lazy evaluation, and memoization. Computed signals only recalculate when their dependencies change, and effects run automatically when dependencies update.',
    },
    problemSolution: {
      problem:
        'Traditional reactive programming requires manual dependency management, subscription handling, and change detection triggering.',
      solution:
        'Signals provide automatic dependency tracking with signal(), computed(), and effect() primitives that handle reactivity transparently.',
      benefits: [
        'Automatic dependency tracking',
        'Lazy evaluation and memoization',
        'No manual subscription management',
        'Glitch-free updates',
        'Clear reactive relationships',
        'Better performance characteristics',
      ],
      implementation:
        'Use signal() for state, computed() for derived values, and effect() for side effects. Dependencies are tracked automatically when signals are read.',
    },
  },
  {
    id: 'how-signals-work',
    title: 'How Do Signals Work?',
    subtitle: 'Understanding the Producer-Consumer Model',
    content: [
      {
        type: 'text',
        content:
          'Signals operate on a producer-consumer model where signals are producers that notify their consumers when they change. This creates a reactive dependency graph.',
      },
      {
        type: 'bullet',
        content: 'Signal architecture:',
        subItems: [
          'Producers: Signals that hold values and notify when changed',
          'Consumers: Computed signals and effects that depend on producers',
          'Dependency tracking: Automatic registration during signal reads',
          'Notification system: Push-based updates when producers change',
          'Topological sorting: Ensures correct update order',
          'Glitch-free updates: All dependent values update atomically',
        ],
      },
      {
        type: 'highlight',
        content:
          'Key insight: Signals create a dependency graph that is independent of the component tree, allowing for precise, targeted updates.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Signal Producer-Consumer Relationship',
      code: `// Understanding the Producer-Consumer Model

// PRODUCERS - Signals that produce values
const firstName = signal('John');        // Producer 1
const lastName = signal('Doe');          // Producer 2
const age = signal(25);                  // Producer 3

// CONSUMERS - Computed signals that consume from producers
const fullName = computed(() => {
  // This computed signal CONSUMES from firstName and lastName
  return \`\${firstName()} \${lastName()}\`;  // Reads create dependencies
});

const displayInfo = computed(() => {
  // This computed signal CONSUMES from fullName and age
  return \`\${fullName()} is \${age()} years old\`;
});

// EFFECTS - Side effect consumers
effect(() => {
  // This effect CONSUMES from displayInfo
  console.log('Display info changed:', displayInfo());
  // Any change to firstName, lastName, or age will trigger this effect
});

// DEPENDENCY GRAPH VISUALIZATION:
//
//     firstName ──┐
//                 ├── fullName ──┐
//     lastName ───┘              ├── displayInfo ──── effect()
//                                │
//     age ───────────────────────┘
//
// When firstName changes:
// 1. firstName notifies its consumers: [fullName]
// 2. fullName recalculates and notifies its consumers: [displayInfo]  
// 3. displayInfo recalculates and notifies its consumers: [effect]
// 4. effect executes with new value

// PRACTICAL EXAMPLE: Shopping Cart
@Component({
  selector: 'app-shopping-cart',
  template: \`
    <div>
      <h2>Shopping Cart</h2>
      <p>Items: {{ itemCount() }}</p>
      <p>Subtotal: \${{ subtotal() }}</p>
      <p>Tax: \${{ tax() }}</p>
      <p>Total: \${{ total() }}</p>
      <p>Status: {{ status() }}</p>
    </div>
  \`
})
export class ShoppingCartComponent {
  // PRODUCERS - Base signals
  items = signal([
    { name: 'Laptop', price: 999.99, quantity: 1 },
    { name: 'Mouse', price: 29.99, quantity: 2 }
  ]);
  
  taxRate = signal(0.08); // 8% tax
  
  // CONSUMERS - Computed signals that depend on producers
  itemCount = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  subtotal = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  
  tax = computed(() => this.subtotal() * this.taxRate());
  
  total = computed(() => this.subtotal() + this.tax());
  
  status = computed(() => {
    const count = this.itemCount();
    const totalAmount = this.total();
    
    if (count === 0) return 'Empty cart';
    if (totalAmount > 100) return 'Free shipping!';
    return 'Add more for free shipping';
  });
  
  // SIDE EFFECTS - Effects that react to changes
  constructor() {
    // Log when cart changes
    effect(() => {
      console.log(\`Cart updated: \${this.itemCount()} items, \$\${this.total()}\`);
    });
    
    // Save to localStorage when cart changes
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.items()));
    });
  }
  
  // UPDATING PRODUCERS - Triggers the reactive chain
  addItem(item: CartItem) {
    this.items.update(current => [...current, item]);
    // This single update triggers:
    // items -> itemCount, subtotal -> tax, total, status -> effects
  }
  
  updateTaxRate(rate: number) {
    this.taxRate.set(rate);
    // This triggers: taxRate -> tax -> total -> status -> effects
  }
}

// DEPENDENCY GRAPH FOR SHOPPING CART:
//
//     items ──┬── itemCount ──── status
//             │                   ↑
//             └── subtotal ──┬── tax ──┬── total ──┘
//                            │        │
//     taxRate ───────────────┘        └── effects
//
// The beauty: Change one signal, and only dependent computations update!`,
      explanation:
        'Signals create a reactive dependency graph where producers notify consumers of changes, enabling fine-grained updates without checking the entire component tree.',
    },
    diagram: {
      type: 'signal-dependency-graph',
      title: 'Signal Producer-Consumer Architecture',
      animated: true,
    },
    problemSolution: {
      problem:
        'Traditional change detection checks all bindings in all components, even when only specific data has changed, leading to unnecessary work.',
      solution:
        'Signals create a dependency graph where only the specific consumers of changed data are updated, providing surgical precision.',
      benefits: [
        'Only affected computations update',
        'Automatic dependency tracking',
        'Independent of component tree',
        'Glitch-free atomic updates',
      ],
      implementation:
        'Use signal() for base state, computed() for derived values, and effect() for side effects to build reactive data flows.',
    },
  },
  {
    id: 'no-async-pipe-needed',
    title: 'No Need async Pipe Anymore 🎉',
    subtitle: 'Signals Bypass Zone.js for Async Operations',
    content: [
      {
        type: 'text',
        content:
          'With signals, you no longer need the async pipe for handling asynchronous data. Signals provide a more direct and efficient way to handle reactive data without Zone.js overhead.',
      },
      {
        type: 'bullet',
        content: 'Benefits of signals over async pipe:',
        subItems: [
          'No Zone.js dependency for signal updates',
          'Direct subscription management built-in',
          'Better performance with targeted updates',
          'Cleaner template syntax without pipe',
          'Automatic memory management',
          'Synchronous access to current values',
        ],
      },
      {
        type: 'highlight',
        content:
          'Signals update the component tree directly through the dependency graph, bypassing Zone.js entirely for reactive updates.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Signals vs Async Pipe Comparison',
      code: `// ❌ Traditional approach with async pipe and Zone.js
@Component({
  selector: 'app-traditional-async',
  template: \`
    <div>
      <!-- Async pipe requires Zone.js change detection -->
      <h2>{{ (user$ | async)?.name || 'Loading...' }}</h2>
      <p>Email: {{ (user$ | async)?.email || 'Loading...' }}</p>
      <p>Posts: {{ (userPosts$ | async)?.length || 0 }}</p>
      
      <!-- Complex async operations -->
      <div *ngIf="user$ | async as user">
        <p>Welcome {{ user.name }}</p>
        <div *ngIf="userPosts$ | async as posts">
          <p>You have {{ posts.length }} posts</p>
        </div>
      </div>
    </div>
  \`
})
export class TraditionalAsyncComponent implements OnDestroy {
  user$ = this.userService.getUser();
  userPosts$ = this.user$.pipe(
    switchMap(user => this.postService.getUserPosts(user.id))
  );
  
  constructor(
    private userService: UserService,
    private postService: PostService
  ) {}
  
  // Manual subscription management required
  ngOnDestroy() {
    // Subscriptions managed by async pipe, but still Zone.js dependent
  }
}

// ✅ Modern approach with signals - no async pipe needed!
@Component({
  selector: 'app-signals-async',
  template: \`
    <div>
      <!-- Direct signal access - no async pipe needed -->
      <h2>{{ user()?.name || 'Loading...' }}</h2>
      <p>Email: {{ user()?.email || 'Loading...' }}</p>
      <p>Posts: {{ userPosts().length }}</p>
      
      <!-- Clean conditional rendering -->
      @if (user(); as user) {
        <p>Welcome {{ user.name }}</p>
        @if (userPosts().length > 0) {
          <p>You have {{ userPosts().length }} posts</p>
        }
      }
    </div>
  \`
})
export class SignalsAsyncComponent {
  // Signals for async data - no async pipe needed!
  user = signal<User | null>(null);
  userPosts = signal<Post[]>([]);
  
  // Loading states as signals
  userLoading = signal(true);
  postsLoading = signal(true);
  
  // Computed signals for derived state
  isReady = computed(() => !this.userLoading() && !this.postsLoading());
  
  constructor(
    private userService: UserService,
    private postService: PostService
  ) {
    // Load user data
    this.loadUser();
  }
  
  private loadUser() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.userLoading.set(false);
        // Load posts when user is available
        this.loadUserPosts(user.id);
      },
      error: (error) => {
        console.error('Failed to load user:', error);
        this.userLoading.set(false);
      }
    });
  }
  
  private loadUserPosts(userId: string) {
    this.postService.getUserPosts(userId).subscribe({
      next: (posts) => {
        this.userPosts.set(posts);
        this.postsLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
        this.postsLoading.set(false);
      }
    });
  }
}

// 🚀 ADVANCED: Signal-based reactive service
@Injectable({
  providedIn: 'root'
})
export class SignalUserService {
  // Internal signal state
  private _user = signal<User | null>(null);
  private _posts = signal<Post[]>([]);
  private _loading = signal(false);
  
  // Public readonly signals
  user = this._user.asReadonly();
  posts = this._posts.asReadonly();
  loading = this._loading.asReadonly();
  
  // Computed signals
  userWithPosts = computed(() => ({
    user: this._user(),
    posts: this._posts(),
    postCount: this._posts().length
  }));
  
  constructor(private http: HttpClient) {}
  
  loadUser(id: string) {
    this._loading.set(true);
    
    this.http.get<User>(\`/api/users/\${id}\`).subscribe({
      next: (user) => {
        this._user.set(user);
        this.loadUserPosts(user.id);
      },
      error: (error) => {
        console.error('Failed to load user:', error);
        this._loading.set(false);
      }
    });
  }
  
  private loadUserPosts(userId: string) {
    this.http.get<Post[]>(\`/api/users/\${userId}/posts\`).subscribe({
      next: (posts) => {
        this._posts.set(posts);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
        this._loading.set(false);
      }
    });
  }
}

// Component using signal service - ultra clean!
@Component({
  selector: 'app-signal-service-consumer',
  template: \`
    <div>
      @if (userService.loading()) {
        <p>Loading...</p>
      } @else {
        <h2>{{ userService.user()?.name }}</h2>
        <p>{{ userService.posts().length }} posts</p>
      }
    </div>
  \`
})
export class SignalServiceConsumerComponent {
  constructor(public userService: SignalUserService) {
    // Load user on component init
    this.userService.loadUser('123');
  }
}

// KEY DIFFERENCES:
// 
// Async Pipe (Traditional):
// - Requires Zone.js for change detection
// - Multiple subscriptions for same observable
// - Verbose template syntax with pipe
// - Manual subscription management complexity
// - Zone.js overhead on every async update
//
// Signals (Modern):
// - Direct dependency graph updates (no Zone.js)
// - Single source of truth per signal
// - Clean template syntax (no pipes)
// - Automatic subscription management
// - Targeted updates only to dependent components`,
      explanation:
        'Signals eliminate the need for async pipe by providing direct reactive state management that updates components through the dependency graph, bypassing Zone.js entirely.',
    },
    diagram: {
      type: 'signals-flow',
      title: 'Signals vs Async Pipe Flow',
      animated: true,
    },
    problemSolution: {
      problem:
        'Async pipe requires Zone.js for change detection and creates verbose template syntax with multiple pipe instances for the same data.',
      solution:
        'Signals provide direct reactive state that updates through dependency graph without Zone.js, offering cleaner templates and better performance.',
      benefits: [
        'No Zone.js dependency for updates',
        'Cleaner template syntax',
        'Better performance with targeted updates',
        'Automatic subscription management',
      ],
      implementation:
        'Replace observables with signals in services and components, using signal.set() for updates instead of relying on async pipe.',
    },
  },
  {
    id: 'angular-v17-features',
    title: 'In Angular v17',
    subtitle: '(Global + Local Change Detection)',
    content: [
      {
        type: 'text',
        content:
          'Angular v17 introduces a hybrid change detection model that combines global change detection (Zone.js) with local change detection (Signals), providing the best of both worlds.',
      },
      {
        type: 'bullet',
        content: 'Angular v17 change detection features:',
        subItems: [
          'Global change detection: Traditional Zone.js for compatibility',
          'Local change detection: Signals for fine-grained reactivity',
          'Hybrid model: Both systems work together seamlessly',
          'Gradual migration: Can adopt signals incrementally',
          'Performance benefits: Signals bypass Zone.js overhead',
          'Future-ready: Path to eventual zoneless Angular',
        ],
      },
      {
        type: 'highlight',
        content:
          '🚀 Angular v17 marks the beginning of the transition from Zone.js-based change detection to a more efficient signal-based reactive system.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Angular v17: Global + Local Change Detection',
      code: `// Angular v17: Hybrid Change Detection Model

@Component({
  selector: 'app-hybrid-demo',
  template: \`
    <div class="hybrid-demo">
      <h2>{{ title }}</h2>
      
      <!-- Traditional property binding (Global CD) -->
      <p>Traditional counter: {{ traditionalCounter }}</p>
      <button (click)="incrementTraditional()">Increment Traditional</button>
      
      <!-- Signal-based binding (Local CD) -->
      <p>Signal counter: {{ signalCounter() }}</p>
      <button (click)="incrementSignal()">Increment Signal</button>
      
      <!-- Computed signal (Local CD) -->
      <p>Total: {{ total() }}</p>
      
      <!-- Mixed approach -->
      <p>Status: {{ status() }}</p>
      
      <!-- Effect side effects -->
      <div class="logs">
        <h3>Change Detection Logs:</h3>
        <ul>
          <li *ngFor="let log of logs">{{ log }}</li>
        </ul>
      </div>
    </div>
  \`
})
export class HybridDemoComponent implements OnInit {
  // TRADITIONAL PROPERTIES (Global Change Detection via Zone.js)
  title = 'Angular v17 Hybrid Change Detection';
  traditionalCounter = 0;
  logs: string[] = [];
  
  // SIGNAL PROPERTIES (Local Change Detection)
  signalCounter = signal(0);
  
  // COMPUTED SIGNALS (Local Change Detection)
  total = computed(() => this.traditionalCounter + this.signalCounter());
  
  status = computed(() => {
    const traditional = this.traditionalCounter;
    const signalValue = this.signalCounter();
    const totalValue = this.total();
    
    if (totalValue === 0) return 'Both counters at zero';
    if (traditional > signalValue) return 'Traditional is higher';
    if (signalValue > traditional) return 'Signal is higher';
    return 'Both counters are equal';
  });
  
  constructor() {
    // EFFECTS (Local Change Detection)
    effect(() => {
      const signalValue = this.signalCounter();
      console.log(\`Signal counter changed to: \${signalValue}\`);
      // This effect runs independently of Zone.js!
    });
    
    effect(() => {
      const totalValue = this.total();
      console.log(\`Total changed to: \${totalValue}\`);
      // This runs when either traditional or signal counter changes
    });
  }
  
  ngOnInit() {
    this.addLog('Component initialized with hybrid change detection');
  }
  
  // TRADITIONAL METHOD (Triggers Global Change Detection)
  incrementTraditional() {
    this.traditionalCounter++;
    this.addLog(\`Traditional counter: \${this.traditionalCounter} (Zone.js CD)\`);
    // Zone.js detects this change and runs full change detection cycle
    // This will also update the computed 'total' signal
  }
  
  // SIGNAL METHOD (Triggers Local Change Detection)
  incrementSignal() {
    this.signalCounter.update(count => count + 1);
    this.addLog(\`Signal counter: \${this.signalCounter()} (Local CD)\`);
    // Only signal dependencies update, no Zone.js involvement
    // This will also update the computed 'total' signal
  }
  
  private addLog(message: string) {
    this.logs.unshift(\`[\${new Date().toLocaleTimeString()}] \${message}\`);
    if (this.logs.length > 10) {
      this.logs = this.logs.slice(0, 10);
    }
  }
}

// CHANGE DETECTION FLOW COMPARISON:

// TRADITIONAL APPROACH (Global CD):
// 1. User clicks "Increment Traditional"
// 2. Zone.js detects DOM event
// 3. Event handler executes: incrementTraditional()
// 4. Property changes: traditionalCounter++
// 5. Zone.js triggers full change detection cycle
// 6. Angular checks ALL bindings in ALL components
// 7. DOM updates for changed bindings
// 8. Computed signals that depend on traditionalCounter also update

// SIGNAL APPROACH (Local CD):
// 1. User clicks "Increment Signal" 
// 2. Zone.js detects DOM event (still needed for event handling)
// 3. Event handler executes: signalCounter.update()
// 4. Signal value changes
// 5. Signal notifies its consumers directly (no Zone.js)
// 6. Only dependent computed signals and effects update
// 7. DOM updates only for signal-dependent bindings
// 8. Much more efficient - no full change detection cycle

// SERVICE EXAMPLE: Hybrid State Management
@Injectable({
  providedIn: 'root'
})
export class HybridStateService {
  // Traditional observable (Global CD when used with async pipe)
  private _traditionalData$ = new BehaviorSubject({ count: 0, name: 'Traditional' });
  traditionalData$ = this._traditionalData$.asObservable();
  
  // Signal-based state (Local CD)
  private _signalData = signal({ count: 0, name: 'Signal' });
  signalData = this._signalData.asReadonly();
  
  // Computed signal combining both
  combinedData = computed(() => ({
    traditional: this.getCurrentTraditionalData(),
    signal: this._signalData(),
    total: this.getCurrentTraditionalData().count + this._signalData().count
  }));
  
  private getCurrentTraditionalData() {
    // Helper to get current observable value synchronously
    return this._traditionalData$.value;
  }
  
  updateTraditional(count: number) {
    this._traditionalData$.next({ count, name: 'Traditional' });
    // This will trigger change detection via Zone.js when used with async pipe
  }
  
  updateSignal(count: number) {
    this._signalData.set({ count, name: 'Signal' });
    // This will trigger local change detection only for signal consumers
  }
}

// COMPONENT USING HYBRID SERVICE
@Component({
  selector: 'app-hybrid-consumer',
  template: \`
    <div>
      <!-- Traditional observable with async pipe (Global CD) -->
      <p>Traditional: {{ (stateService.traditionalData$ | async)?.count }}</p>
      
      <!-- Signal-based data (Local CD) -->
      <p>Signal: {{ stateService.signalData().count }}</p>
      
      <!-- Computed signal (Local CD) -->
      <p>Combined Total: {{ stateService.combinedData().total }}</p>
    </div>
  \`
})
export class HybridConsumerComponent {
  constructor(public stateService: HybridStateService) {}
}

// KEY INSIGHTS FOR ANGULAR v17:
//
// 1. COEXISTENCE: Signals and Zone.js work together
// 2. GRADUAL ADOPTION: You can migrate component by component
// 3. PERFORMANCE: Signals provide immediate performance benefits
// 4. COMPATIBILITY: Existing code continues to work unchanged
// 5. FUTURE PATH: Foundation for eventual zoneless Angular`,
      explanation:
        'Angular v17 introduces a hybrid model where traditional Zone.js change detection and signal-based local change detection work together, allowing gradual migration and immediate performance benefits.',
    },
    diagram: {
      type: 'strategy-comparison',
      title: 'Angular v17 Hybrid Change Detection',
      animated: true,
    },
    problemSolution: {
      problem:
        'Migrating from Zone.js to signals requires a complete rewrite, making it difficult for large applications to adopt the new reactive model.',
      solution:
        'Angular v17 provides a hybrid approach where signals and Zone.js coexist, allowing gradual migration while providing immediate performance benefits.',
      benefits: [
        'Gradual migration path',
        'Immediate performance benefits',
        'Backward compatibility',
        'Future-ready architecture',
      ],
      implementation:
        'Start using signals for new components and gradually convert existing components, while keeping Zone.js for compatibility.',
    },
  },
  {
    id: 'two-new-flags',
    title: 'Two New Flags',
    subtitle: 'RefreshView and HAS_CHILD_VIEWS_TO_REFRESH',
    content: [
      {
        type: 'text',
        content:
          'Angular v17 introduces two critical flags that enable efficient signal-based change detection: RefreshView and HAS_CHILD_VIEWS_TO_REFRESH, which work together to optimize the change detection process.',
      },
      {
        type: 'bullet',
        content: 'New change detection flags:',
        subItems: [
          'RefreshView: Marks a view that needs to be refreshed',
          'HAS_CHILD_VIEWS_TO_REFRESH: Indicates child views need refreshing',
          'Targeted updates: Only marked views are processed',
          'Efficient traversal: Skip unchanged component subtrees',
          'Signal integration: Flags set when signals change',
          'Performance optimization: Avoid unnecessary work',
        ],
      },
      {
        type: 'highlight',
        content:
          "✨ These flags enable Angular to skip entire component subtrees that haven't changed, dramatically improving performance.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Internal Flag System Implementation',
      code: `// Angular v17 Internal Flag System (Simplified)

// LView flags for change detection optimization
const enum LViewFlags {
  // ... existing flags ...
  
  /** View should be refreshed during change detection */
  RefreshView = 1 << 11,
  
  /** View has child views that need refreshing */
  HAS_CHILD_VIEWS_TO_REFRESH = 1 << 12,
}

// How signals interact with the flag system
export function markViewForRefresh(lView: LView): void {
  // Mark the current view for refresh
  lView[FLAGS] |= LViewFlags.RefreshView;
  
  // Mark all parent views as having child views to refresh
  let parent = lView[PARENT];
  while (parent !== null) {
    parent[FLAGS] |= LViewFlags.HAS_CHILD_VIEWS_TO_REFRESH;
    parent = parent[PARENT];
  }
}

// Signal update triggers view marking
class Signal<T> {
  private consumers = new Set<() => void>();
  
  set(value: T): void {
    this.value = value;
    
    // Notify all consumers (components that use this signal)
    this.consumers.forEach(consumer => {
      // Each consumer marks its view for refresh
      const lView = getCurrentLView();
      markViewForRefresh(lView);
    });
  }
}

// Change detection with flag optimization
export function detectChanges(lView: LView): void {
  // Check if this view needs refreshing
  if (lView[FLAGS] & LViewFlags.RefreshView) {
    // Refresh this view's bindings
    refreshView(lView);
    
    // Clear the refresh flag
    lView[FLAGS] &= ~LViewFlags.RefreshView;
  }
  
  // Check if child views need refreshing
  if (lView[FLAGS] & LViewFlags.HAS_CHILD_VIEWS_TO_REFRESH) {
    // Recursively check child views
    const childViews = getChildViews(lView);
    
    for (const childView of childViews) {
      detectChanges(childView);
    }
    
    // Clear the child refresh flag
    lView[FLAGS] &= ~LViewFlags.HAS_CHILD_VIEWS_TO_REFRESH;
  }
  
  // If neither flag is set, skip this entire subtree!
}

// PRACTICAL EXAMPLE: Component tree with signals

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <h1>{{ title }}</h1>
      <app-user-list [users]="users()"></app-user-list>
      <app-statistics [count]="userCount()"></app-statistics>
      <app-footer></app-footer>
    </div>
  \`
})
export class AppComponent {
  title = 'User Management'; // Traditional property
  
  // Signal-based data
  users = signal<User[]>([
    { id: 1, name: 'John', active: true },
    { id: 2, name: 'Jane', active: false }
  ]);
  
  // Computed signal
  userCount = computed(() => this.users().filter(u => u.active).length);
  
  addUser(user: User) {
    this.users.update(current => [...current, user]);
    // This triggers:
    // 1. markViewForRefresh(AppComponent's LView)
    // 2. parent flags set: HAS_CHILD_VIEWS_TO_REFRESH
    // 3. Only affected components refresh
  }
}

@Component({
  selector: 'app-user-list',
  template: \`
    <div>
      <h2>Users</h2>
      <div *ngFor="let user of users()">
        {{ user.name }} - {{ user.active ? 'Active' : 'Inactive' }}
      </div>
    </div>
  \`
})
export class UserListComponent {
  users = input.required<User[]>();
  
  // When parent's users signal changes:
  // 1. This component's LView gets RefreshView flag
  // 2. Parent gets HAS_CHILD_VIEWS_TO_REFRESH flag
  // 3. Only this component refreshes, siblings are skipped
}

@Component({
  selector: 'app-statistics',
  template: \`
    <div>
      <h2>Statistics</h2>
      <p>Active users: {{ count() }}</p>
    </div>
  \`
})
export class StatisticsComponent {
  count = input.required<number>();
  
  // When userCount computed signal changes:
  // 1. This component's LView gets RefreshView flag
  // 2. Only this component refreshes
}

@Component({
  selector: 'app-footer',
  template: \`
    <footer>
      <p>© 2024 User Management System</p>
    </footer>
  \`
})
export class FooterComponent {
  // This component has no signal dependencies
  // When users signal changes:
  // 1. This component's LView has NO flags set
  // 2. This component is completely skipped during change detection
  // 3. Performance win!
}

// CHANGE DETECTION FLOW WITH FLAGS:
//
// Before flags (Traditional):
// users.update() → Zone.js → Check ALL components → Update DOM
//
// With flags (Angular v17):
// users.update() → markViewForRefresh(affected views) → 
// Check only flagged components → Update DOM
//
// PERFORMANCE COMPARISON:
//
// Component Tree:
//     AppComponent (RefreshView)
//     ├── UserListComponent (RefreshView)
//     ├── StatisticsComponent (RefreshView)  
//     └── FooterComponent (NO FLAGS - SKIPPED!)
//
// Result: 75% of components skipped when footer is unchanged!

// ADVANCED: Custom signal implementation with flags
export function createOptimizedSignal<T>(initialValue: T) {
  let value = initialValue;
  const consumers = new Set<LView>();
  
  return {
    get(): T {
      // Register current view as consumer
      const currentView = getCurrentLView();
      if (currentView) {
        consumers.add(currentView);
      }
      return value;
    },
    
    set(newValue: T): void {
      if (value !== newValue) {
        value = newValue;
        
        // Mark all consumer views for refresh
        consumers.forEach(lView => {
          markViewForRefresh(lView);
        });
      }
    }
  };
}`,
      explanation:
        'Angular v17 uses RefreshView and HAS_CHILD_VIEWS_TO_REFRESH flags to optimize change detection by only processing components that actually need updates, skipping unchanged subtrees.',
    },
    diagram: {
      type: 'targeted-change-detection',
      title: 'Flag-Based Change Detection Optimization',
      animated: true,
    },
    problemSolution: {
      problem:
        'Traditional change detection checks all components even when only a small subset has changed, wasting CPU cycles on unchanged components.',
      solution:
        'Angular v17 introduces flags that mark only the views that need refreshing, allowing the change detection to skip entire component subtrees.',
      benefits: [
        'Skip unchanged component subtrees',
        'Targeted change detection',
        'Significant performance improvements',
        'Efficient signal integration',
      ],
      implementation:
        'Flags are automatically managed by Angular when signals change, requiring no manual intervention from developers.',
    },
  },
  {
    id: 'how-internal-mechanism-works',
    title: 'How Do They Work?',
    subtitle: 'Internal markViewForRefresh Mechanism',
    content: [
      {
        type: 'text',
        content:
          'The internal Angular mechanism uses markViewForRefresh() to precisely target which components need updates when signals change, creating an efficient change detection system.',
      },
      {
        type: 'bullet',
        content: 'Internal mechanism details:',
        subItems: [
          'markViewForRefresh(): Core function that marks views for update',
          'LView flagging: Sets RefreshView flag on affected components',
          'Parent chain marking: Propagates HAS_CHILD_VIEWS_TO_REFRESH upward',
          'Selective traversal: Only processes flagged components',
          'Signal consumer tracking: Maintains dependency relationships',
          'Efficient DOM updates: Updates only changed bindings',
        ],
      },
      {
        type: 'highlight',
        content:
          '⚡ The markViewForRefresh mechanism is the secret sauce that makes signals so efficient compared to Zone.js.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Internal markViewForRefresh Implementation',
      code: `// Simplified Angular Internal Implementation

// Core function that marks views for refresh
export function markViewForRefresh(lView: LView): void {
  // Mark the current view as needing refresh
  lView[FLAGS] |= LViewFlags.RefreshView;
  
  // Walk up the parent chain and mark each parent as having child views to refresh
  let parent = lView[PARENT];
  while (parent !== null) {
    // If parent already has this flag, we can stop (optimization)
    if (parent[FLAGS] & LViewFlags.HAS_CHILD_VIEWS_TO_REFRESH) {
      break;
    }
    
    parent[FLAGS] |= LViewFlags.HAS_CHILD_VIEWS_TO_REFRESH;
    parent = parent[PARENT];
  }
}

// Signal implementation that triggers the marking
export class WritableSignal<T> {
  private _value: T;
  private _version = 0;
  private _consumers = new Set<Consumer>();
  
  constructor(initialValue: T) {
    this._value = initialValue;
  }
  
  // Reading a signal registers the current context as a consumer
  get(): T {
    const consumer = getCurrentConsumer();
    if (consumer) {
      this._consumers.add(consumer);
      consumer.dependencies.add(this);
    }
    return this._value;
  }
  
  // Setting a signal triggers the refresh mechanism
  set(value: T): void {
    if (this._value !== value) {
      this._value = value;
      this._version++;
      
      // Notify all consumers that this signal has changed
      this._notifyConsumers();
    }
  }
  
  private _notifyConsumers(): void {
    // Mark all consumer views for refresh
    this._consumers.forEach(consumer => {
      if (consumer.lView) {
        markViewForRefresh(consumer.lView);
      }
      
      // If consumer is a computed signal, mark it as stale
      if (consumer.type === 'computed') {
        consumer.markStale();
      }
    });
  }
}

// Computed signal implementation
export class ComputedSignal<T> {
  private _value: T | UNSET = UNSET;
  private _computation: () => T;
  private _version = 0;
  private _consumers = new Set<Consumer>();
  private _dependencies = new Set<WritableSignal<any>>();
  private _stale = true;
  
  constructor(computation: () => T) {
    this._computation = computation;
  }
  
  get(): T {
    // Register current consumer
    const consumer = getCurrentConsumer();
    if (consumer) {
      this._consumers.add(consumer);
    }
    
    // Recompute if stale
    if (this._stale) {
      this._recompute();
    }
    
    return this._value as T;
  }
  
  private _recompute(): void {
    const previousConsumer = getCurrentConsumer();
    setCurrentConsumer(this);
    
    try {
      // Clear old dependencies
      this._dependencies.forEach(dep => dep._consumers.delete(this));
      this._dependencies.clear();
      
      // Compute new value (this will register new dependencies)
      this._value = this._computation();
      this._stale = false;
      this._version++;
      
    } finally {
      setCurrentConsumer(previousConsumer);
    }
  }
  
  markStale(): void {
    if (!this._stale) {
      this._stale = true;
      
      // Propagate staleness to consumers
      this._consumers.forEach(consumer => {
        if (consumer.lView) {
          markViewForRefresh(consumer.lView);
        }
        if (consumer.type === 'computed') {
          consumer.markStale();
        }
      });
    }
  }
}

// PRACTICAL EXAMPLE: How marking works in a real component

@Component({
  selector: 'app-user-profile',
  template: \`
    <div>
      <h2>{{ fullName() }}</h2>
      <p>Age: {{ age() }}</p>
      <p>Category: {{ ageCategory() }}</p>
      <p>Bio: {{ bio() }}</p>
    </div>
  \`
})
export class UserProfileComponent {
  // Base signals (WritableSignals)
  firstName = signal('John');
  lastName = signal('Doe');
  age = signal(25);
  
  // Computed signals (ComputedSignals)
  fullName = computed(() => \`\${this.firstName()} \${this.lastName()}\`);
  ageCategory = computed(() => {
    const currentAge = this.age();
    if (currentAge < 18) return 'Minor';
    if (currentAge < 65) return 'Adult';
    return 'Senior';
  });
  
  bio = computed(() => 
    \`\${this.fullName()} is \${this.age()} years old and is classified as \${this.ageCategory()}.\`
  );
  
  updateFirstName(newName: string) {
    this.firstName.set(newName);
    
    // INTERNAL FLOW when firstName.set() is called:
    // 1. WritableSignal.set() detects value change
    // 2. Increments internal version
    // 3. Calls _notifyConsumers()
    // 4. Finds consumers: [fullName computed signal]
    // 5. Calls markViewForRefresh(UserProfileComponent's LView)
    // 6. Sets RefreshView flag on this component
    // 7. Walks up parent chain setting HAS_CHILD_VIEWS_TO_REFRESH
    // 8. fullName.markStale() is called
    // 9. fullName finds its consumers: [bio computed signal]
    // 10. bio.markStale() is called
    // 11. bio finds its consumers: [this component's template binding]
    // 12. Component is already marked for refresh
    //
    // RESULT: Only this component will be checked during change detection!
  }
}

// CHANGE DETECTION OPTIMIZATION FLOW:

// 1. SIGNAL UPDATE PHASE:
//    firstName.set('Jane')
//    └── markViewForRefresh(UserProfileComponent)
//        └── Mark parents with HAS_CHILD_VIEWS_TO_REFRESH
//
// 2. CHANGE DETECTION PHASE:
//    ApplicationRef.tick()
//    └── Check root component
//        └── Has HAS_CHILD_VIEWS_TO_REFRESH flag
//            └── Check UserProfileComponent
//                └── Has RefreshView flag
//                    └── Refresh bindings: fullName(), bio()
//                        └── Computed signals recompute if stale
//                            └── DOM updates with new values

// PERFORMANCE COMPARISON:

// Traditional Zone.js approach:
// firstName = 'Jane' → Zone.js detects → Check ALL components → Update DOM
// Time: O(n) where n = total components

// Signal approach with markViewForRefresh:
// firstName.set('Jane') → markViewForRefresh → Check ONLY flagged components → Update DOM
// Time: O(k) where k = components with signal dependencies (k << n)

// ADVANCED: Custom component with manual signal management
export class OptimizedComponent {
  private _lView: LView;
  
  // Manual signal consumer registration
  registerSignalConsumer<T>(signal: WritableSignal<T>): T {
    const consumer = {
      lView: this._lView,
      type: 'component' as const,
      dependencies: new Set([signal])
    };
    
    signal._consumers.add(consumer);
    return signal.get();
  }
  
  // This would be called automatically by Angular in real implementation
  markForRefresh() {
    markViewForRefresh(this._lView);
  }
}`,
      explanation:
        "The markViewForRefresh mechanism is Angular's internal system for efficiently targeting only the components that need updates when signals change, avoiding unnecessary work.",
    },
    diagram: {
      type: 'dirty-marking-flow',
      title: 'Internal markViewForRefresh Flow',
      animated: true,
    },
    problemSolution: {
      problem:
        'Traditional change detection has no way to know which specific components are affected by data changes, so it must check everything.',
      solution:
        'markViewForRefresh creates a direct connection between signal changes and the specific components that need updates, enabling surgical precision.',
      benefits: [
        'Surgical precision in updates',
        'Avoids unnecessary component checks',
        'Efficient parent chain marking',
        'Automatic dependency tracking',
      ],
      implementation:
        'Angular automatically handles markViewForRefresh when signals change - no manual intervention required from developers.',
    },
  },
  {
    id: 'when-signal-updates',
    title: 'When Signal Updates',
    subtitle: 'Internal Component Tree Visualization',
    content: [
      {
        type: 'text',
        content:
          'When a signal updates, Angular uses an efficient internal mechanism to traverse only the affected parts of the component tree, marking views for refresh and updating only what has changed.',
      },
      {
        type: 'bullet',
        content: 'Signal update flow:',
        subItems: [
          'Signal value changes and increments version',
          'All signal consumers are notified',
          'Component views are marked with RefreshView flag',
          'Parent chain gets HAS_CHILD_VIEWS_TO_REFRESH flags',
          'Change detection traverses only flagged components',
          'DOM updates occur only for changed bindings',
        ],
      },
      {
        type: 'highlight',
        content:
          '🎯 Signal updates create a precise "path of change" through the component tree, avoiding unnecessary checks.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Signal Update Flow Visualization',
      code: `// COMPONENT TREE STRUCTURE FOR VISUALIZATION:
//
//     AppComponent (Root)
//     ├── HeaderComponent
//     ├── MainContentComponent
//     │   ├── UserListComponent ← Uses users signal
//     │   ├── StatisticsComponent ← Uses userCount computed signal
//     │   └── FilterComponent
//     └── FooterComponent

// SIGNAL DEFINITIONS:
const users = signal<User[]>([
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false }
]);

const userCount = computed(() => users().filter(u => u.active).length);

// WHEN users.update() IS CALLED:

// Step 1: Signal Change Detection
users.update(current => [...current, { id: 3, name: 'Bob', active: true }]);

// Step 2: Internal Marking Process
// 
// users signal consumers: [UserListComponent, userCount computed signal]
// 
// markViewForRefresh(UserListComponent.lView)
// ├── UserListComponent[FLAGS] |= RefreshView
// └── Walk up parent chain:
//     ├── MainContentComponent[FLAGS] |= HAS_CHILD_VIEWS_TO_REFRESH
//     └── AppComponent[FLAGS] |= HAS_CHILD_VIEWS_TO_REFRESH
//
// userCount.markStale()
// ├── userCount consumers: [StatisticsComponent]
// └── markViewForRefresh(StatisticsComponent.lView)
//     ├── StatisticsComponent[FLAGS] |= RefreshView
//     └── Parent already marked: MainContentComponent

// Step 3: Change Detection Traversal
// 
// ApplicationRef.tick() starts at root:
//
// AppComponent
// ├── Check FLAGS: HAS_CHILD_VIEWS_TO_REFRESH ✓
// ├── HeaderComponent
// │   └── Check FLAGS: No flags → SKIP ENTIRELY 🚀
// ├── MainContentComponent  
// │   ├── Check FLAGS: HAS_CHILD_VIEWS_TO_REFRESH ✓
// │   ├── UserListComponent
// │   │   ├── Check FLAGS: RefreshView ✓
// │   │   ├── Refresh template bindings
// │   │   ├── users() → returns new array with Bob
// │   │   └── DOM updated with new user list
// │   ├── StatisticsComponent
// │   │   ├── Check FLAGS: RefreshView ✓
// │   │   ├── Refresh template bindings  
// │   │   ├── userCount() → recomputes: 2 active users
// │   │   └── DOM updated with new count
// │   └── FilterComponent
// │       └── Check FLAGS: No flags → SKIP ENTIRELY 🚀
// └── FooterComponent
//     └── Check FLAGS: No flags → SKIP ENTIRELY 🚀

// RESULT: Only 3 out of 6 components were processed!

// DETAILED IMPLEMENTATION OF THE UPDATE FLOW:

@Component({
  selector: 'app-root',
  template: \`
    <app-header></app-header>
    <app-main-content></app-main-content>
    <app-footer></app-footer>
  \`
})
export class AppComponent {
  // This component will get HAS_CHILD_VIEWS_TO_REFRESH
  // but no RefreshView flag, so its bindings won't be checked
}

@Component({
  selector: 'app-header',
  template: \`
    <header>
      <h1>User Management System</h1>
      <nav>Navigation here</nav>
    </header>
  \`
})
export class HeaderComponent {
  // This component has no signal dependencies
  // It will be COMPLETELY SKIPPED during change detection
  // Performance win! 🚀
}

@Component({
  selector: 'app-main-content',
  template: \`
    <main>
      <app-user-list [users]="userService.users()"></app-user-list>
      <app-statistics [count]="userService.userCount()"></app-statistics>
      <app-filter></app-filter>
    </main>
  \`
})
export class MainContentComponent {
  constructor(public userService: UserService) {}
  
  // This component will get HAS_CHILD_VIEWS_TO_REFRESH
  // Its template bindings will be checked because it reads signals
}

@Component({
  selector: 'app-user-list',
  template: \`
    <div>
      <h2>Users ({{ users().length }})</h2>
      <div *ngFor="let user of users()">
        {{ user.name }} - {{ user.active ? 'Active' : 'Inactive' }}
      </div>
    </div>
  \`
})
export class UserListComponent {
  users = input.required<User[]>();
  
  // This component gets RefreshView flag
  // Template will be refreshed and DOM updated
}

@Component({
  selector: 'app-statistics',
  template: \`
    <div>
      <h2>Statistics</h2>
      <p>Active users: {{ count() }}</p>
      <p>Total users: {{ count() + inactiveCount() }}</p>
    </div>
  \`
})
export class StatisticsComponent {
  count = input.required<number>();
  
  // Additional computed signal
  inactiveCount = computed(() => {
    // This creates a dependency on the parent's users signal
    return this.userService.users().filter(u => !u.active).length;
  });
  
  constructor(private userService: UserService) {}
  
  // This component gets RefreshView flag
  // Both count() and inactiveCount() will be recalculated
}

@Component({
  selector: 'app-filter',
  template: \`
    <div>
      <h3>Filter Options</h3>
      <button>Show All</button>
      <button>Show Active</button>
      <button>Show Inactive</button>
    </div>
  \`
})
export class FilterComponent {
  // This component has no signal dependencies
  // It will be COMPLETELY SKIPPED during change detection
  // Another performance win! 🚀
}

@Component({
  selector: 'app-footer',
  template: \`
    <footer>
      <p>© 2024 User Management System</p>
      <p>Built with Angular v17</p>
    </footer>
  \`
})
export class FooterComponent {
  // This component has no signal dependencies
  // It will be COMPLETELY SKIPPED during change detection
  // Performance win! 🚀
}

// SERVICE WITH SIGNALS:
@Injectable({
  providedIn: 'root'
})
export class UserService {
  users = signal<User[]>([
    { id: 1, name: 'John', active: true },
    { id: 2, name: 'Jane', active: false }
  ]);
  
  userCount = computed(() => this.users().filter(u => u.active).length);
  
  addUser(user: User) {
    this.users.update(current => [...current, user]);
    
    // INTERNAL FLOW TRIGGERED:
    // 1. users signal notifies consumers
    // 2. MainContentComponent marked (reads users in template)
    // 3. UserListComponent marked (input depends on users)
    // 4. userCount computed signal marked as stale
    // 5. StatisticsComponent marked (reads userCount)
    // 6. Parent chain marked with HAS_CHILD_VIEWS_TO_REFRESH
    // 7. Change detection processes only marked components
  }
}

// PERFORMANCE METRICS:
// 
// Traditional approach (Zone.js):
// - Components checked: 6/6 (100%)
// - Bindings evaluated: ~20-30
// - Time complexity: O(n) where n = total components
//
// Signal approach (Angular v17):
// - Components checked: 3/6 (50%)
// - Bindings evaluated: ~8-12
// - Time complexity: O(k) where k = affected components
//
// Performance improvement: ~50-70% reduction in work!`,
      explanation:
        'When signals update, Angular creates a precise "path of change" through the component tree, marking only affected components and skipping entire subtrees that have no signal dependencies.',
    },
    diagram: {
      type: 'signal-dependency-graph',
      title: 'Signal Update Component Tree Flow',
      animated: true,
    },
    problemSolution: {
      problem:
        'Traditional change detection must traverse the entire component tree on every update, even when only a small subset of components are affected.',
      solution:
        'Signal updates create a targeted path through the component tree, marking only affected components and skipping unchanged subtrees entirely.',
      benefits: [
        'Skip entire unchanged subtrees',
        'Targeted component processing',
        'Dramatic performance improvements',
        'Automatic optimization',
      ],
      implementation:
        'Use signals in components and services - Angular automatically handles the efficient update path without any manual optimization required.',
    },
  },
  {
    id: 'targeted-vs-global-mode',
    title: 'Targeted Mode vs Global Mode',
    subtitle: 'The Revolutionary Change Detection Optimization',
    content: [
      {
        type: 'text',
        content:
          'Angular v17 introduces two distinct change detection modes: Global Mode (traditional) and Targeted Mode (optimized). Understanding when and how Angular switches between these modes is crucial for performance optimization.',
      },
      {
        type: 'bullet',
        content: 'Change detection modes explained:',
        subItems: [
          'Global Mode: Traditional top-down checking of all components',
          'Targeted Mode: Only refresh components with RefreshView flag',
          'Automatic switching: Angular intelligently switches between modes',
          'OnPush trigger: Non-dirty OnPush components trigger Targeted Mode',
          'Performance boost: Skip CheckAlways components in Targeted Mode',
          'Smart traversal: Switch back to Global when RefreshView is found',
        ],
      },
      {
        type: 'highlight',
        content:
          '🎯 Targeted Mode = OnPush without footguns! It provides the performance benefits of OnPush with automatic optimization.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Targeted Mode vs Global Mode Rules and Implementation',
      code: `// CHANGE DETECTION MODE RULES (Angular v17+)

// GLOBAL MODE RULES:
// - Check CheckAlways components (normal components)
// - Check Dirty OnPush components  
// - Top-down traversal through the component tree
// - Default mode when change detection starts

// TARGETED MODE TRIGGER:
// - When in GlobalMode we encounter a Non-Dirty OnPush component
// - Switch to TargetedMode for performance optimization

// TARGETED MODE RULES:
// - Only refresh views with RefreshView flag set
// - DO NOT refresh CheckAlways or regular Dirty flag views
// - If we reach a view with RefreshView flag, traverse children in GlobalMode
// - Skip entire subtrees that don't have RefreshView

// PRACTICAL EXAMPLE: Component Tree with Mixed Strategies

@Component({
  selector: 'app-root',
  template: \`
    <div>
      <app-header></app-header>
      <app-main-content></app-main-content>
      <app-sidebar></app-sidebar>
    </div>
  \`
})
export class AppComponent {
  // CheckAlways strategy (default)
  // Always checked in GlobalMode
}

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <header>
      <h1>{{ title }}</h1>
      <app-navigation></app-navigation>
    </header>
  \`
})
export class HeaderComponent {
  @Input() title = 'My App';
  
  // OnPush strategy
  // If not dirty and has HAS_CHILD_VIEWS_TO_REFRESH → Triggers TargetedMode
}

@Component({
  selector: 'app-navigation',
  template: \`
    <nav>
      <button (click)="navigate()">Navigate</button>
      <span>{{ currentRoute }}</span>
    </nav>
  \`
})
export class NavigationComponent {
  currentRoute = '/home';
  
  navigate() {
    this.currentRoute = '/about';
    // This will mark the component dirty and set RefreshView flag
  }
  
  // CheckAlways strategy
  // In TargetedMode: SKIPPED unless it has RefreshView flag
  // In GlobalMode: Always checked
}

@Component({
  selector: 'app-main-content',
  template: \`
    <main>
      <app-user-list [users]="users()"></app-user-list>
      <app-stats [count]="userCount()"></app-stats>
    </main>
  \`
})
export class MainContentComponent {
  users = signal([{ name: 'John' }, { name: 'Jane' }]);
  userCount = computed(() => this.users().length);
  
  // CheckAlways strategy with signals
  // When signals change: gets RefreshView flag
}

// CHANGE DETECTION FLOW WALKTHROUGH:

// SCENARIO: Navigation button clicked in NavigationComponent

// Step 1: Button Click
// - NavigationComponent.navigate() called
// - currentRoute = '/about'
// - markViewDirty(NavigationComponent) called
// - RefreshView flag set on NavigationComponent
// - HAS_CHILD_VIEWS_TO_REFRESH set on ancestors

// Step 2: Change Detection Starts (GlobalMode)
// AppComponent (CheckAlways, HAS_CHILD_VIEWS_TO_REFRESH)
// ├── Check bindings ✅
// ├── Continue to children ✅

// Step 3: HeaderComponent (OnPush + HAS_CHILD_VIEWS_TO_REFRESH but NOT dirty)
// ├── Component is OnPush and not dirty
// ├── But has HAS_CHILD_VIEWS_TO_REFRESH flag
// ├── 🔄 SWITCH TO TARGETED MODE!
// ├── Don't refresh HeaderComponent itself
// └── Continue to children in TargetedMode

// Step 4: NavigationComponent (TargetedMode)
// ├── Has RefreshView flag ✅
// ├── Refresh bindings: currentRoute = '/about'
// ├── 🔄 SWITCH BACK TO GLOBAL MODE for children
// └── DOM updated with new route

// Step 5: MainContentComponent (GlobalMode)
// ├── CheckAlways component
// ├── Check bindings ✅
// └── Continue normally

// PERFORMANCE COMPARISON:

// Without TargetedMode (Traditional):
// - All components checked: AppComponent, HeaderComponent, NavigationComponent, MainContentComponent
// - HeaderComponent bindings evaluated unnecessarily
// - Wasted CPU cycles on unchanged components

// With TargetedMode (Angular v17+):  
// - AppComponent: Checked (GlobalMode)
// - HeaderComponent: SKIPPED (TargetedMode trigger)
// - NavigationComponent: Checked (has RefreshView)
// - MainContentComponent: Checked (GlobalMode resumed)
// - Result: HeaderComponent bindings skipped = Performance gain!

// INTERNAL IMPLEMENTATION (Simplified):

enum ChangeDetectionMode {
  Global = 0,
  Targeted = 1
}

function detectChanges(lView: LView, mode: ChangeDetectionMode = ChangeDetectionMode.Global) {
  const flags = lView[FLAGS];
  
  if (mode === ChangeDetectionMode.Global) {
    // Global Mode: Check CheckAlways and Dirty OnPush
    if (isCheckAlways(lView) || (isOnPush(lView) && (flags & LViewFlags.Dirty))) {
      refreshView(lView);
    }
    
    // Check if we should switch to TargetedMode
    if (isOnPush(lView) && 
        !(flags & LViewFlags.Dirty) && 
        (flags & LViewFlags.HAS_CHILD_VIEWS_TO_REFRESH)) {
      // Switch to TargetedMode for children
      detectChangesInChildren(lView, ChangeDetectionMode.Targeted);
      return;
    }
  } else {
    // Targeted Mode: Only refresh RefreshView components
    if (flags & LViewFlags.RefreshView) {
      refreshView(lView);
      // Switch back to GlobalMode for children
      detectChangesInChildren(lView, ChangeDetectionMode.Global);
      return;
    }
    
    // Skip CheckAlways components in TargetedMode
    if (isCheckAlways(lView)) {
      return; // SKIP!
    }
  }
  
  // Continue with children in the same mode
  detectChangesInChildren(lView, mode);
}

// BENEFITS OF TARGETED MODE:

// 1. PERFORMANCE: Skip unnecessary component checks
// 2. SMART OPTIMIZATION: Automatically triggered by OnPush
// 3. NO FOOTGUNS: Unlike pure OnPush, no manual markForCheck needed
// 4. BACKWARD COMPATIBLE: Works with existing OnPush components
// 5. SIGNAL INTEGRATION: Works seamlessly with signal-based components

// VISUAL REPRESENTATION:
//
// Component Tree:
// AppComponent (CheckAlways) ← GlobalMode
// ├── HeaderComponent (OnPush, not dirty, HAS_CHILD_VIEWS_TO_REFRESH) ← Triggers TargetedMode
// │   └── NavigationComponent (CheckAlways, RefreshView) ← TargetedMode → GlobalMode
// └── MainContentComponent (CheckAlways) ← GlobalMode
//
// Result: HeaderComponent skipped, NavigationComponent optimized!`,
      explanation:
        'Targeted Mode provides automatic performance optimization by skipping unchanged OnPush components while still checking components that actually need updates.',
    },
    diagram: {
      type: 'targeted-change-detection',
      title: 'Targeted Mode vs Global Mode Flow',
      animated: true,
    },
    problemSolution: {
      problem:
        'Traditional change detection always checks all components, while OnPush requires manual optimization and can be error-prone.',
      solution:
        'Targeted Mode automatically optimizes by skipping unchanged OnPush components while ensuring RefreshView components are still processed.',
      benefits: [
        'Automatic performance optimization',
        'No manual markForCheck needed',
        'Works with existing OnPush components',
        'Intelligent mode switching',
      ],
      implementation:
        'Angular automatically switches to Targeted Mode when encountering non-dirty OnPush components with child views to refresh.',
    },
  },
  {
    id: 'zoneless-implementation-details',
    title: 'Zoneless Angular Implementation',
    subtitle: 'Removing Zone.js and Using Native Scheduling',
    content: [
      {
        type: 'text',
        content:
          'Zoneless Angular removes the 15KB Zone.js dependency and replaces it with explicit change detection scheduling. This provides better performance, smaller bundle size, and more predictable behavior.',
      },
      {
        type: 'bullet',
        content: 'Zoneless Angular features:',
        subItems: [
          'No Zone.js dependency (-15KB bundle size)',
          'Explicit change detection scheduling',
          'Better startup performance',
          'Lower memory usage',
          'More predictable behavior',
          'Works with existing OnPush components',
        ],
      },
      {
        type: 'highlight',
        content:
          '🚀 Zoneless Angular uses native browser scheduling (setTimeout/Promise) instead of Zone.js monkey patching for better performance.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Zoneless Angular Implementation Details',
      code: `// ZONELESS ANGULAR: How it works without Zone.js

// 1. CHANGE DETECTION SCHEDULER
@Injectable({ providedIn: 'root' })
class ChangeDetectionSchedulerImpl implements ChangeDetectionScheduler {
  private appRef = inject(ApplicationRef);
  private taskService = inject(PendingTasks);
  private pendingRenderTaskId: number | null = null;

  notify(): void {
    // Coalesce multiple notify() calls into a single tick()
    if (this.pendingRenderTaskId !== null) {
      return; // Already scheduled
    }

    // Schedule change detection using native browser APIs
    this.pendingRenderTaskId = this.taskService.add();
    
    // Use setTimeout for macrotask scheduling (could be Promise.resolve() for microtask)
    setTimeout(() => {
      try {
        if (!this.appRef.destroyed) {
          this.appRef.tick(); // Run change detection
        }
      } finally {
        const taskId = this.pendingRenderTaskId!;
        this.pendingRenderTaskId = null;
        this.taskService.remove(taskId);
      }
    });
  }
}

// 2. MODIFIED markViewDirty TO NOTIFY SCHEDULER
export function markViewDirty(lView: LView): LView | null {
  // Notify the scheduler that something changed
  lView[ENVIRONMENT].changeDetectionScheduler?.notify();
  
  let currentLView: LView | null = lView;
  
  // Walk up the component tree and mark each ancestor as dirty
  while (currentLView) {
    currentLView[FLAGS] |= LViewFlags.Dirty;
    currentLView = getParentLView(currentLView);
  }
  
  return getRootView(lView);
}

// 3. ZONELESS BOOTSTRAP
function bootstrapZonelessApplication() {
  bootstrapApplication(AppComponent, {
    providers: [
      // Enable zoneless change detection
      provideZonelessChangeDetection(),
      
      // Other providers...
      provideRouter(routes),
      provideHttpClient(),
    ]
  });
}

// 4. WHAT TRIGGERS CHANGE DETECTION IN ZONELESS ANGULAR:

// A. markForCheck() - Used by async pipe
@Component({
  template: \`<p>{{ data$ | async }}</p>\`
})
export class AsyncPipeComponent {
  data$ = this.http.get('/api/data');
  
  // Async pipe automatically calls markForCheck() when new data arrives
  // This triggers the scheduler.notify() → setTimeout → appRef.tick()
}

// B. Signal changes
@Component({
  template: \`<p>{{ count() }}</p>\`
})
export class SignalComponent {
  count = signal(0);
  
  increment() {
    this.count.update(c => c + 1);
    // Signal change triggers markViewForRefresh() → scheduler.notify()
  }
}

// C. Event handlers that mark view dirty
@Component({
  template: \`<button (click)="handleClick()">Click</button>\`
})
export class EventComponent {
  handleClick() {
    // Event handler is wrapped with markViewDirty() call
    // This triggers scheduler.notify()
  }
}

// D. Dynamic component creation with setInput()
@Component({})
export class DynamicComponent {
  constructor(private vcr: ViewContainerRef) {}
  
  createComponent() {
    const componentRef = this.vcr.createComponent(SomeComponent);
    componentRef.setInput('data', newData);
    // setInput() triggers markViewDirty() → scheduler.notify()
  }
}

// 5. MIGRATION TO ZONELESS

// Before (with Zone.js):
@Component({
  template: \`
    <p>{{ data }}</p>
    <button (click)="loadData()">Load</button>
  \`
})
export class TraditionalComponent {
  data = '';
  
  constructor(private http: HttpClient) {}
  
  loadData() {
    this.http.get('/api/data').subscribe(response => {
      this.data = response.data;
      // Zone.js automatically triggers change detection
    });
  }
}

// After (zoneless with OnPush):
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <p>{{ data }}</p>
    <button (click)="loadData()">Load</button>
  \`
})
export class ZonelessComponent {
  data = '';
  
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  
  loadData() {
    this.http.get('/api/data').subscribe(response => {
      this.data = response.data;
      this.cdr.markForCheck(); // Explicit change detection
    });
  }
}

// Better (zoneless with signals):
@Component({
  template: \`
    <p>{{ data() }}</p>
    <button (click)="loadData()">Load</button>
  \`
})
export class ZonelessSignalComponent {
  data = signal('');
  
  constructor(private http: HttpClient) {}
  
  loadData() {
    this.http.get('/api/data').subscribe(response => {
      this.data.set(response.data);
      // Signal change automatically triggers change detection
    });
  }
}

// 6. PERFORMANCE BENEFITS

// Bundle Size:
// - With Zone.js: ~15KB larger bundle
// - Zoneless: No Zone.js overhead

// Startup Performance:
// - With Zone.js: Monkey patching overhead at bootstrap
// - Zoneless: Direct browser API usage

// Runtime Performance:
// - With Zone.js: All async operations wrapped
// - Zoneless: Only explicit triggers

// Memory Usage:
// - With Zone.js: Zone context tracking overhead
// - Zoneless: No zone context needed

// Predictability:
// - With Zone.js: Automatic but sometimes unexpected
// - Zoneless: Explicit and predictable

// 7. COMPATIBILITY

// Apps using OnPush strategy work immediately in zoneless:
// ✅ OnPush components
// ✅ Async pipe (uses markForCheck)
// ✅ Signal components
// ✅ Manual markForCheck() calls
// ✅ Event handlers
// ✅ Dynamic component creation

// Apps that need migration:
// ❌ Relying on Zone.js for third-party libraries
// ❌ Manual setTimeout without change detection
// ❌ Direct DOM event listeners without Angular
// ❌ WebSocket callbacks without markForCheck

// ZONELESS FUTURE:
// - Default in Angular 20+
// - Signal-first applications
// - Better integration with web standards
// - Improved performance across the board`,
      explanation:
        'Zoneless Angular replaces Zone.js with explicit scheduling, providing better performance and predictability while maintaining compatibility with OnPush components.',
    },
    diagram: {
      type: 'zoneless-architecture',
      title: 'Zoneless vs Zone.js Architecture',
      animated: true,
    },
    problemSolution: {
      problem:
        'Zone.js adds 15KB to bundle size, monkey patches browser APIs, and can cause unpredictable behavior in complex applications.',
      solution:
        'Zoneless Angular uses explicit change detection scheduling with native browser APIs, providing better performance and predictability.',
      benefits: [
        'Smaller bundle size (-15KB)',
        'Better startup performance',
        'Lower memory usage',
        'More predictable behavior',
      ],
      implementation:
        'Use provideZonelessChangeDetection() and ensure components use OnPush strategy or signals for optimal performance.',
    },
  },
  {
    id: 'signal-inputs-queries',
    title: 'Signal Inputs and Queries: The New Component API',
    subtitle: 'Modern Angular Component Architecture',
    content: [
      {
        type: 'text',
        content:
          'Angular 17+ introduces signal-based inputs and queries, providing a more reactive and type-safe way to handle component inputs and DOM queries.',
      },
      {
        type: 'bullet',
        content: 'New signal-based APIs:',
        subItems: [
          'input() - Signal-based component inputs',
          'input.required() - Required signal inputs',
          'model() - Two-way binding with signals',
          'viewChild() - Signal-based view queries',
          'viewChildren() - Signal-based view children queries',
          'contentChild() / contentChildren() - Signal-based content queries',
        ],
      },
      {
        type: 'highlight',
        content:
          'Signal inputs and queries are automatically reactive and integrate seamlessly with computed signals and effects.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Signal Inputs and Queries Complete Guide',
      code: `// ✅ SIGNAL INPUTS

@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="user-profile">
      <h2>{{ displayName() }}</h2>
      <p>{{ user().email }}</p>
      <p>Theme: {{ user().preferences?.theme || 'default' }}</p>
      <p>Age Category: {{ ageCategory() }}</p>
      
      <!-- Optional inputs with defaults -->
      <div [class]="theme()">
        <p>Show details: {{ showDetails() }}</p>
      </div>
      
      <!-- Two-way binding with model -->
      <input [(ngModel)]="searchTerm" placeholder="Search...">
      <p>Searching for: {{ searchTerm() }}</p>
      
      <!-- Template reference for viewChild -->
      <div #container class="container">
        <input #nameInput [value]="user().name" (input)="updateName($event)">
        <button #submitBtn (click)="save()">Save</button>
      </div>
      
      <!-- Multiple elements for viewChildren -->
      <div class="buttons">
        <button #actionBtn *ngFor="let action of actions" (click)="executeAction(action)">
          {{ action }}
        </button>
      </div>
    </div>
  \`
})
export class UserProfileComponent implements AfterViewInit {
  // ✅ REQUIRED SIGNAL INPUTS
  user = input.required<User>(); // Must be provided by parent
  
  // ✅ OPTIONAL SIGNAL INPUTS WITH DEFAULTS
  theme = input<string>('light'); // Default value
  showDetails = input<boolean>(false);
  maxAge = input<number>(100);
  
  // ✅ SIGNAL INPUTS WITH TRANSFORMATION
  userId = input<number, string>(0, {
    transform: (value: string) => parseInt(value, 10)
  });
  
  // ✅ TWO-WAY BINDING WITH MODEL
  searchTerm = model<string>(''); // Creates input + output automatically
  
  // ✅ COMPUTED SIGNALS FROM INPUTS
  displayName = computed(() => {
    const user = this.user();
    const details = this.showDetails();
    return details ? \`\${user.name} (\${user.email})\` : user.name;
  });
  
  ageCategory = computed(() => {
    const age = this.user().age;
    const maxAge = this.maxAge();
    
    if (age < 18) return 'Minor';
    if (age < 65) return 'Adult';
    if (age <= maxAge) return 'Senior';
    return 'Ancient';
  });
  
  // ✅ SIGNAL VIEW QUERIES
  container = viewChild<ElementRef>('container'); // Single element
  nameInput = viewChild<ElementRef>('nameInput');
  submitBtn = viewChild<ElementRef>('submitBtn');
  
  // ✅ SIGNAL VIEW CHILDREN QUERIES
  actionButtons = viewChildren<ElementRef>('actionBtn'); // Multiple elements
  
  // ✅ SIGNAL CONTENT QUERIES
  customContent = contentChild<TemplateRef>('customTemplate');
  allContent = contentChildren<ElementRef>('contentItem');
  
  actions = ['Save', 'Cancel', 'Delete'];
  
  constructor() {
    // ✅ EFFECTS WITH SIGNAL INPUTS
    effect(() => {
      console.log(\`User changed: \${this.user().name}\`);
      console.log(\`Theme: \${this.theme()}\`);
    });
    
    // Effect with input validation
    effect(() => {
      const user = this.user();
      if (!user.email.includes('@')) {
        console.warn('Invalid email format');
      }
    });
    
    // Effect with search term
    effect(() => {
      const term = this.searchTerm();
      if (term.length > 2) {
        console.log(\`Searching for: \${term}\`);
        this.performSearch(term);
      }
    });
  }
  
  ngAfterViewInit() {
    // ✅ SIGNAL QUERIES ARE AVAILABLE IMMEDIATELY
    effect(() => {
      const container = this.container();
      if (container) {
        console.log('Container element:', container.nativeElement);
      }
    });
    
    effect(() => {
      const buttons = this.actionButtons();
      console.log(\`Found \${buttons.length} action buttons\`);
    });
    
    // Focus input when component loads
    effect(() => {
      const input = this.nameInput();
      if (input) {
        input.nativeElement.focus();
      }
    });
  }
  
  updateName(event: Event) {
    const target = event.target as HTMLInputElement;
    // Update parent through output (handled by framework)
    // Or emit custom event
  }
  
  save() {
    const user = this.user();
    console.log('Saving user:', user);
  }
  
  executeAction(action: string) {
    console.log(\`Executing action: \${action}\`);
  }
  
  private performSearch(term: string) {
    // Implement search logic
  }
}

// ✅ PARENT COMPONENT USING SIGNAL INPUTS

@Component({
  selector: 'app-parent',
  template: \`
    <div>
      <h1>Parent Component</h1>
      
      <!-- Signal inputs binding -->
      <app-user-profile
        [user]="currentUser()"
        [theme]="selectedTheme()"
        [showDetails]="showUserDetails()"
        [(searchTerm)]="globalSearchTerm"
      ></app-user-profile>
      
      <!-- Controls -->
      <div class="controls">
        <button (click)="toggleDetails()">Toggle Details</button>
        <button (click)="switchTheme()">Switch Theme</button>
        <button (click)="updateUser()">Update User</button>
      </div>
      
      <p>Global search: {{ globalSearchTerm() }}</p>
    </div>
  \`
})
export class ParentComponent {
  // Parent signals
  currentUser = signal<User>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    preferences: { theme: 'dark' }
  });
  
  selectedTheme = signal<string>('light');
  showUserDetails = signal<boolean>(false);
  globalSearchTerm = model<string>('');
  
  toggleDetails() {
    this.showUserDetails.update(show => !show);
  }
  
  switchTheme() {
    this.selectedTheme.update(theme => theme === 'light' ? 'dark' : 'light');
  }
  
  updateUser() {
    this.currentUser.update(user => ({
      ...user,
      name: 'Jane Doe',
      age: user.age + 1
    }));
  }
}

// ✅ ADVANCED SIGNAL QUERIES PATTERNS

@Component({
  selector: 'app-advanced-queries',
  template: \`
    <div>
      <!-- Dynamic content -->
      <div *ngFor="let item of items(); trackBy: trackByItem">
        <div #itemElement [attr.data-id]="item.id">{{ item.name }}</div>
      </div>
      
      <!-- Conditional content -->
      <div *ngIf="showModal()" #modal class="modal">
        <p>Modal content</p>
      </div>
    </div>
  \`
})
export class AdvancedQueriesComponent {
  items = signal([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);
  
  showModal = signal(false);
  
  // Query all item elements
  itemElements = viewChildren<ElementRef>('itemElement');
  
  // Query modal (may not exist)
  modal = viewChild<ElementRef>('modal');
  
  constructor() {
    // React to query changes
    effect(() => {
      const elements = this.itemElements();
      console.log(\`Found \${elements.length} item elements\`);
      
      // Apply styles or behavior to elements
      elements.forEach((el, index) => {
        el.nativeElement.style.animationDelay = \`\${index * 100}ms\`;
      });
    });
    
    // React to modal visibility
    effect(() => {
      const modalEl = this.modal();
      if (modalEl) {
        console.log('Modal is now visible');
        modalEl.nativeElement.focus();
      }
    });
  }
  
  trackByItem(index: number, item: any): number {
    return item.id;
  }
  
  addItem() {
    const newId = Math.max(...this.items().map(i => i.id)) + 1;
    this.items.update(items => [...items, { id: newId, name: \`Item \${newId}\` }]);
  }
  
  toggleModal() {
    this.showModal.update(show => !show);
  }
}`,
      explanation:
        'Signal inputs and queries provide automatic reactivity and type safety. They integrate seamlessly with computed signals and effects for powerful reactive patterns.',
    },
    problemSolution: {
      problem:
        'Traditional @Input decorators and ViewChild queries are not reactive and require lifecycle hooks for proper handling.',
      solution:
        'Signal inputs and queries provide automatic reactivity, type safety, and seamless integration with the signals ecosystem.',
      benefits: [
        'Automatic reactivity for inputs and queries',
        'Better type safety and IntelliSense',
        'No lifecycle hooks needed',
        'Seamless integration with computed and effects',
        'Cleaner, more declarative code',
      ],
      implementation:
        'Replace @Input with input(), @ViewChild with viewChild(), and use computed() and effect() to react to changes automatically.',
    },
  },
  {
    id: 'signals-state-management',
    title: 'Signals for State Management',
    subtitle: 'Building Reactive Applications with Signals',
    content: [
      {
        type: 'text',
        content:
          'Signals provide a powerful foundation for state management, enabling reactive patterns that are simpler and more performant than traditional approaches.',
      },
      {
        type: 'bullet',
        content: 'Signals state management benefits:',
        subItems: [
          'Fine-grained reactivity without subscriptions',
          'Automatic dependency tracking across components',
          'No need for complex state management libraries',
          'Built-in memoization and performance optimization',
          'Type-safe reactive programming',
          'Simplified testing and debugging',
        ],
      },
      {
        type: 'comparison',
        content: 'State Management Approaches:',
        comparison: {
          before: 'Traditional: Complex state libraries, subscriptions, manual change detection',
          after: 'Signals: Built-in reactivity, automatic updates, simplified patterns',
        },
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Complete Signals State Management Example',
      code: `// ✅ SIGNALS-BASED STATE MANAGEMENT

// State service with signals
@Injectable({
  providedIn: 'root'
})
export class TodoStateService {
  // Private writable signals
  private _todos = signal<Todo[]>([]);
  private _filter = signal<'all' | 'active' | 'completed'>('all');
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly signals
  todos = this._todos.asReadonly();
  filter = this._filter.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  
  // Computed state (derived signals)
  filteredTodos = computed(() => {
    const todos = this._todos();
    const filter = this._filter();
    
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  });
  
  activeTodosCount = computed(() => 
    this._todos().filter(todo => !todo.completed).length
  );
  
  completedTodosCount = computed(() => 
    this._todos().filter(todo => todo.completed).length
  );
  
  allCompleted = computed(() => 
    this._todos().length > 0 && this._todos().every(todo => todo.completed)
  );
  
  hasActiveTodos = computed(() => this.activeTodosCount() > 0);
  
  // Statistics
  statistics = computed(() => {
    const todos = this._todos();
    const total = todos.length;
    const active = this.activeTodosCount();
    const completed = this.completedTodosCount();
    
    return {
      total,
      active,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });
  
  constructor(private http: HttpClient) {
    // Load initial data
    this.loadTodos();
    
    // Auto-save effect
    effect(() => {
      const todos = this._todos();
      if (todos.length > 0) {
        this.autoSave(todos);
      }
    });
  }
  
  // Actions (state mutations)
  async loadTodos() {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      const todos = await this.http.get<Todo[]>('/api/todos').toPromise();
      this._todos.set(todos || []);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Failed to load todos');
    } finally {
      this._loading.set(false);
    }
  }
  
  addTodo(text: string) {
    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    this._todos.update(todos => [...todos, newTodo]);
  }
  
  toggleTodo(id: number) {
    this._todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
  
  updateTodoText(id: number, text: string) {
    this._todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, text: text.trim() } : todo
      )
    );
  }
  
  deleteTodo(id: number) {
    this._todos.update(todos => todos.filter(todo => todo.id !== id));
  }
  
  clearCompleted() {
    this._todos.update(todos => todos.filter(todo => !todo.completed));
  }
  
  toggleAll() {
    const allCompleted = this.allCompleted();
    this._todos.update(todos =>
      todos.map(todo => ({ ...todo, completed: !allCompleted }))
    );
  }
  
  setFilter(filter: 'all' | 'active' | 'completed') {
    this._filter.set(filter);
  }
  
  private autoSave(todos: Todo[]) {
    // Debounced auto-save logic
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

// ✅ COMPONENT USING SIGNALS STATE

@Component({
  selector: 'app-todo-list',
  template: \`
    <div class="todo-app">
      <header class="header">
        <h1>Todos</h1>
        <input
          #newTodoInput
          class="new-todo"
          placeholder="What needs to be done?"
          (keyup.enter)="addTodo(newTodoInput.value); newTodoInput.value = ''"
          [disabled]="todoState.loading()"
        >
      </header>
      
      <main class="main" *ngIf="todoState.todos().length > 0">
        <input
          #toggleAll
          class="toggle-all"
          type="checkbox"
          [checked]="todoState.allCompleted()"
          (change)="todoState.toggleAll()"
        >
        <label for="toggle-all">Mark all as complete</label>
        
        <ul class="todo-list">
          <li
            *ngFor="let todo of todoState.filteredTodos(); trackBy: trackByTodoId"
            [class.completed]="todo.completed"
            [class.editing]="editingTodoId() === todo.id"
          >
            <div class="view">
              <input
                class="toggle"
                type="checkbox"
                [checked]="todo.completed"
                (change)="todoState.toggleTodo(todo.id)"
              >
              <label (dblclick)="startEditing(todo.id)">{{ todo.text }}</label>
              <button class="destroy" (click)="todoState.deleteTodo(todo.id)"></button>
            </div>
            <input
              *ngIf="editingTodoId() === todo.id"
              #editInput
              class="edit"
              [value]="todo.text"
              (blur)="finishEditing(todo.id, editInput.value)"
              (keyup.enter)="finishEditing(todo.id, editInput.value)"
              (keyup.escape)="cancelEditing()"
            >
          </li>
        </ul>
      </main>
      
      <footer class="footer" *ngIf="todoState.todos().length > 0">
        <span class="todo-count">
          <strong>{{ todoState.activeTodosCount() }}</strong>
          {{ todoState.activeTodosCount() === 1 ? 'item' : 'items' }} left
        </span>
        
        <ul class="filters">
          <li>
            <a
              [class.selected]="todoState.filter() === 'all'"
              (click)="todoState.setFilter('all')"
            >All</a>
          </li>
          <li>
            <a
              [class.selected]="todoState.filter() === 'active'"
              (click)="todoState.setFilter('active')"
            >Active</a>
          </li>
          <li>
            <a
              [class.selected]="todoState.filter() === 'completed'"
              (click)="todoState.setFilter('completed')"
            >Completed</a>
          </li>
        </ul>
        
        <button
          class="clear-completed"
          *ngIf="todoState.completedTodosCount() > 0"
          (click)="todoState.clearCompleted()"
        >
          Clear completed
        </button>
      </footer>
      
      <!-- Statistics -->
      <div class="statistics" *ngIf="todoState.statistics() as stats">
        <p>Total: {{ stats.total }}</p>
        <p>Active: {{ stats.active }}</p>
        <p>Completed: {{ stats.completed }}</p>
        <p>Completion Rate: {{ stats.completionRate }}%</p>
      </div>
      
      <!-- Loading and Error States -->
      <div *ngIf="todoState.loading()" class="loading">Loading todos...</div>
      <div *ngIf="todoState.error() as error" class="error">{{ error }}</div>
    </div>
  \`
})
export class TodoListComponent {
  editingTodoId = signal<number | null>(null);
  
  constructor(public todoState: TodoStateService) {
    // Effects for side effects
    effect(() => {
      const stats = this.todoState.statistics();
      console.log('Todo statistics updated:', stats);
    });
    
    // Effect for notifications
    effect(() => {
      const completionRate = this.todoState.statistics().completionRate;
      if (completionRate === 100 && this.todoState.todos().length > 0) {
        console.log('🎉 All todos completed!');
      }
    });
  }
  
  addTodo(text: string) {
    if (text.trim()) {
      this.todoState.addTodo(text);
    }
  }
  
  startEditing(id: number) {
    this.editingTodoId.set(id);
  }
  
  finishEditing(id: number, text: string) {
    if (text.trim()) {
      this.todoState.updateTodoText(id, text);
    } else {
      this.todoState.deleteTodo(id);
    }
    this.editingTodoId.set(null);
  }
  
  cancelEditing() {
    this.editingTodoId.set(null);
  }
  
  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}

// ✅ GLOBAL STATE WITH SIGNALS

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // User state
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal(false);
  
  // UI state
  private _theme = signal<'light' | 'dark'>('light');
  private _sidebarOpen = signal(false);
  private _notifications = signal<Notification[]>([]);
  
  // Public readonly signals
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  theme = this._theme.asReadonly();
  sidebarOpen = this._sidebarOpen.asReadonly();
  notifications = this._notifications.asReadonly();
  
  // Computed global state
  unreadNotifications = computed(() =>
    this._notifications().filter(n => !n.read).length
  );
  
  userDisplayName = computed(() => {
    const user = this._currentUser();
    return user ? \`\${user.firstName} \${user.lastName}\` : 'Guest';
  });
  
  constructor() {
    // Persist theme changes
    effect(() => {
      localStorage.setItem('theme', this.theme());
      document.body.className = this.theme();
    });
    
    // Load persisted state
    this.loadPersistedState();
  }
  
  // Actions
  login(user: User) {
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }
  
  logout() {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
  
  toggleTheme() {
    this._theme.update(theme => theme === 'light' ? 'dark' : 'light');
  }
  
  toggleSidebar() {
    this._sidebarOpen.update(open => !open);
  }
  
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false
    };
    
    this._notifications.update(notifications => [newNotification, ...notifications]);
  }
  
  markNotificationAsRead(id: number) {
    this._notifications.update(notifications =>
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }
  
  private loadPersistedState() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this._theme.set(savedTheme);
    }
  }
}`,
      explanation:
        'Signals provide a complete state management solution with automatic reactivity, computed state, and effects for side effects, eliminating the need for complex state libraries.',
    },
    problemSolution: {
      problem:
        'Traditional state management requires complex libraries, manual subscriptions, and careful change detection management.',
      solution:
        'Signals provide built-in reactive state management with automatic dependency tracking, computed state, and effects for side effects.',
      benefits: [
        'No external state management library needed',
        'Automatic reactivity and updates',
        'Built-in performance optimizations',
        'Type-safe reactive programming',
        'Simplified testing and debugging',
        'Fine-grained reactivity',
      ],
      implementation:
        'Use services with private writable signals and public readonly signals, computed for derived state, and effects for side effects.',
    },
  },
  {
    id: 'signal-based-components-future',
    title: 'Signal-Based Components: The Future',
    subtitle: 'Beyond Change Detection to Native Unidirectional Data Flow',
    content: [
      {
        type: 'text',
        content:
          'The future of Angular lies in signal-only components that eliminate the need for traditional change detection entirely. This represents a fundamental shift from "change detection" to "reactive updates".',
      },
      {
        type: 'bullet',
        content: 'Signal-first future features:',
        subItems: [
          'No OnPush strategy needed - signals handle reactivity',
          'No Zone.js dependency - pure reactive scheduling',
          'Native unidirectional data flow without complexity',
          'Component-level reactivity instead of tree-level checking',
          'Automatic dead code elimination for unused bindings',
          'Perfect integration with web standards and performance APIs',
        ],
      },
      {
        type: 'highlight',
        content:
          '🔮 In the signal-first future, we won\'t call it "change detection" anymore - it becomes "reactive updates" with surgical precision.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Signal-Only Components: The Future Vision',
      code: `// FUTURE VISION: Signal-only components (Angular 20+)

// Traditional component (Angular 2-19):
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // Manual optimization
  template: \`
    <div>
      <h2>{{ user.name }}</h2>
      <p>Posts: {{ user.posts.length }}</p>
      <p>Status: {{ userStatus }}</p>
      <button (click)="updateUser()">Update</button>
    </div>
  \`
})
export class TraditionalComponent implements OnChanges {
  @Input() user!: User;
  userStatus = '';
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnChanges() {
    this.userStatus = this.user.isActive ? 'Active' : 'Inactive';
    this.cdr.markForCheck(); // Manual change detection
  }
  
  updateUser() {
    // Update logic with manual change detection management
    this.user = { ...this.user, name: 'Updated' };
    this.cdr.markForCheck();
  }
}

// FUTURE: Signal-only component (Angular 20+):
@Component({
  // No changeDetection strategy needed!
  // No OnPush, no Zone.js, no manual change detection
  template: \`
    <div>
      <h2>{{ user().name }}</h2>
      <p>Posts: {{ user().posts.length }}</p>
      <p>Status: {{ userStatus() }}</p>
      <button (click)="updateUser()">Update</button>
    </div>
  \`
})
export class SignalOnlyComponent {
  // Signal inputs - automatically reactive
  user = input.required<User>();
  
  // Computed signals - automatically update when dependencies change
  userStatus = computed(() => 
    this.user().isActive ? 'Active' : 'Inactive'
  );
  
  // No constructor, no lifecycle hooks, no manual change detection!
  
  updateUser() {
    // Direct signal update - automatically triggers reactive updates
    this.user.update(current => ({ ...current, name: 'Updated' }));
    // userStatus() automatically recalculates
    // DOM updates surgically where needed
    // No change detection cycle needed!
  }
}

// ADVANCED FUTURE: Functional Signal Components
export const UserCard = signalComponent<{ user: User }>((props) => {
  // Pure functional approach
  const user = props.user;
  const userStatus = computed(() => user().isActive ? 'Active' : 'Inactive');
  const postCount = computed(() => user().posts.length);
  
  const updateUser = () => {
    user.update(current => ({ ...current, lastSeen: new Date() }));
  };
  
  // Return template function
  return () => html\`
    <div class="user-card">
      <h3>\${user().name}</h3>
      <p>Posts: \${postCount()}</p>
      <p>Status: \${userStatus()}</p>
      <button onclick=\${updateUser}>Update</button>
    </div>
  \`;
});

// REACTIVE SYSTEM COMPARISON:

// Current Angular (v17-19): "Change Detection"
// 1. Event occurs
// 2. Mark components dirty
// 3. Run change detection cycle
// 4. Check all bindings in component tree
// 5. Update DOM where changes found
// 6. Clear dirty flags

// Future Angular (v20+): "Reactive Updates"  
// 1. Signal value changes
// 2. Notify dependent computed signals
// 3. Update only affected DOM bindings
// 4. No component tree traversal
// 5. No change detection cycle
// 6. Pure reactivity

// PERFORMANCE IMPLICATIONS:

// Traditional Change Detection:
// - O(n) complexity where n = number of components
// - Checks all bindings in all components
// - Top-down tree traversal required
// - Zone.js overhead for async operations

// Signal-Only Reactive Updates:
// - O(k) complexity where k = number of changed signals
// - Updates only affected DOM nodes
// - No tree traversal needed
// - No Zone.js overhead

// MIGRATION PATH:

// Phase 1 (Angular 17-19): Hybrid
@Component({
  template: \`
    <!-- Mix of traditional and signals -->
    <p>{{ traditionalProperty }}</p>
    <p>{{ signalProperty() }}</p>
  \`
})
export class HybridComponent {
  traditionalProperty = 'old way';
  signalProperty = signal('new way');
}

// Phase 2 (Angular 20+): Signal-first
@Component({
  template: \`
    <!-- All signals -->
    <p>{{ property() }}</p>
    <p>{{ computedProperty() }}</p>
  \`
})
export class SignalFirstComponent {
  property = signal('signal way');
  computedProperty = computed(() => this.property().toUpperCase());
}

// Phase 3 (Angular 21+): Pure functional
export const PureFunctionalComponent = signalComponent(() => {
  const state = signal({ count: 0, message: 'Hello' });
  const displayMessage = computed(() => 
    \`\${state().message} (\${state().count})\`
  );
  
  return () => html\`
    <div>
      <p>\${displayMessage()}</p>
      <button onclick=\${() => state.update(s => ({ ...s, count: s.count + 1 }))}>
        Increment
      </button>
    </div>
  \`;
});

// BENEFITS OF SIGNAL-ONLY FUTURE:

// 1. PERFORMANCE:
//    - No change detection overhead
//    - Surgical DOM updates only
//    - No component tree traversal
//    - Automatic dead code elimination

// 2. DEVELOPER EXPERIENCE:
//    - No OnPush strategy needed
//    - No manual markForCheck calls
//    - No lifecycle hook complexity
//    - Simpler mental model

// 3. BUNDLE SIZE:
//    - No Zone.js (15KB saved)
//    - No change detection code
//    - Tree-shakeable reactive system
//    - Smaller runtime footprint

// 4. PREDICTABILITY:
//    - Pure reactive data flow
//    - No hidden change detection cycles
//    - Explicit dependencies
//    - Easier debugging and testing

// 5. WEB STANDARDS INTEGRATION:
//    - Works with native web components
//    - Compatible with other frameworks
//    - Better SSR performance
//    - Future-proof architecture

// THE VISION: From "Change Detection" to "Reactivity"
//
// Current: "When should we check for changes?"
// Future:  "What changed and where should we update?"
//
// Current: Pull-based (Angular asks: "did anything change?")
// Future:  Push-based (Signals say: "I changed, update me!")
//
// Current: Component tree traversal
// Future:  Direct signal-to-DOM updates
//
// This is the future of frontend frameworks - not just Angular!`,
      explanation:
        'Signal-only components represent the future of Angular, eliminating change detection entirely in favor of pure reactive updates with surgical precision.',
    },
    diagram: {
      type: 'future-roadmap',
      title: 'Signal-Based Components Future Vision',
      animated: true,
    },
    problemSolution: {
      problem:
        'Traditional change detection, even with optimizations, still requires checking components and traversing trees, creating overhead.',
      solution:
        'Signal-only components eliminate change detection entirely, using pure reactivity to update only the specific DOM nodes that depend on changed signals.',
      benefits: [
        'No change detection overhead',
        'Surgical DOM updates only',
        'Simpler developer experience',
        'Better performance characteristics',
      ],
      implementation:
        'Future Angular versions will support signal-only components that work purely through reactive updates without any change detection cycles.',
    },
  },
  {
    id: 'signals-migration-strategy',
    title: 'Migration Strategy: From Traditional to Signals',
    subtitle: 'Practical Steps for Adopting Signals',
    content: [
      {
        type: 'text',
        content:
          "Migrating from traditional Angular patterns to signals requires a strategic approach. Here's a practical guide for incrementally adopting signals in existing applications.",
      },
      {
        type: 'bullet',
        content: 'Migration strategy steps:',
        subItems: [
          '1. Start with new components using signal inputs',
          '2. Convert simple @Input properties to input()',
          '3. Replace ViewChild queries with viewChild()',
          '4. Migrate computed properties to computed()',
          '5. Convert services to use signals for state',
          '6. Replace RxJS subscriptions with effects',
        ],
      },
      {
        type: 'highlight',
        content:
          'Signals are fully interoperable with existing Angular patterns, allowing for gradual migration without breaking changes.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Step-by-Step Migration Guide',
      code: `// ❌ BEFORE: Traditional Angular Component
@Component({
  selector: 'app-user-card-old',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p>Status: {{ userStatus }}</p>
      <p>Posts: {{ user.posts.length }}</p>
      <button #editBtn (click)="edit()">Edit</button>
    </div>
  \`
})
export class UserCardOldComponent implements OnInit, OnChanges, OnDestroy {
  @Input() user!: User;
  @Input() showDetails = false;
  @Output() userEdit = new EventEmitter<User>();
  
  @ViewChild('editBtn') editButton!: ElementRef;
  
  userStatus = '';
  private subscription = new Subscription();
  
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.subscription.add(
      this.userService.getUserStatus(this.user.id).subscribe(status => {
        this.userStatus = status;
        this.cdr.markForCheck();
      })
    );
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.updateUserStatus();
    }
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  private updateUserStatus() {
    this.userStatus = this.user.isActive ? 'Active' : 'Inactive';
  }
  
  edit() {
    this.userEdit.emit(this.user);
  }
}

// ✅ AFTER: Signals-Based Component
@Component({
  selector: 'app-user-card-new',
  template: \`
    <div class="user-card">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <p>Status: {{ userStatus() }}</p>
      <p>Posts: {{ user().posts.length }}</p>
      @if (showDetails()) {
        <div class="details">
          <p>Created: {{ user().createdAt | date }}</p>
          <p>Last login: {{ user().lastLogin | date }}</p>
        </div>
      }
      <button #editBtn (click)="edit()">Edit</button>
    </div>
  \`
})
export class UserCardNewComponent {
  // ✅ Step 1: Convert @Input to input()
  user = input.required<User>();
  showDetails = input<boolean>(false);
  
  // ✅ Step 2: Convert @Output (still works the same)
  @Output() userEdit = new EventEmitter<User>();
  
  // ✅ Step 3: Convert @ViewChild to viewChild()
  editButton = viewChild<ElementRef>('editBtn');
  
  // ✅ Step 4: Convert computed properties to computed()
  userStatus = computed(() => 
    this.user().isActive ? 'Active' : 'Inactive'
  );
  
  constructor(private userService: UserService) {
    // ✅ Step 5: Replace subscriptions with effects
    effect(() => {
      const userId = this.user().id;
      console.log(\`User changed: \${userId}\`);
      // Effects can handle async operations too
    });
    
    // ✅ Step 6: Effect for view child access
    effect(() => {
      const button = this.editButton();
      if (button) {
        console.log('Edit button available');
      }
    });
  }
  
  edit() {
    this.userEdit.emit(this.user());
  }
}

// ✅ MIGRATION STRATEGY FOR SERVICES

// ❌ BEFORE: Traditional RxJS Service
@Injectable()
export class UserServiceOld {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  
  activeUsers$ = this.users$.pipe(
    map(users => users.filter(u => u.isActive))
  );
  
  constructor(private http: HttpClient) {}
  
  loadUsers() {
    this.loadingSubject.next(true);
    this.http.get<User[]>('/api/users').subscribe({
      next: users => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }
  
  addUser(user: User) {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, user]);
  }
}

// ✅ AFTER: Signals-Based Service
@Injectable()
export class UserServiceNew {
  // ✅ Step 1: Convert BehaviorSubjects to signals
  private _users = signal<User[]>([]);
  private _loading = signal<boolean>(false);
  
  // ✅ Step 2: Expose readonly signals
  users = this._users.asReadonly();
  loading = this._loading.asReadonly();
  
  // ✅ Step 3: Convert derived observables to computed
  activeUsers = computed(() => 
    this._users().filter(u => u.isActive)
  );
  
  constructor(private http: HttpClient) {}
  
  // ✅ Step 4: Update methods to use signals
  async loadUsers() {
    this._loading.set(true);
    try {
      const users = await this.http.get<User[]>('/api/users').toPromise();
      this._users.set(users || []);
    } finally {
      this._loading.set(false);
    }
  }
  
  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }
}

// ✅ INTEROPERABILITY: Mixing Signals and Observables

@Component({
  selector: 'app-mixed-approach',
  template: \`
    <div>
      <!-- Signals in template -->
      <h2>{{ title() }}</h2>
      <p>Count: {{ count() }}</p>
      
      <!-- Observables with async pipe -->
      <p>Data: {{ data$ | async }}</p>
      
      <!-- Mixed reactive patterns -->
      <p>Combined: {{ combinedValue() }}</p>
    </div>
  \`
})
export class MixedApproachComponent implements OnInit {
  // Signals
  title = signal('Mixed Approach');
  count = signal(0);
  
  // Observables (existing code)
  data$ = this.http.get<any>('/api/data');
  
  // Convert observable to signal
  dataSignal = toSignal(this.data$, { initialValue: null });
  
  // Computed combining signals and converted observables
  combinedValue = computed(() => {
    const count = this.count();
    const data = this.dataSignal();
    return data ? \`Count: \${count}, Data: \${data.value}\` : \`Count: \${count}\`;
  });
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    // Convert signal to observable when needed
    const count$ = toObservable(this.count);
    
    count$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(count => {
      console.log('Debounced count:', count);
    });
  }
  
  increment() {
    this.count.update(c => c + 1);
  }
}

// ✅ MIGRATION CHECKLIST

/*
PHASE 1: New Development
- ✅ Use input() for all new component inputs
- ✅ Use viewChild() for new DOM queries
- ✅ Use computed() for derived values
- ✅ Use effect() for side effects

PHASE 2: Existing Components
- ✅ Convert simple @Input to input()
- ✅ Convert @ViewChild to viewChild()
- ✅ Replace getter methods with computed()
- ✅ Convert ngOnChanges to effects

PHASE 3: Services
- ✅ Convert BehaviorSubject to signal()
- ✅ Convert derived observables to computed()
- ✅ Replace subscription management with effects
- ✅ Use toSignal() for existing observables

PHASE 4: Advanced Patterns
- ✅ Implement signal-based state management
- ✅ Convert complex reactive patterns
- ✅ Optimize performance with signals
- ✅ Remove unnecessary OnPush strategies

INTEROPERABILITY HELPERS:
- toSignal(observable) - Convert Observable to Signal
- toObservable(signal) - Convert Signal to Observable
- Signals work with async pipe
- Effects can handle async operations
*/

// ✅ TESTING SIGNALS

describe('SignalsComponent', () => {
  let component: UserCardNewComponent;
  let fixture: ComponentFixture<UserCardNewComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserCardNewComponent]
    });
    
    fixture = TestBed.createComponent(UserCardNewComponent);
    component = fixture.componentInstance;
  });
  
  it('should update computed when input changes', () => {
    // Set initial input
    fixture.componentRef.setInput('user', { 
      id: 1, 
      name: 'John', 
      isActive: true 
    });
    fixture.detectChanges();
    
    expect(component.userStatus()).toBe('Active');
    
    // Update input
    fixture.componentRef.setInput('user', { 
      id: 1, 
      name: 'John', 
      isActive: false 
    });
    fixture.detectChanges();
    
    expect(component.userStatus()).toBe('Inactive');
  });
});`,
      explanation:
        'Migrate incrementally by starting with new components, converting inputs and queries, then services. Signals are fully interoperable with existing patterns.',
    },
    problemSolution: {
      problem:
        'Migrating large Angular applications to new patterns can be risky and time-consuming, requiring careful planning and execution.',
      solution:
        'Signals provide full interoperability with existing patterns, allowing for gradual, low-risk migration with immediate benefits.',
      benefits: [
        'Incremental migration without breaking changes',
        'Immediate benefits from partial adoption',
        'Full interoperability with existing code',
        'Reduced migration risk and effort',
        'Clear migration path and strategy',
      ],
      implementation:
        'Start with new components using signals, gradually convert existing components, and use interoperability helpers like toSignal() and toObservable().',
    },
  },
];

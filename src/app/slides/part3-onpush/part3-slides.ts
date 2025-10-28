import { SlideData } from '../../models/slide.interface';

export const part3OnPushSlides: SlideData[] = [
  {
    id: 'onpush-overview',
    title: 'Part 3: The Optimization (OnPush)',
    subtitle: 'Skipping Subtrees for Better Performance',
    content: [
      {
        type: 'text',
        content:
          "ChangeDetectionStrategy.OnPush is Angular's solution to the performance problem of checking every component on every cycle. It allows Angular to skip checking a component and its entire subtree unless specific conditions are met.",
      },
      {
        type: 'highlight',
        content:
          'OnPush transforms components into "pure" components, meaning their view should only change if their inputs change by reference or specific events occur.',
      },
      {
        type: 'bullet',
        content: 'The problem OnPush solves:',
        subItems: [
          'Default strategy checks every component on every cycle',
          'Large component trees create performance bottlenecks',
          "Unnecessary checks for components that haven't changed",
          'Zone.js triggers can be very frequent',
          'CPU waste on redundant comparisons',
          'Poor user experience in complex applications',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'OnPush Strategy Basic Implementation',
      code: `// ❌ Default Strategy - Always Checked
@Component({
  selector: 'app-user-card-default',
  // Default strategy (ChangeDetectionStrategy.Default) is implicit
  template: \`
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p>Last seen: {{ formatDate(user.lastSeen) }}</p>
      <span class="status">{{ getStatusText() }}</span>
    </div>
  \`
})
export class UserCardDefaultComponent {
  @Input() user!: User;
  
  formatDate(date: Date) {
    console.log('formatDate called!'); // Logs on EVERY change detection cycle!
    return date.toLocaleDateString();
  }
  
  getStatusText() {
    console.log('getStatusText called!'); // Logs on EVERY change detection cycle!
    return this.user.isOnline ? 'Online' : 'Offline';
  }
}

// ✅ OnPush Strategy - Optimized Checking
@Component({
  selector: 'app-user-card-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p>Last seen: {{ formattedDate }}</p>
      <span class="status">{{ statusText }}</span>
      <button (click)="onEditClick()">Edit</button>
    </div>
  \`
})
export class UserCardOnPushComponent implements OnChanges {
  @Input() user!: User;
  @Output() editUser = new EventEmitter<User>();
  
  // Pre-computed values - calculated only when inputs change
  formattedDate = '';
  statusText = '';
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('OnPush: Input changed, recalculating...');
      this.formattedDate = this.user.lastSeen.toLocaleDateString();
      this.statusText = this.user.isOnline ? 'Online' : 'Offline';
    }
  }
  
  onEditClick() {
    // Event emission triggers change detection for this component
    this.editUser.emit(this.user);
  }
}

// Usage comparison
@Component({
  template: \`
    <div>
      <!-- Both components receive the same data -->
      <app-user-card-default [user]="currentUser"></app-user-card-default>
      <app-user-card-onpush [user]="currentUser" (editUser)="editUser($event)"></app-user-card-onpush>
      
      <!-- Unrelated update that triggers change detection -->
      <button (click)="updateCounter()">Counter: {{ counter }}</button>
    </div>
  \`
})
export class ComparisonComponent {
  currentUser: User = { name: 'John', email: 'john@example.com', lastSeen: new Date(), isOnline: true };
  counter = 0;
  
  updateCounter() {
    this.counter++;
    // Default component: formatDate() and getStatusText() will run
    // OnPush component: No methods will run (input didn't change)
  }
  
  editUser(user: User) {
    console.log('Editing user:', user);
  }
}`,
      explanation:
        'OnPush components only run change detection when inputs change by reference or events are emitted, dramatically reducing unnecessary checks.',
    },
    diagram: {
      type: 'onpush-tree',
      title: 'OnPush Strategy Component Tree',
      animated: false,
    },
    problemSolution: {
      problem:
        'Default change detection checks every component on every cycle, causing performance issues in applications with many components or complex templates.',
      solution:
        'OnPush strategy allows Angular to skip checking components and their subtrees unless specific conditions are met, dramatically improving performance.',
      benefits: [
        'Significant performance improvement',
        'Reduced CPU usage',
        'Better scalability for large applications',
        'Predictable change detection behavior',
      ],
      implementation:
        'Set changeDetection: ChangeDetectionStrategy.OnPush in component decorator and ensure proper input handling patterns.',
    },
  },
  {
    id: 'onpush-triggers',
    title: 'OnPush Triggers: When Change Detection Runs',
    subtitle: 'Understanding the Four Conditions',
    content: [
      {
        type: 'text',
        content:
          'OnPush components only trigger change detection under four specific conditions. Understanding these conditions is crucial for building reliable OnPush components.',
      },
      {
        type: 'bullet',
        content: 'OnPush change detection triggers:',
        subItems: [
          '1. Input property receives a new reference (not mutation)',
          '2. Event handler is fired within the component or its children',
          '3. Async pipe receives a new value from an Observable',
          '4. Manual trigger via ChangeDetectorRef.markForCheck()',
        ],
      },
      {
        type: 'highlight',
        content:
          'OnPush relies on reference equality checks. Mutating existing objects will NOT trigger change detection!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'OnPush Triggers Detailed Examples',
      code: `@Component({
  selector: 'app-onpush-triggers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <h3>{{ user.name }}</h3>
      <p>Posts: {{ user.posts.length }}</p>
      <p>Last update: {{ lastUpdate$ | async | date:'medium' }}</p>
      
      <button (click)="handleClick()">Click Me</button>
      <child-component (childEvent)="handleChildEvent($event)"></child-component>
    </div>
  \`
})
export class OnPushTriggersComponent {
  @Input() user!: User;
  
  // Observable for async pipe trigger
  lastUpdate$ = new BehaviorSubject(new Date());
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  // Trigger 2: Event handler execution
  handleClick() {
    console.log('Button clicked - change detection will run');
    // This event handler execution triggers change detection
  }
  
  // Trigger 2: Child event handler
  handleChildEvent(data: any) {
    console.log('Child event received - change detection will run');
    // Events from child components also trigger change detection
  }
  
  // Trigger 4: Manual change detection
  updateDataManually() {
    // Some external data update that OnPush won't detect
    this.updateExternalData();
    
    // Manually mark for check
    this.cdr.markForCheck();
    console.log('Manually marked for check - change detection will run');
  }
  
  // Trigger 3: Async pipe with new Observable value
  updateLastUpdate() {
    this.lastUpdate$.next(new Date());
    // Async pipe will automatically trigger change detection
  }
  
  private updateExternalData() {
    // External API call or data update
  }
}

// Parent component demonstrating input triggers
@Component({
  template: \`
    <app-onpush-triggers [user]="currentUser"></app-onpush-triggers>
    
    <div>
      <button (click)="mutateUser()">❌ Mutate User (Won't Work)</button>
      <button (click)="updateUserImmutable()">✅ Update User (Will Work)</button>
      <button (click)="addPost()">Add Post</button>
    </div>
  \`
})
export class ParentComponent {
  currentUser: User = {
    name: 'John',
    email: 'john@example.com',
    posts: []
  };
  
  // ❌ Trigger 1: This WON'T work with OnPush
  mutateUser() {
    this.currentUser.name = 'Jane'; // Same object reference!
    console.log('User mutated - OnPush component WON\'T update');
    // OnPush component won't detect this change
  }
  
  // ✅ Trigger 1: This WILL work with OnPush
  updateUserImmutable() {
    this.currentUser = {
      ...this.currentUser,
      name: 'Jane'
    }; // New object reference!
    console.log('User updated immutably - OnPush component WILL update');
  }
  
  // ✅ Trigger 1: Array updates with new reference
  addPost() {
    this.currentUser = {
      ...this.currentUser,
      posts: [...this.currentUser.posts, { id: Date.now(), title: 'New Post' }]
    };
    console.log('Post added immutably - OnPush component WILL update');
  }
}

// Advanced: Conditional OnPush triggers
@Component({
  selector: 'app-conditional-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <h3>Conditional Updates</h3>
      <p>Count: {{ count }}</p>
      <p>Should update: {{ shouldUpdate }}</p>
    </div>
  \`
})
export class ConditionalOnPushComponent implements OnChanges {
  @Input() data: any;
  
  count = 0;
  shouldUpdate = false;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // Custom logic to determine if update is needed
      const oldValue = changes['data'].previousValue;
      const newValue = changes['data'].currentValue;
      
      this.shouldUpdate = this.hasSignificantChange(oldValue, newValue);
      
      if (this.shouldUpdate) {
        this.count++;
        console.log('Significant change detected, updating component');
      } else {
        // Even though input changed, we decide not to update
        console.log('Change not significant, skipping update');
        // Could call cdr.detach() to prevent this cycle
      }
    }
  }
  
  private hasSignificantChange(oldValue: any, newValue: any): boolean {
    // Custom comparison logic
    if (!oldValue || !newValue) return true;
    
    // Only update if certain properties changed
    return oldValue.importantField !== newValue.importantField;
  }
}`,
      explanation:
        'OnPush components have four specific triggers. Understanding and properly implementing these triggers is essential for reliable OnPush behavior.',
    },
    problemSolution: {
      problem:
        'Developers often struggle with OnPush components not updating when expected, usually due to object mutations instead of reference changes.',
      solution:
        'Understanding the four OnPush triggers and implementing proper immutable update patterns ensures reliable component updates.',
      benefits: [
        'Predictable component update behavior',
        'Better performance through selective updates',
        'Clear understanding of when updates occur',
        'Easier debugging of change detection issues',
      ],
      implementation:
        'Use immutable update patterns for inputs, leverage async pipe for observables, and use ChangeDetectorRef for manual control when needed.',
    },
  },
  {
    id: 'immutability-deep-dive',
    title: 'Immutability Patterns for OnPush',
    subtitle: 'Mastering Reference-Based Change Detection',
    content: [
      {
        type: 'text',
        content:
          'OnPush strategy requires immutable data patterns to work correctly. Understanding and implementing these patterns is crucial for OnPush success.',
      },
      {
        type: 'comparison',
        content: 'Mutable vs Immutable Patterns:',
        comparison: {
          before: "Mutable: Modifies existing objects, same reference, OnPush won't detect changes",
          after: 'Immutable: Creates new objects, new reference, OnPush detects changes reliably',
        },
      },
      {
        type: 'bullet',
        content: 'Benefits of immutable patterns:',
        subItems: [
          'Guaranteed OnPush compatibility',
          'Predictable change detection behavior',
          'Time-travel debugging capabilities',
          'Better performance with proper memoization',
          'Easier testing and reasoning about state',
          'Integration with state management libraries',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Comprehensive Immutability Patterns',
      code: `interface User {
  id: number;
  name: string;
  email: string;
  profile: {
    avatar: string;
    preferences: {
      theme: string;
      notifications: boolean;
    };
  };
  posts: Post[];
  tags: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImmutabilityPatternsComponent {
  users: User[] = [];
  
  // ❌ MUTABLE PATTERNS - DON'T DO THIS WITH ONPUSH
  
  updateUserMutable(userId: number, newName: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.name = newName; // ❌ Mutating existing object
      user.profile.preferences.theme = 'dark'; // ❌ Nested mutation
    }
    // OnPush components won't detect these changes!
  }
  
  addUserMutable(newUser: User) {
    this.users.push(newUser); // ❌ Mutating existing array
    // OnPush components won't detect this change!
  }
  
  // ✅ IMMUTABLE PATTERNS - CORRECT FOR ONPUSH
  
  // Object updates with spread operator
  updateUserImmutable(userId: number, newName: string) {
    this.users = this.users.map(user =>
      user.id === userId
        ? { ...user, name: newName } // ✅ New object reference
        : user
    );
  }
  
  // Nested object updates
  updateUserTheme(userId: number, theme: string) {
    this.users = this.users.map(user =>
      user.id === userId
        ? {
            ...user,
            profile: {
              ...user.profile,
              preferences: {
                ...user.profile.preferences,
                theme // ✅ Immutable nested update
              }
            }
          }
        : user
    );
  }
  
  // Array operations
  addUserImmutable(newUser: User) {
    this.users = [...this.users, newUser]; // ✅ New array reference
  }
  
  removeUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId); // ✅ New array
  }
  
  updateUserAtIndex(index: number, updates: Partial<User>) {
    this.users = [
      ...this.users.slice(0, index),
      { ...this.users[index], ...updates },
      ...this.users.slice(index + 1)
    ]; // ✅ New array with updated object
  }
  
  // Array of objects updates
  addPostToUser(userId: number, newPost: Post) {
    this.users = this.users.map(user =>
      user.id === userId
        ? {
            ...user,
            posts: [...user.posts, newPost] // ✅ New posts array
          }
        : user
    );
  }
  
  updatePostInUser(userId: number, postId: number, updates: Partial<Post>) {
    this.users = this.users.map(user =>
      user.id === userId
        ? {
            ...user,
            posts: user.posts.map(post =>
              post.id === postId
                ? { ...post, ...updates } // ✅ New post object
                : post
            )
          }
        : user
    );
  }
  
  // Complex state updates with helper functions
  updateUserProfile(userId: number, profileUpdates: Partial<User['profile']>) {
    this.users = this.updateUserById(userId, user => ({
      ...user,
      profile: { ...user.profile, ...profileUpdates }
    }));
  }
  
  // Helper function for cleaner updates
  private updateUserById(userId: number, updateFn: (user: User) => User): User[] {
    return this.users.map(user =>
      user.id === userId ? updateFn(user) : user
    );
  }
  
  // Batch updates
  batchUpdateUsers(updates: { userId: number; changes: Partial<User> }[]) {
    this.users = this.users.map(user => {
      const update = updates.find(u => u.userId === user.id);
      return update ? { ...user, ...update.changes } : user;
    });
  }
}

// Using Immer for complex immutable updates
import { produce } from 'immer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImmerPatternsComponent {
  users: User[] = [];
  
  // ✅ Using Immer for complex updates
  updateUserWithImmer(userId: number, updates: Partial<User>) {
    this.users = produce(this.users, draft => {
      const user = draft.find(u => u.id === userId);
      if (user) {
        // Immer allows "mutable" syntax but creates immutable result
        Object.assign(user, updates);
      }
    });
  }
  
  // Complex nested updates with Immer
  updateNestedPreference(userId: number, key: string, value: any) {
    this.users = produce(this.users, draft => {
      const user = draft.find(u => u.id === userId);
      if (user) {
        user.profile.preferences[key] = value; // Looks mutable but isn't!
      }
    });
  }
  
  // Array manipulations with Immer
  reorderPosts(userId: number, fromIndex: number, toIndex: number) {
    this.users = produce(this.users, draft => {
      const user = draft.find(u => u.id === userId);
      if (user) {
        const [movedPost] = user.posts.splice(fromIndex, 1);
        user.posts.splice(toIndex, 0, movedPost);
      }
    });
  }
}

// Performance considerations
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformantImmutableComponent {
  largeDataSet: any[] = [];
  
  // ✅ Efficient updates for large datasets
  updateItemEfficiently(id: number, updates: any) {
    // Find index first to avoid multiple iterations
    const index = this.largeDataSet.findIndex(item => item.id === id);
    if (index !== -1) {
      this.largeDataSet = [
        ...this.largeDataSet.slice(0, index),
        { ...this.largeDataSet[index], ...updates },
        ...this.largeDataSet.slice(index + 1)
      ];
    }
  }
  
  // ✅ Batch updates for better performance
  batchUpdateItems(updates: Map<number, any>) {
    this.largeDataSet = this.largeDataSet.map(item =>
      updates.has(item.id)
        ? { ...item, ...updates.get(item.id) }
        : item
    );
  }
  
  // ✅ Memoized selectors for derived data
  @memoize()
  getFilteredItems(filter: string): any[] {
    return this.largeDataSet.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
}`,
      explanation:
        'Immutable patterns ensure OnPush components detect changes reliably. Use spread operators, array methods, or libraries like Immer for complex updates.',
    },
    problemSolution: {
      problem:
        "OnPush strategy requires reference changes to detect updates, but developers often use mutable operations that don't create new references.",
      solution:
        'Adopt comprehensive immutable data patterns that create new object references for every change, ensuring OnPush components detect all updates.',
      benefits: [
        'Guaranteed OnPush compatibility',
        'Predictable change detection behavior',
        'Better debugging and testing experience',
        'Time-travel debugging capabilities',
        'Performance benefits with memoization',
      ],
      implementation:
        'Use spread operators, Object.assign, Array methods like map/filter, or libraries like Immer for complex immutable updates.',
    },
  },
  {
    id: 'onpush-with-observables',
    title: 'OnPush with Observables and Async Pipe',
    subtitle: 'Reactive Programming with OnPush Strategy',
    content: [
      {
        type: 'text',
        content:
          'The async pipe is perfectly designed for OnPush components. It automatically handles subscriptions and triggers change detection when new values arrive.',
      },
      {
        type: 'bullet',
        content: 'Async pipe benefits with OnPush:',
        subItems: [
          'Automatically triggers change detection on new values',
          'Handles subscription management (subscribe/unsubscribe)',
          'Works seamlessly with OnPush strategy',
          'Prevents memory leaks',
          'Supports both Observables and Promises',
          'Handles null/undefined values gracefully',
        ],
      },
      {
        type: 'highlight',
        content:
          'The async pipe is the recommended pattern for consuming Observables in OnPush components, eliminating the need for manual subscription management.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'OnPush with Reactive Patterns',
      code: `@Component({
  selector: 'app-reactive-onpush',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="reactive-component">
      <!-- ✅ Async pipe automatically triggers OnPush -->
      <div *ngIf="loading$ | async" class="loading">Loading...</div>
      
      <div *ngFor="let user of users$ | async; trackBy: trackByUserId">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
      
      <!-- ✅ Multiple async pipes work perfectly -->
      <div class="stats">
        <p>Total: {{ (users$ | async)?.length || 0 }}</p>
        <p>Online: {{ onlineCount$ | async }}</p>
        <p>Last Update: {{ lastUpdate$ | async | date:'medium' }}</p>
      </div>
      
      <!-- ✅ Error handling with async pipe -->
      <div *ngIf="error$ | async as error" class="error">
        Error: {{ error.message }}
      </div>
      
      <!-- ✅ Complex derived data -->
      <div class="summary">
        <h4>Department Summary</h4>
        <div *ngFor="let dept of departmentSummary$ | async">
          {{ dept.name }}: {{ dept.count }} users ({{ dept.percentage }}%)
        </div>
      </div>
    </div>
  \`
})
export class ReactiveOnPushComponent implements OnInit {
  // Base observables
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<Error | null>;
  
  // Derived observables
  onlineCount$: Observable<number>;
  lastUpdate$: Observable<Date>;
  departmentSummary$: Observable<DepartmentSummary[]>;
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    // ✅ Create reactive data streams
    this.users$ = this.userService.getUsers().pipe(
      shareReplay(1), // Cache latest value
      catchError(error => {
        console.error('Error loading users:', error);
        return of([]); // Fallback to empty array
      })
    );
    
    this.loading$ = this.userService.loading$;
    this.error$ = this.userService.error$;
    
    // ✅ Derived observables - automatically update when source changes
    this.onlineCount$ = this.users$.pipe(
      map(users => users.filter(user => user.isOnline).length)
    );
    
    this.lastUpdate$ = this.users$.pipe(
      map(() => new Date()),
      startWith(new Date())
    );
    
    // ✅ Complex transformations
    this.departmentSummary$ = this.users$.pipe(
      map(users => this.calculateDepartmentSummary(users))
    );
  }
  
  // ✅ TrackBy function for performance
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
  
  private calculateDepartmentSummary(users: User[]): DepartmentSummary[] {
    const deptMap = new Map<string, number>();
    users.forEach(user => {
      const count = deptMap.get(user.department) || 0;
      deptMap.set(user.department, count + 1);
    });
    
    const total = users.length;
    return Array.from(deptMap.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }
}

// ❌ Anti-pattern: Manual subscription in OnPush
@Component({
  selector: 'app-manual-subscription',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <p>Users: {{ users.length }}</p>
      <p>Loading: {{ isLoading }}</p>
    </div>
  \`
})
export class ManualSubscriptionComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  private subscription = new Subscription();
  
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef // ❌ Need manual change detection
  ) {}
  
  ngOnInit() {
    // ❌ Manual subscription management required
    this.subscription.add(
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.cdr.markForCheck(); // ❌ Manual trigger needed
      })
    );
    
    this.subscription.add(
      this.userService.loading$.subscribe(loading => {
        this.isLoading = loading;
        this.cdr.markForCheck(); // ❌ Manual trigger needed
      })
    );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe(); // ❌ Manual cleanup required
  }
}

// ✅ Advanced reactive patterns with OnPush
@Component({
  selector: 'app-advanced-reactive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <!-- Search input -->
      <input #searchInput (input)="onSearchInput(searchInput.value)" placeholder="Search users...">
      
      <!-- Filtered results -->
      <div *ngFor="let user of filteredUsers$ | async">
        {{ user.name }} - {{ user.department }}
      </div>
      
      <!-- Pagination -->
      <div class="pagination">
        <button (click)="previousPage()" [disabled]="(currentPage$ | async) === 1">Previous</button>
        <span>Page {{ currentPage$ | async }} of {{ totalPages$ | async }}</span>
        <button (click)="nextPage()" [disabled]="(currentPage$ | async) === (totalPages$ | async)">Next</button>
      </div>
    </div>
  \`
})
export class AdvancedReactiveComponent implements OnInit {
  private searchSubject = new BehaviorSubject<string>('');
  private pageSubject = new BehaviorSubject<number>(1);
  private pageSize = 10;
  
  // Reactive streams
  search$ = this.searchSubject.asObservable();
  currentPage$ = this.pageSubject.asObservable();
  
  allUsers$: Observable<User[]>;
  filteredUsers$: Observable<User[]>;
  totalPages$: Observable<number>;
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.allUsers$ = this.userService.getUsers();
    
    // ✅ Reactive search with debouncing
    const searchResults$ = combineLatest([
      this.allUsers$,
      this.search$.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([users, searchTerm]) =>
        searchTerm
          ? users.filter(user =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.department.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : users
      )
    );
    
    // ✅ Reactive pagination
    this.filteredUsers$ = combineLatest([
      searchResults$,
      this.currentPage$
    ]).pipe(
      map(([users, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        return users.slice(startIndex, startIndex + this.pageSize);
      })
    );
    
    this.totalPages$ = searchResults$.pipe(
      map(users => Math.ceil(users.length / this.pageSize))
    );
    
    // ✅ Reset to first page when search changes
    this.search$.pipe(
      skip(1), // Skip initial value
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageSubject.next(1);
    });
  }
  
  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }
  
  nextPage() {
    this.pageSubject.next(this.pageSubject.value + 1);
  }
  
  previousPage() {
    this.pageSubject.next(Math.max(1, this.pageSubject.value - 1));
  }
}

// Service supporting reactive patterns
@Injectable()
export class ReactiveUserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<Error | null>(null);
  
  // Public observables
  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.errorSubject.next(error);
        this.loadingSubject.next(false);
        return throwError(error);
      })
    );
  }
  
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(\`/api/users/\${user.id}\`, user).pipe(
      tap(updatedUser => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.map(u =>
          u.id === updatedUser.id ? updatedUser : u
        );
        this.usersSubject.next(updatedUsers);
      })
    );
  }
}`,
      explanation:
        'The async pipe is the perfect companion for OnPush components, automatically handling subscriptions and triggering change detection when observables emit new values.',
    },
    problemSolution: {
      problem:
        'Manual subscription management in OnPush components is complex, error-prone, and requires manual change detection triggering.',
      solution:
        'The async pipe provides automatic subscription management and change detection triggering, making reactive programming with OnPush seamless.',
      benefits: [
        'Automatic subscription management',
        'No memory leaks',
        'Automatic change detection triggering',
        'Cleaner, more declarative templates',
        'Better performance with reactive patterns',
      ],
      implementation:
        'Use async pipe in templates for all Observable consumption, structure services to return Observables, and leverage reactive operators for data transformation.',
    },
  },
  {
    id: 'async-pipe-implementation',
    title: 'Async Pipe Implementation',
    subtitle: 'How Async Pipe Marks Components as Dirty',
    content: [
      {
        type: 'text',
        content:
          'The async pipe automatically calls ChangeDetectorRef.markForCheck() whenever the Observable emits a new value, ensuring OnPush components update correctly.',
      },
      {
        type: 'bullet',
        content: 'Async pipe internal flow:',
        subItems: [
          '1. Async pipe subscribes to the Observable/Promise',
          '2. When a new value is emitted',
          '3. Pipe calls _updateLatestValue(async, value)',
          '4. Inside this method: this._ref.markForCheck()',
          '5. This marks the component as dirty',
          '6. NgZone triggers change detection',
          '7. Component and children are checked',
        ],
      },
      {
        type: 'highlight',
        content:
          '💡 Key insight: The async pipe injects ChangeDetectorRef and calls markForCheck() automatically!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Async Pipe Internal Implementation',
      code: `// Simplified AsyncPipe implementation from Angular source
@Pipe()
export class AsyncPipe implements OnDestroy, PipeTransform {
  constructor(ref: ChangeDetectorRef) {}
  
  transform<T>(obj: Observable<T>): T|null {
    // code removed for brevity
  }
  
  private _updateLatestValue(async: any, value: Object): void {
    // code removed for brevity
    this._ref!.markForCheck(); // <-- marks component for check
  }
}

// How Angular's markForCheck() works internally
// From view_ref.ts
markForCheck(): void {
  markViewDirty(this._cdRefInjectingView || this._lView);
}`,
      explanation:
        'The async pipe is a smart pipe that automatically handles change detection by calling markForCheck() whenever new data arrives, making it perfect for OnPush components.',
    },
  },
  {
    id: 'async-pipe-marking-demo',
    title: 'data$ | async pipe marks component as dirty',
    subtitle: 'Visualizing Async Pipe Change Detection',
    content: [
      {
        type: 'text',
        content:
          'When you use the async pipe in an OnPush component, it automatically marks the component as dirty when the observable emits, triggering change detection for that component and its children.',
      },
      {
        type: 'bullet',
        content: 'What happens in the component tree:',
        subItems: [
          '1. Observable emits new value (data$)',
          '2. Async pipe receives the value',
          '3. Async pipe calls markForCheck()',
          '4. Component gets marked as dirty',
          '5. onMicrotaskEmpty event fires',
          '6. NgZone triggers change detection',
          '7. Dirty components and their children refresh',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Async Pipe with OnPush Component',
      code: `@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  \`
})
export class UserListComponent {
  // When this observable emits, async pipe marks component dirty
  users$ = this.userService.getUsers();
  
  constructor(private userService: UserService) {}
}

// The flow:
// 1. userService.getUsers() returns Observable<User[]>
// 2. Async pipe subscribes: users$.subscribe(value => ...)
// 3. When data arrives: async pipe calls this._ref.markForCheck()
// 4. Component marked dirty → bindings refreshed
// 5. DOM updated with new user list`,
      explanation:
        'The async pipe bridges the gap between reactive programming and OnPush change detection, automatically marking components dirty when observables emit.',
    },
    diagram: {
      type: 'dirty-marking-flow',
      title: 'Async Pipe Marking Components Dirty',
      animated: false,
    },
  },
  {
    id: 'broken-state-onpush',
    title: 'Broken State 💥',
    subtitle: "When OnPush Components Don't Refresh",
    content: [
      {
        type: 'text',
        content:
          'A common pitfall with OnPush is when components become "broken" - they have new data but don\'t refresh because they\'re not marked as dirty.',
      },
      {
        type: 'bullet',
        content: 'Broken state occurs when:',
        subItems: [
          '1. OnPush component is NOT dirty',
          '2. Parent component IS checked',
          '3. Child has async subscription WITHOUT async pipe',
          "4. Child receives data but doesn't call markForCheck()",
          '5. Result: Data updated but UI frozen! 💔',
        ],
      },
      {
        type: 'highlight',
        content:
          "⚠️ Critical: OnPush + Non-Dirty → Skip! The component and its entire subtree won't be refreshed.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Broken State Example',
      code: `// ❌ BROKEN: Manual subscription without markForCheck
@Component({
  selector: 'app-broken',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <p>User: {{ userData?.name }}</p>
      <!-- Won't update! Component not marked dirty -->
    </div>
  \`
})
export class BrokenComponent implements OnInit, OnDestroy {
  userData: User | null = null;
  private subscription: Subscription;
  
  ngOnInit() {
    // ❌ Manual subscription - data arrives but UI doesn't update
    this.subscription = this.userService.getUser().subscribe(data => {
      this.userData = data; // Data updated
      // Missing: this.cdr.markForCheck() ← This is the problem!
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

// ✅ FIXED: Use async pipe OR call markForCheck
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- ✅ Solution 1: Use async pipe -->
    <p>User: {{ (user$ | async)?.name }}</p>
    
    <!-- ✅ Solution 2: Manual with markForCheck -->
    <p>User: {{ userData?.name }}</p>
  \`
})
export class FixedComponent implements OnInit {
  // Solution 1: Use async pipe (recommended)
  user$ = this.userService.getUser();
  
  // Solution 2: Manual subscription with markForCheck
  userData: User | null = null;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit() {
    this.userService.getUser().subscribe(data => {
      this.userData = data;
      this.cdr.markForCheck(); // ✅ Mark component dirty
    });
  }
}

// The broken state tree visualization:
// OnPush + Non-Dirty → Skip this component and entire subtree
// Even if parent is checked, this component won't refresh!`,
      explanation:
        'Always use async pipe with OnPush, or manually call markForCheck() when handling async data. Otherwise your components become "broken" with stale UI.',
    },
    diagram: {
      type: 'onpush-tree',
      title: 'Broken State Component Tree',
      animated: false,
    },
  },
  {
    id: 'onpush-best-practices',
    title: 'OnPush Best Practices and Common Pitfalls',
    subtitle: 'Mastering OnPush for Production Applications',
    content: [
      {
        type: 'text',
        content:
          'Successfully implementing OnPush requires understanding common pitfalls and following established best practices. Here are the key patterns for OnPush success.',
      },
      {
        type: 'bullet',
        content: 'OnPush best practices:',
        subItems: [
          'Always use immutable update patterns for inputs',
          'Prefer async pipe over manual subscriptions',
          'Use ChangeDetectorRef judiciously for edge cases',
          'Implement proper trackBy functions for lists',
          'Avoid function calls in templates',
          'Test OnPush components thoroughly',
        ],
      },
      {
        type: 'comparison',
        content: 'OnPush Trade-offs:',
        comparison: {
          before: 'Default: Simple to use but can be inefficient with large component trees',
          after:
            'OnPush: Better performance but requires disciplined coding patterns and immutability',
        },
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'OnPush Best Practices - Clean & Focused',
      code: `// ✅ CLEAN OnPush Implementation
@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- ✅ Use async pipe for observables -->
    <div *ngIf="loading$ | async">Loading...</div>
    
    <!-- ✅ Pre-computed values -->
    <h2>{{ userDisplayName }}</h2>
    <p>Member since: {{ memberSince }}</p>
    
    <!-- ✅ Event handlers work automatically -->
    <button (click)="refresh()">Refresh</button>
    
    <!-- ✅ TrackBy for lists -->
    <div *ngFor="let post of posts; trackBy: trackByPostId">
      {{ post.title }}
    </div>
  \`
})
export class UserProfileComponent implements OnChanges {
  @Input() user!: User;
  @Input() posts!: Post[];
  
  // Pre-computed display values
  userDisplayName = '';
  memberSince = '';
  
  // Observable for async operations
  loading$ = new BehaviorSubject<boolean>(false);
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      // ✅ Update computed values when inputs change
      this.userDisplayName = \`\${this.user.firstName} \${this.user.lastName}\`;
      this.memberSince = this.user.joinDate.toLocaleDateString();
    }
  }
  
  // ✅ TrackBy for performance
  trackByPostId = (index: number, post: Post) => post.id;
  
  // ✅ Event handlers automatically trigger change detection
  refresh() {
    this.loading$.next(true);
    // Refresh logic here
    this.loading$.next(false);
  }
}

// ❌ COMMON PITFALLS TO AVOID
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- ❌ Function calls in templates (called every check) -->
    <p>{{ formatDate(user.joinDate) }}</p>
    
    <!-- ❌ Mutating objects (OnPush won't detect) -->
    <button (click)="mutateUser()">Won't Work</button>
    
    <!-- ❌ Manual subscriptions without markForCheck -->
    <p>{{ manualData }}</p>
  \`
})
export class OnPushPitfallsComponent {
  @Input() user!: User;
  manualData = '';
  
  ngOnInit() {
    // ❌ Manual subscription without change detection
    this.service.getData().subscribe(data => {
      this.manualData = data; // Won't update UI
      // Missing: this.cdr.markForCheck();
    });
  }
  
  // ❌ This won't trigger OnPush
  mutateUser() {
    this.user.name = 'New Name'; // Mutation - OnPush ignores
  }
  
  // ❌ Function called on every change detection
  formatDate(date: Date): string {
    return date.toLocaleDateString(); // Expensive operation repeated
  }
}

// Angular OnPush Decision Flow
if (component.changeDetection === OnPush) {
  if (component.isDirty || hasInputChanges || hasEventListener) {
    // ✅ Check bindings → Refresh bindings → Check children
    checkComponent(component);
  } else {
    // ⏭️ Skip this component and its subtree
    skipComponent(component);
  }
}`,
      explanation:
        'Following OnPush best practices ensures reliable, performant components. Avoid common pitfalls like function calls in templates and object mutations.',
    },
    problemSolution: {
      problem:
        "OnPush components can be tricky to implement correctly, with common pitfalls leading to components that don't update when expected or perform poorly.",
      solution:
        'Following established best practices and avoiding common pitfalls ensures OnPush components work reliably and provide the expected performance benefits.',
      benefits: [
        'Reliable component update behavior',
        'Maximum performance benefits',
        'Easier debugging and maintenance',
        'Better integration with reactive patterns',
        'Improved application scalability',
      ],
      implementation:
        'Use immutable patterns, async pipe, proper trackBy functions, avoid template function calls, and test OnPush behavior thoroughly.',
    },
  },
];

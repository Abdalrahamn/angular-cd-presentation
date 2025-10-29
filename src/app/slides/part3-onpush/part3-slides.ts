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
      title: 'OnPush Triggers: The Four Conditions',
      code: `@Component({
  selector: 'app-onpush-triggers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <h3>{{ user.name }}</h3>
      <p>Last update: {{ lastUpdate$ | async | date:'medium' }}</p>
      <button (click)="handleClick()">Click Me</button>
    </div>
  \`
})
export class OnPushTriggersComponent {
  @Input() user!: User; // Trigger 1: Input reference change
  lastUpdate$ = new BehaviorSubject(new Date()); // Trigger 3: Async pipe
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  // Trigger 2: Event handler execution
  handleClick() {
    console.log('Button clicked - change detection will run');
  }
  
  // Trigger 4: Manual change detection
  updateDataManually() {
    this.cdr.markForCheck();
    console.log('Manually marked for check');
  }
}

// Parent: Input reference changes
@Component({
  template: \`
    <app-onpush-triggers [user]="currentUser"></app-onpush-triggers>
    <button (click)="mutateUser()">❌ Mutate (Won't Work)</button>
    <button (click)="updateUserImmutable()">✅ New Reference (Works)</button>
  \`
})
export class ParentComponent {
  currentUser: User = { name: 'John', email: 'john@example.com' };
  
  // ❌ Mutation - same reference
  mutateUser() {
    this.currentUser.name = 'Jane'; // OnPush won't detect
  }
  
  // ✅ New reference - OnPush detects
  updateUserImmutable() {
    this.currentUser = { ...this.currentUser, name: 'Jane' };
  }
}`,
      explanation:
        'OnPush has four triggers: (1) Input reference change, (2) Event handlers, (3) Async pipe emissions, (4) Manual markForCheck(). Mutations are ignored!',
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
    id: 'onpush-with-observables',
    title: 'OnPush + Async Pipe: Perfect Match',
    subtitle: 'Reactive Programming Made Simple',
    content: [
      {
        type: 'text',
        content:
          'The async pipe is the ideal solution for OnPush components, automatically handling subscriptions and change detection.',
      },
      {
        type: 'bullet',
        content: 'Why async pipe + OnPush works perfectly:',
        subItems: [
          'Automatic change detection triggering',
          'No manual subscription management needed',
          'Prevents memory leaks automatically',
          'Clean, declarative template syntax',
          'Works with Observables and Promises',
        ],
      },
      {
        type: 'highlight',
        content:
          '✨ Best Practice: Always use async pipe with OnPush components for reactive data!',
      },
      {
        type: 'code-demo',
        content: '🎯 Interactive Demo: Experience async pipe + OnPush in action',
      },
    ],
    problemSolution: {
      problem:
        'Manual subscriptions in OnPush components require complex change detection management.',
      solution:
        'The async pipe eliminates complexity by automatically handling both subscriptions and change detection.',
      benefits: [
        'Zero boilerplate subscription code',
        'Automatic memory management',
        'Seamless OnPush integration',
        'Cleaner component architecture',
      ],
      implementation:
        'Replace manual subscriptions with async pipe in templates for all reactive data consumption.',
    },
  },
  {
    id: 'async-pipe-implementation',
    title: 'How Async Pipe Triggers OnPush Change Detection',
    subtitle: 'From Observable Emission to Component Update',
    content: [
      {
        type: 'text',
        content:
          'The async pipe automatically calls ChangeDetectorRef.markForCheck() whenever an Observable emits, ensuring OnPush components update correctly.',
      },
      {
        type: 'bullet',
        content: 'Complete flow from emission to UI update:',
        subItems: [
          '1. Observable emits new value (data$)',
          '2. Async pipe receives the value',
          '3. Pipe calls _updateLatestValue() internally',
          '4. Inside this method: this._ref.markForCheck()',
          '5. Component gets marked as dirty',
          '6. NgZone triggers change detection cycle',
          '7. Dirty components and their children refresh',
        ],
      },
      {
        type: 'highlight',
        content:
          '💡 Key insight: The async pipe bridges reactive programming and OnPush by automatically marking components dirty!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Simple Example: Async Pipe with OnPush',
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

// What happens internally:
// 1. users$ emits → 2. async pipe calls markForCheck() → 3. UI updates`,
      explanation:
        'The async pipe automatically handles the complexity of OnPush change detection, making reactive programming seamless.',
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
];

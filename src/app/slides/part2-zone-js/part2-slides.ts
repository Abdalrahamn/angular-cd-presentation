import { SlideData } from '../../models/slide.interface';

export const part2ZoneJsSlides: SlideData[] = [
  {
    id: 'synchronous-change-detection',
    title: 'Change Detection with Synchronous Code',
    subtitle: 'When Angular Can Safely Update the View',
    content: [
      {
        type: 'text',
        content:
          'With synchronous code, Angular can easily determine when to run change detection. After any synchronous operation completes, Angular knows it can safely check for changes and update the view.',
      },
      {
        type: 'bullet',
        content: 'How synchronous change detection works:',
        subItems: [
          'User triggers an event (click, input, etc.)',
          'Event handler executes synchronously',
          'Data changes happen immediately',
          'Angular runs change detection after the handler',
          'View updates reflect the changes',
          'Everything stays in sync perfectly',
        ],
      },
      {
        type: 'highlight',
        content:
          '✅ Synchronous operations are predictable - Angular knows exactly when they finish and can run change detection immediately after.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Synchronous Change Detection Example',
      code: `// ✅ SYNCHRONOUS CODE - Works perfectly with change detection

@Component({
  selector: 'app-sync-example',
  template: \`
    <div>
      <button (click)="changeName()">Change Name</button>
      <p>Current name: {{ name }}</p>
      <p>Click count: {{ clickCount }}</p>
    </div>
  \`
})
export class SyncExampleComponent {
  name = 'John';
  clickCount = 0;

  changeName() {
    // All these operations happen synchronously
    this.name = 'Jane';
    this.clickCount++;
    
    // Angular's imaginary internal flow:
    // 1. User clicks button
    // 2. changeName() method executes completely
    // 3. All data changes are done
    // 4. Angular runs change detection
    // 5. View updates with new values
    // 6. Everything is in sync! ✅
  }
}

// IMAGINARY ANGULAR INTERNAL CODE:
function handleDOMEvent(eventHandler: Function) {
  // Execute the event handler
  eventHandler();
  
  // Since everything is synchronous, we know it's safe to run change detection
  angular.runChangeDetection(); // This will see all the changes
}

// REAL ANGULAR INTERNAL CODE (simplified):
function wrapListenerIn_markDirtyAndPreventDefault(eventHandler: Function) {
  return function(event: Event) {
    // Execute user's event handler
    const result = eventHandler(event);
    
    // Mark the component as dirty for change detection
    markViewDirty(getCurrentLView());
    
    return result;
  };
}

// COMPONENT LIFECYCLE WITH SYNCHRONOUS CODE:
// 1. Initial render: name = 'John', clickCount = 0
// 2. User clicks button
// 3. changeName() executes: name = 'Jane', clickCount = 1
// 4. Angular detects changes and updates DOM
// 5. Final render: name = 'Jane', clickCount = 1

// WHY THIS WORKS:
// - No timing issues
// - No race conditions  
// - Predictable execution order
// - Angular can safely assume all changes are complete`,
      explanation:
        'Synchronous operations allow Angular to run change detection immediately after code execution, ensuring the view always reflects the current state.',
    },
    problemSolution: {
      problem:
        'Synchronous code execution is predictable, but real applications need asynchronous operations like HTTP requests, timers, and user interactions.',
      solution:
        'Angular handles synchronous operations perfectly by running change detection immediately after event handlers complete.',
      benefits: [
        'Predictable execution order',
        'No timing issues',
        'Guaranteed view consistency',
        'Simple mental model',
      ],
      implementation:
        'Angular automatically wraps event handlers and runs change detection after synchronous operations complete.',
    },
  },
  {
    id: 'asynchronous-problems',
    title: 'The Asynchronous Problem',
    subtitle: 'Why Traditional Change Detection Breaks Down',
    content: [
      {
        type: 'text',
        content:
          'Asynchronous operations break the simple synchronous model. When data changes happen inside setTimeout, HTTP requests, or Promises, Angular has no way to know when they complete.',
      },
      {
        type: 'bullet',
        content: 'Problems with asynchronous code:',
        subItems: [
          'Change detection runs before async operations complete',
          'View shows stale data until manual refresh',
          'No automatic notification when async work finishes',
          'Timing issues create inconsistent UI states',
          'Developers must manually trigger change detection',
          'Easy to forget, leading to bugs and poor UX',
        ],
      },
      {
        type: 'highlight',
        content:
          "❌ Asynchronous operations happen outside Angular's knowledge, breaking the automatic change detection cycle.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'The Asynchronous Problem Demonstrated',
      code: `// ❌ ASYNCHRONOUS CODE - Breaks change detection without Zone.js

@Component({
  selector: 'app-async-problem',
  template: \`
    <div>
      <button (click)="changeNameAsync()">Change Name (Async)</button>
      <p>Current name: {{ name }}</p>
      <p>Status: {{ status }}</p>
      <p>Last updated: {{ lastUpdated }}</p>
    </div>
  \`
})
export class AsyncProblemComponent {
  name = 'John';
  status = 'Ready';
  lastUpdated = 'Never';

  changeNameAsync() {
    this.status = 'Changing...'; // This change will be detected
    
    // ❌ PROBLEM: Asynchronous operation
    setTimeout(() => {
      this.name = 'Jane';
      this.status = 'Changed';
      this.lastUpdated = new Date().toLocaleTimeString();
      // Angular doesn't know these changes happened!
    }, 1000);
    
    // Angular's change detection runs HERE (immediately)
    // But the setTimeout callback hasn't executed yet!
  }
}

// WHAT ACTUALLY HAPPENS (without Zone.js):

// Step 1: User clicks button
function handleClick() {
  component.changeNameAsync();
  
  // Step 2: Synchronous part executes
  // status = 'Changing...' ✅
  
  // Step 3: setTimeout is scheduled (but callback not executed yet)
  
  // Step 4: Angular runs change detection immediately
  angular.runChangeDetection(); // Only sees status = 'Changing...'
  
  // Step 5: 1 second later, setTimeout callback executes
  // name = 'Jane', status = 'Changed', lastUpdated = current time
  // BUT Angular doesn't know about these changes! ❌
}

// TIMELINE BREAKDOWN:
// 
// Time 0ms:    User clicks button
// Time 0ms:    changeNameAsync() called
// Time 0ms:    status = 'Changing...'
// Time 0ms:    setTimeout scheduled
// Time 1ms:    Angular runs change detection
// Time 1ms:    View shows: name='John', status='Changing...'
// Time 1000ms: setTimeout callback executes
// Time 1000ms: name='Jane', status='Changed', lastUpdated=time
// Time 1000ms: View STILL shows: name='John', status='Changing...' ❌

// OTHER COMMON ASYNC SCENARIOS:

// HTTP Requests
loadUserData() {
  this.http.get('/api/user').subscribe(user => {
    this.user = user; // Angular doesn't know about this change!
  });
}

// Promises
async processData() {
  const result = await this.dataService.process();
  this.result = result; // Angular doesn't know about this change!
}

// Event Listeners
ngOnInit() {
  document.addEventListener('scroll', () => {
    this.scrollPosition = window.scrollY; // Angular doesn't know!
  });
}

// WebSocket Messages
connectWebSocket() {
  this.websocket.onmessage = (event) => {
    this.messages.push(event.data); // Angular doesn't know!
  };
}

// THE MANUAL SOLUTION (pre-Zone.js):
changeNameAsyncManual() {
  this.status = 'Changing...';
  
  setTimeout(() => {
    this.name = 'Jane';
    this.status = 'Changed';
    
    // Manual change detection trigger
    this.cdr.detectChanges(); // ✅ But easy to forget!
  }, 1000);
}

// PROBLEMS WITH MANUAL APPROACH:
// 1. Easy to forget detectChanges()
// 2. Inconsistent across the team
// 3. Doesn't work with third-party libraries
// 4. Maintenance nightmare
// 5. Poor developer experience`,
      explanation:
        "Asynchronous operations execute outside Angular's synchronous change detection cycle, causing the view to become stale until manually refreshed.",
    },
    diagram: {
      type: 'async-problem-demo',
      title: 'Asynchronous Change Detection Problem',
      animated: true,
    },
    problemSolution: {
      problem:
        "Asynchronous operations like setTimeout, HTTP requests, and Promises execute outside Angular's change detection cycle, causing stale UI.",
      solution:
        'Zone.js solves this by monkey-patching browser APIs to automatically detect when asynchronous operations complete.',
      benefits: [
        'Automatic async operation detection',
        'No manual change detection needed',
        'Consistent behavior across all async APIs',
        'Better developer experience',
      ],
      implementation:
        'Zone.js wraps all async operations and notifies Angular when they complete, triggering change detection automatically.',
    },
  },
  {
    id: 'zone-js-overview',
    title: 'Part 2: The Trigger (Zone.js)',
    subtitle: 'Automating Change Detection with Monkey Patching',
    content: [
      {
        type: 'text',
        content:
          'Zone.js solves the fundamental question: "When should Angular run change detection?" It automates the trigger mechanism by monkey-patching browser APIs and tracking asynchronous operations.',
      },
      {
        type: 'highlight',
        content:
          'Zone.js wraps all asynchronous operations in a "zone" and emits events when a complete unit of work is finished, giving Angular the perfect moment to check for changes.',
      },
      {
        type: 'bullet',
        content: 'The problem Zone.js solves:',
        subItems: [
          'Manual triggering was error-prone and tedious',
          'Developers had to remember to call change detection',
          'Forgetting to trigger resulted in stale UI',
          'No automatic handling of async operations',
          'Inconsistent behavior across different scenarios',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'The Problem: Manual Change Detection (Pre-Zone.js)',
      code: `// AngularJS style - Manual change detection required
class ManualChangeDetectionComponent {
  data = 'initial';
  
  constructor(private scope: any) {}
  
  // ❌ Manual triggering required for DOM events
  onClick() {
    this.data = 'clicked';
    this.scope.$apply(); // Manual trigger - easy to forget!
  }
  
  // ❌ Manual triggering required for HTTP requests
  loadData() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        this.data = data;
        this.scope.$apply(); // Manual trigger - easy to forget!
      });
  }
  
  // ❌ Manual triggering required for timers
  startTimer() {
    setTimeout(() => {
      this.data = 'timer finished';
      this.scope.$apply(); // Manual trigger - easy to forget!
    }, 1000);
  }
  
  // ❌ Manual triggering required for promises
  async processData() {
    const result = await this.processAsync();
    this.data = result;
    this.scope.$apply(); // Manual trigger - easy to forget!
  }
}

// The problems with manual triggering:
// 1. Easy to forget - leads to bugs
// 2. Inconsistent application behavior
// 3. Difficult to maintain
// 4. Error-prone in complex async scenarios
// 5. Requires deep framework knowledge`,
      explanation:
        'Before Zone.js, developers had to manually trigger change detection after every asynchronous operation, which was error-prone and led to inconsistent UI updates.',
    },
    problemSolution: {
      problem:
        "Manual change detection triggering was tedious, error-prone, and often forgotten, leading to UI that didn't update when data changed.",
      solution:
        'Zone.js automatically detects when asynchronous operations complete and triggers change detection at the perfect moment.',
      benefits: [
        'Eliminates manual triggering',
        'Consistent behavior across all async operations',
        'Reduced developer cognitive load',
        'Fewer bugs related to stale UI',
      ],
      implementation:
        'Zone.js monkey-patches browser APIs to automatically track async operations and trigger change detection when they complete.',
    },
  },
  {
    id: 'monkey-patching-explained',
    title: 'Monkey Patching: How Zone.js Works',
    subtitle: 'Intercepting Browser APIs for Automatic Detection',
    content: [
      {
        type: 'text',
        content:
          'Monkey patching is the technique of dynamically modifying existing code at runtime. Zone.js uses this to wrap browser APIs and track when asynchronous operations begin and end.',
      },
      {
        type: 'bullet',
        content: 'Browser APIs that Zone.js patches:',
        subItems: [
          'DOM Events (addEventListener, onclick, etc.)',
          'Timers (setTimeout, setInterval, requestAnimationFrame)',
          'Promises (Promise.then, async/await)',
          'HTTP Requests (XMLHttpRequest, fetch)',
          'WebSocket connections',
          'Geolocation API',
          'File API operations',
          'MutationObserver',
        ],
      },
      {
        type: 'highlight',
        content:
          'Zone.js creates a "zone" execution context that tracks all async operations and notifies Angular when a complete "turn" of work is finished.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Zone.js Monkey Patching in Action',
      code: `// Simplified example of how Zone.js patches setTimeout
// Original browser setTimeout
const originalSetTimeout = window.setTimeout;

// Zone.js patches it like this:
window.setTimeout = function(callback: Function, delay: number) {
  console.log('Zone.js: setTimeout called, starting to track...');
  
  // Wrap the callback to know when it finishes
  const wrappedCallback = function() {
    console.log('Zone.js: setTimeout callback starting...');
    
    try {
      // Execute the original callback
      callback();
    } finally {
      console.log('Zone.js: setTimeout callback finished!');
      // Notify Angular that async work is complete
      NgZone.checkStable();
    }
  };
  
  // Call the original setTimeout with wrapped callback
  return originalSetTimeout.call(this, wrappedCallback, delay);
};

// Similar patching for Promises
const originalThen = Promise.prototype.then;
Promise.prototype.then = function(onFulfilled, onRejected) {
  console.log('Zone.js: Promise.then called, tracking...');
  
  const wrappedOnFulfilled = onFulfilled ? function(value) {
    console.log('Zone.js: Promise resolved, executing callback...');
    try {
      return onFulfilled(value);
    } finally {
      console.log('Zone.js: Promise callback finished!');
      NgZone.checkStable();
    }
  } : undefined;
  
  return originalThen.call(this, wrappedOnFulfilled, onRejected);
};

// Example usage - now automatically tracked!
@Component({
  template: '<div>{{ message }}</div>'
})
export class AutomaticComponent {
  message = 'initial';
  
  ngOnInit() {
    // ✅ Zone.js automatically handles this
    setTimeout(() => {
      this.message = 'timer updated';
      // No manual change detection needed!
    }, 1000);
    
    // ✅ Zone.js automatically handles this
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        this.message = data.message;
        // No manual change detection needed!
      });
    
    // ✅ Zone.js automatically handles this
    document.addEventListener('click', () => {
      this.message = 'clicked';
      // No manual change detection needed!
    });
  }
}

// The Zone.js "Turn" concept
// 1. Async operation starts (e.g., setTimeout)
// 2. Zone.js wraps the callback
// 3. Original operation executes
// 4. Callback executes in Zone context
// 5. Zone.js detects "turn" is complete
// 6. NgZone.onMicrotaskEmpty event fires
// 7. Angular runs change detection`,
      explanation:
        'Zone.js intercepts browser APIs by replacing them with wrapped versions that track when async operations start and finish, automatically triggering change detection.',
    },
    diagram: {
      type: 'zone-flow',
      title: 'Zone.js Execution Flow',
      animated: false,
    },
    problemSolution: {
      problem:
        "Browser APIs don't provide built-in notifications when asynchronous operations complete, making it impossible to know when to run change detection.",
      solution:
        'Zone.js monkey-patches browser APIs to wrap them with tracking logic that notifies Angular when async operations finish.',
      benefits: [
        'Automatic async operation tracking',
        'No code changes required',
        'Works with all browser APIs',
        'Transparent to application code',
      ],
      implementation:
        'Zone.js patches APIs at application startup, wrapping them with zone-aware logic that tracks execution context and completion.',
    },
  },
  {
    title: 'The Zone Execution Context',
    subtitle: 'Understanding Zones, Tasks, and Microtasks',
    id: 'zone-execution-context',
    content: [
      {
        type: 'text',
        content:
          'A Zone is an execution context that persists across async operations. It allows Zone.js to track related async operations and know when a complete "turn" of work is finished.',
      },
      {
        type: 'bullet',
        content: 'Zone.js task types:',
        subItems: [
          'MacroTasks - setTimeout, setInterval, DOM events',
          'MicroTasks - Promise.then, queueMicrotask',
          'EventTasks - addEventListener callbacks',
          'Task scheduling and execution tracking',
          'Nested zone contexts for isolation',
          'Zone-specific data and error handling',
        ],
      },
      {
        type: 'highlight',
        content:
          "Angular's NgZone listens for the onMicrotaskEmpty event, which fires when all microtasks in the current turn have completed.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Understanding Zone Execution and Task Types',
      code: `// Zone.js execution model
class NgZoneExample {
  constructor(private ngZone: NgZone) {
    // Listen for when zone becomes stable (no pending tasks)
    this.ngZone.onStable.subscribe(() => {
      console.log('Zone is stable - all async work complete');
      // This is when Angular runs change detection!
    });
    
    this.ngZone.onUnstable.subscribe(() => {
      console.log('Zone became unstable - async work started');
    });
  }
  
  demonstrateZoneExecution() {
    console.log('1. Synchronous code starts');
    
    // MacroTask - scheduled for next event loop
    setTimeout(() => {
      console.log('4. MacroTask (setTimeout) executes');
      
      // MicroTask inside MacroTask
      Promise.resolve().then(() => {
        console.log('5. MicroTask (Promise) executes');
        // Zone becomes stable after this
      });
    }, 0);
    
    // MicroTask - executes before MacroTasks
    Promise.resolve().then(() => {
      console.log('3. MicroTask (Promise) executes first');
    });
    
    console.log('2. Synchronous code continues');
    
    // Execution order:
    // 1. Synchronous code starts
    // 2. Synchronous code continues  
    // 3. MicroTask (Promise) executes first
    // 4. MacroTask (setTimeout) executes
    // 5. MicroTask (Promise) executes
    // -> Zone becomes stable -> Change detection runs
  }
  
  // Running code outside Angular zone
  runOutsideAngular() {
    this.ngZone.runOutsideAngular(() => {
      // This won't trigger change detection
      setInterval(() => {
        console.log('Running outside Angular zone');
        // No change detection triggered!
      }, 1000);
    });
  }
  
  // Manually triggering change detection
  runInsideAngular() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Do work outside zone
        const result = this.expensiveOperation();
        
        // Re-enter zone to trigger change detection
        this.ngZone.run(() => {
          this.updateUI(result);
          // Change detection will run after this
        });
      }, 1000);
    });
  }
}

// Advanced Zone.js concepts
class AdvancedZoneExample {
  // Creating custom zones
  createCustomZone() {
    const customZone = Zone.current.fork({
      name: 'customZone',
      onInvokeTask: (delegate, current, target, task, applyThis, applyArgs) => {
        console.log('Task starting:', task.source);
        const result = delegate.invokeTask(target, task, applyThis, applyArgs);
        console.log('Task finished:', task.source);
        return result;
      }
    });
    
    customZone.run(() => {
      // All async operations in this zone will be tracked
      setTimeout(() => console.log('Custom zone timer'), 100);
    });
  }
  
  // Zone error handling
  handleZoneErrors() {
    Zone.current.fork({
      name: 'errorHandlingZone',
      onHandleError: (delegate, current, target, error) => {
        console.error('Zone caught error:', error);
        return false; // Don't propagate
      }
    }).run(() => {
      setTimeout(() => {
        throw new Error('Async error in zone');
      }, 100);
    });
  }
}`,
      explanation:
        'Zone.js creates execution contexts that track async operations through macrotasks and microtasks, providing precise control over when change detection should run.',
    },
    problemSolution: {
      problem:
        "JavaScript's event loop makes it difficult to know when all related async operations have completed, making it hard to determine the right moment for change detection.",
      solution:
        'Zone.js creates execution contexts that track all async operations and provide events when the zone becomes stable (no pending work).',
      benefits: [
        'Precise async operation tracking',
        'Stable/unstable zone events',
        'Custom zone creation for isolation',
        'Error handling across async boundaries',
      ],
      implementation:
        'NgZone wraps the Angular application in a zone that listens for stability events and triggers change detection when all async work is complete.',
    },
  },
  {
    id: 'component-dirty-marking',
    title: 'Component Dirty Marking Mechanism',
    subtitle: 'How Angular Knows Which Components Changed',
    content: [
      {
        type: 'text',
        content:
          'Angular uses a sophisticated dirty marking system to track which components need to be checked during change detection. This system marks components as "dirty" when specific events occur.',
      },
      {
        type: 'bullet',
        content: 'Events that mark components as dirty:',
        subItems: [
          'DOM Events: click, mouseover, keyup, input, etc.',
          'Input Changes: When @Input properties change',
          'Output Emissions: When @Output events are emitted',
          'Manual Triggers: markForCheck(), detectChanges()',
          'Async Operations: HTTP responses, setTimeout callbacks',
          'Component Lifecycle: ngOnInit, ngAfterViewInit, etc.',
        ],
      },
      {
        type: 'highlight',
        content:
          '🎯 The markViewDirty() function marks the current component AND all its ancestors as dirty, ensuring change detection traverses the correct path.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Component Dirty Marking Internal Implementation',
      code: `// ANGULAR INTERNAL: How components get marked as dirty

// 1. DOM EVENT HANDLING
function wrapListenerIn_markDirtyAndPreventDefault(eventHandler: Function): EventListener {
  return function wrapListenerIn_markDirtyAndPreventDefault(e: any) {
    // Prevent default behavior if needed
    if (shouldPreventDefault) {
      e.preventDefault();
    }
    
    // Execute the user's event handler
    const result = eventHandler(e);
    
    // 🎯 MARK THE COMPONENT AS DIRTY
    markViewDirty(getCurrentLView());
    
    return result;
  };
}

// 2. INPUT CHANGES
export function setInput(name: string, value: unknown): void {
  const lView = getCurrentLView();
  const previousValue = this.previousInputValues.get(name);
  
  // Check if the input value actually changed (=== comparison)
  if (Object.is(previousValue, value)) {
    return; // No change, don't mark dirty
  }
  
  // Store the new value
  this.previousInputValues.set(name, value);
  
  // Update the component's input property
  setInputsForProperty(lView[TVIEW], lView, dataValue, name, value);
  
  // 🎯 MARK THE CHILD COMPONENT AS DIRTY
  markViewDirty(childComponentLView);
}

// 3. OUTPUT EMISSIONS
// When a child component emits an output event, the parent's event handler
// is wrapped with the same wrapListenerIn_markDirtyAndPreventDefault function

// 4. THE CORE DIRTY MARKING FUNCTION
/**
 * Marks current view and all ancestors dirty.
 * This ensures change detection will traverse down to this component.
 */
export function markViewDirty(lView: LView): LView | null {
  let currentLView: LView | null = lView;
  
  // Walk up the component tree and mark each ancestor as dirty
  while (currentLView) {
    // Set the DIRTY flag on this view
    currentLView[FLAGS] |= LViewFlags.Dirty;
    
    // Move to the parent view
    currentLView = getParentLView(currentLView);
  }
  
  // Return the root view for scheduling change detection
  return getRootView(lView);
}

// PRACTICAL EXAMPLE: How dirty marking works

@Component({
  selector: 'app-parent',
  template: \`
    <div>
      <h2>Parent Component</h2>
      <app-child 
        [userData]="user" 
        (userChanged)="onUserChanged($event)">
      </app-child>
    </div>
  \`
})
export class ParentComponent {
  user = { name: 'John', age: 25 };
  
  onUserChanged(newUser: User) {
    this.user = newUser;
    
    // INTERNAL FLOW:
    // 1. Child emits userChanged event
    // 2. Angular wraps onUserChanged with dirty marking
    // 3. onUserChanged executes: this.user = newUser
    // 4. markViewDirty(ParentComponent's LView) is called
    // 5. Parent and all ancestors are marked dirty
    // 6. Change detection will check this component tree
  }
}

@Component({
  selector: 'app-child',
  template: \`
    <div>
      <p>User: {{ userData.name }}</p>
      <button (click)="changeUser()">Change User</button>
    </div>
  \`
})
export class ChildComponent {
  @Input() userData!: User;
  @Output() userChanged = new EventEmitter<User>();
  
  changeUser() {
    const newUser = { name: 'Jane', age: 30 };
    this.userChanged.emit(newUser);
    
    // INTERNAL FLOW:
    // 1. User clicks button
    // 2. Angular wraps changeUser with dirty marking
    // 3. changeUser executes
    // 4. userChanged.emit() triggers parent's onUserChanged
    // 5. markViewDirty(ChildComponent's LView) is called
    // 6. Child and all ancestors are marked dirty
  }
}

// DIRTY MARKING VISUALIZATION:
//
// Before click:
// AppComponent (Clean)
// └── ParentComponent (Clean)
//     └── ChildComponent (Clean)
//
// After button click in ChildComponent:
// AppComponent (Dirty) ← Marked by markViewDirty
// └── ParentComponent (Dirty) ← Marked by markViewDirty  
//     └── ChildComponent (Dirty) ← Source of the change
//
// During change detection:
// 1. Check AppComponent (Dirty) → Check bindings
// 2. Check ParentComponent (Dirty) → Check bindings, input changed
// 3. Check ChildComponent (Dirty) → Check bindings
// 4. Update DOM where needed
// 5. Clear all Dirty flags

// ADVANCED: OnPush Strategy and Dirty Marking
@Component({
  selector: 'app-onpush-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ data.value }}</p>\`
})
export class OnPushComponent {
  @Input() data!: { value: string };
  
  // OnPush components are only marked dirty when:
  // 1. Input references change (not deep property changes)
  // 2. Event handler is triggered
  // 3. markForCheck() is called manually
  // 4. Async pipe receives new value
}

// PERFORMANCE IMPLICATIONS:
//
// Dirty marking is efficient because:
// 1. Only marks the path from changed component to root
// 2. Skips entire subtrees that aren't marked dirty
// 3. Uses bitwise flags for fast checking
// 4. Clears flags after each change detection cycle
//
// Without dirty marking, Angular would need to:
// 1. Check every component in the entire tree
// 2. Evaluate every binding in every component
// 3. Waste CPU cycles on unchanged components`,
      explanation:
        'Angular uses markViewDirty() to create an efficient path for change detection, marking only the components that need checking and their ancestors.',
    },
    diagram: {
      type: 'dirty-marking-flow',
      title: 'Component Dirty Marking Flow',
      animated: true,
    },
    problemSolution: {
      problem:
        'Without a dirty marking system, Angular would need to check every component in the entire application on every change detection cycle.',
      solution:
        'markViewDirty() creates an efficient path by marking only changed components and their ancestors, allowing Angular to skip unchanged subtrees.',
      benefits: [
        'Skip unchanged component subtrees',
        'Efficient path-based traversal',
        'Fast bitwise flag operations',
        'Automatic ancestor marking',
      ],
      implementation:
        'Angular automatically calls markViewDirty() when events occur, inputs change, or outputs are emitted.',
    },
  },
  {
    id: 'ngzone-integration',
    title: "NgZone: Angular's Zone.js Integration",
    subtitle: 'How Angular Uses Zone.js for Change Detection',
    content: [
      {
        type: 'text',
        content:
          "NgZone is Angular's service that wraps Zone.js functionality and provides the bridge between zone events and Angular's change detection system.",
      },
      {
        type: 'bullet',
        content: 'NgZone responsibilities:',
        subItems: [
          'Wraps the Angular application in a zone',
          'Listens for onMicrotaskEmpty events',
          'Triggers ApplicationRef.tick() for change detection',
          'Provides methods to run code inside/outside the zone',
          'Handles zone-related errors and debugging',
          'Offers fine-grained control over change detection timing',
        ],
      },
      {
        type: 'highlight',
        content:
          "NgZone.onMicrotaskEmpty is the key event that triggers Angular's change detection cycle.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'NgZone Integration and Control',
      code: `@Injectable()
export class NgZoneService {
  constructor(private ngZone: NgZone) {
    this.setupZoneListeners();
  }
  
  private setupZoneListeners() {
    // Key event: when zone becomes stable
    this.ngZone.onStable.subscribe(() => {
      console.log('🟢 Zone stable - change detection will run');
    });
    
    // When zone becomes unstable (async work starts)
    this.ngZone.onUnstable.subscribe(() => {
      console.log('🔴 Zone unstable - async work started');
    });
    
    // When microtask queue is empty
    this.ngZone.onMicrotaskEmpty.subscribe(() => {
      console.log('✅ Microtask queue empty - triggering change detection');
      // This is where ApplicationRef.tick() gets called!
    });
    
    // Zone errors
    this.ngZone.onError.subscribe((error) => {
      console.error('❌ Zone error:', error);
    });
  }
  
  // Performance optimization: run outside Angular zone
  performHeavyWork() {
    this.ngZone.runOutsideAngular(() => {
      // Heavy computation that doesn't need change detection
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      
      // Animation loop outside zone - no change detection overhead
      const animate = () => {
        // Draw frame
        this.drawFrame(ctx);
        requestAnimationFrame(animate);
      };
      animate();
    });
  }
  
  // Re-enter zone when you need change detection
  updateUIAfterHeavyWork(result: any) {
    this.ngZone.run(() => {
      // This will trigger change detection
      this.updateComponentState(result);
    });
  }
  
  // Batch multiple operations
  batchOperations() {
    this.ngZone.runOutsideAngular(() => {
      // Multiple async operations outside zone
      const promises = [
        this.operation1(),
        this.operation2(),
        this.operation3()
      ];
      
      Promise.all(promises).then(results => {
        // Re-enter zone once for all results
        this.ngZone.run(() => {
          this.processResults(results);
          // Single change detection cycle for all operations
        });
      });
    });
  }
}

// Component using NgZone
@Component({
  selector: 'app-zone-demo',
  template: \`
    <div>
      <h3>Zone Demo</h3>
      <p>Counter: {{ counter }}</p>
      <p>Heavy Result: {{ heavyResult }}</p>
      <button (click)="normalUpdate()">Normal Update</button>
      <button (click)="optimizedUpdate()">Optimized Update</button>
    </div>
  \`
})
export class ZoneDemoComponent {
  counter = 0;
  heavyResult = '';
  
  constructor(private ngZone: NgZone) {}
  
  // ❌ Normal update - triggers change detection
  normalUpdate() {
    // This runs inside Angular zone
    setTimeout(() => {
      this.counter++;
      // Change detection runs automatically
    }, 100);
  }
  
  // ✅ Optimized update - controlled change detection
  optimizedUpdate() {
    this.ngZone.runOutsideAngular(() => {
      // Heavy work outside zone
      setTimeout(() => {
        const result = this.performHeavyCalculation();
        
        // Re-enter zone only when needed
        this.ngZone.run(() => {
          this.heavyResult = result;
          // Change detection runs once
        });
      }, 100);
    });
  }
  
  private performHeavyCalculation(): string {
    // Simulate heavy work
    let result = '';
    for (let i = 0; i < 1000000; i++) {
      result += Math.random().toString();
    }
    return result.substring(0, 10);
  }
}

// The complete flow:
// 1. User clicks button (DOM event)
// 2. Zone.js intercepts the event
// 3. Event handler executes in Angular zone
// 4. Any async operations are tracked
// 5. When all async work completes, zone becomes stable
// 6. NgZone.onMicrotaskEmpty fires
// 7. ApplicationRef.tick() is called
// 8. Change detection runs from root component`,
      explanation:
        'NgZone provides the integration layer between Zone.js and Angular, offering fine-grained control over when change detection runs and allowing performance optimizations.',
    },
    problemSolution: {
      problem:
        "Raw Zone.js doesn't integrate directly with Angular's change detection system, and developers need control over when change detection runs.",
      solution:
        'NgZone provides Angular-specific integration with Zone.js, offering events and methods to control change detection timing.',
      benefits: [
        'Automatic change detection triggering',
        'Performance optimization capabilities',
        'Fine-grained control over detection timing',
        "Integration with Angular's lifecycle",
      ],
      implementation:
        'Inject NgZone service and use runOutsideAngular() for performance-critical code, then run() to re-enter when change detection is needed.',
    },
  },
  {
    id: 'zone-js-wrapping-mechanism',
    title: 'NgZone Wraps Angular Apps',
    subtitle: 'The Complete Wrapping and Notification System',
    content: [
      {
        type: 'text',
        content:
          'NgZone creates a wrapper around your entire Angular application, monitoring all async operations and automatically triggering change detection when the zone becomes stable.',
      },
      {
        type: 'bullet',
        content: 'The complete NgZone flow:',
        subItems: [
          '1. NgZone wraps the entire Angular application',
          '2. All async operations are patched and monitored',
          '3. When async operations complete, onMicrotaskEmpty fires',
          '4. This triggers ApplicationRef.tick()',
          '5. Change detection runs from root to leaves',
          '6. DOM is updated with any changes found',
        ],
      },
      {
        type: 'highlight',
        content:
          '🔄 Key insight: Zone.js turns async operations into automatic change detection triggers!',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'NgZone Wrapping and Notification System',
      code: `// How NgZone wraps your Angular application
class NgZone {
  // The onMicrotaskEmpty subscription that triggers change detection
  private _onMicrotaskEmptySubscription: Subscription;
  
  constructor() {
    // Subscribe to zone stability events
    this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
      next: () => {
        // When zone becomes stable, trigger change detection
        this.applicationRef.tick(); // This runs change detection!
      }
    });
  }
}

// What happens in ApplicationRef.tick()
class ApplicationRef {
  tick() {
    // Run change detection on all root components
    this._views.forEach(view => {
      view.detectChanges(); // Check each root component tree
    });
  }
}

// The complete flow from user action to DOM update:

// 1. User clicks button
element.addEventListener('click', wrapListenerIn_markDirtyAndPreventDefault(changeName));

// 2. Angular's event wrapper
function wrapListenerIn_markDirtyAndPreventDefault(changeName) {
  return function(event) {
    // Call your method
    const result = changeName();
    
    // Mark component as dirty
    markViewDirty(startView);
    
    return result;
  };
}

// 3. NgZone detects completion
// When no more microtasks are pending:
zone.onMicrotaskEmpty.emit(); // Notifies NgZone

// 4. NgZone triggers change detection
ngZone._onMicrotaskEmptySubscription.next(() => {
  applicationRef.tick(); // Run change detection
});

// 5. Change detection checks dirty components
function tick() {
  this._views.forEach(view => {
    if (view.isDirty) {
      view.detectChanges(); // Check bindings and update DOM
    }
  });
}

// Your component code (what you write)
@Component({
  template: \`
    <button (click)="changeName()">Change name</button>
    <p>{{ name }}</p>
  \`
})
export class AppComponent {
  name = 'Mohamed';

  changeName() {
    this.name = 'Ali'; // This change will be detected automatically
  }
}`,
      explanation:
        'NgZone creates an invisible wrapper around your app that automatically detects when async operations complete and triggers change detection. This is why Angular "just works" without manual DOM updates.',
    },
    diagram: {
      type: 'zone-flow',
      title: 'NgZone Wrapping Flow',
      animated: false,
    },
  },
  {
    id: 'zone-performance-considerations',
    title: 'Zone.js Performance Considerations',
    subtitle: 'Understanding the Overhead and Optimization Strategies',
    content: [
      {
        type: 'text',
        content:
          'While Zone.js provides automatic change detection, it comes with performance overhead. Understanding these implications helps in building efficient Angular applications.',
      },
      {
        type: 'bullet',
        content: 'Zone.js performance implications:',
        subItems: [
          'Monkey patching adds overhead to all async operations',
          'Frequent async operations trigger many change detection cycles',
          'Large component trees amplify the performance impact',
          'Third-party libraries may trigger unexpected cycles',
          'Memory overhead from tracking async operations',
          'Debugging complexity in heavily async applications',
        ],
      },
      {
        type: 'comparison',
        content: 'Zone.js Trade-offs:',
        comparison: {
          before: 'Automatic, transparent change detection with some performance overhead',
          after: 'Manual control required but maximum performance with zoneless approach',
        },
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Zone.js Performance Optimization Strategies',
      code: `// Performance monitoring and optimization
@Component({
  selector: 'app-performance-demo',
  template: \`
    <div>
      <h3>Performance Demo</h3>
      <p>Updates: {{ updateCount }}</p>
      <canvas #canvas width="400" height="300"></canvas>
      <button (click)="startAnimation()">Start Animation</button>
      <button (click)="stopAnimation()">Stop Animation</button>
    </div>
  \`
})
export class PerformanceDemoComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  updateCount = 0;
  private animationId?: number;
  private isAnimating = false;
  
  constructor(private ngZone: NgZone) {}
  
  ngOnInit() {
    this.measureZoneOverhead();
  }
  
  // ❌ Animation inside zone - triggers change detection on every frame
  startBadAnimation() {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    let frame = 0;
    
    const animate = () => {
      if (!this.isAnimating) return;
      
      // This runs inside Angular zone
      ctx.clearRect(0, 0, 400, 300);
      ctx.fillRect(frame % 400, 150, 50, 50);
      frame++;
      
      this.updateCount++; // Triggers change detection!
      requestAnimationFrame(animate); // Zone.js patches this!
    };
    
    this.isAnimating = true;
    animate(); // 60 FPS = 60 change detection cycles per second!
  }
  
  // ✅ Optimized animation outside zone
  startAnimation() {
    this.ngZone.runOutsideAngular(() => {
      const ctx = this.canvas.nativeElement.getContext('2d')!;
      let frame = 0;
      let lastUpdate = Date.now();
      
      const animate = () => {
        if (!this.isAnimating) return;
        
        // Animation logic outside zone - no change detection
        ctx.clearRect(0, 0, 400, 300);
        ctx.fillRect(frame % 400, 150, 50, 50);
        frame++;
        
        // Update UI occasionally, not every frame
        const now = Date.now();
        if (now - lastUpdate > 1000) { // Every second
          this.ngZone.run(() => {
            this.updateCount++;
            // Change detection runs only once per second
          });
          lastUpdate = now;
        }
        
        requestAnimationFrame(animate);
      };
      
      this.isAnimating = true;
      animate();
    });
  }
  
  stopAnimation() {
    this.isAnimating = false;
  }
  
  // Measure Zone.js overhead
  private measureZoneOverhead() {
    const iterations = 10000;
    
    // Measure inside zone
    const startInside = performance.now();
    for (let i = 0; i < iterations; i++) {
      setTimeout(() => {}, 0); // Zone.js patches this
    }
    const endInside = performance.now();
    
    // Measure outside zone
    this.ngZone.runOutsideAngular(() => {
      const startOutside = performance.now();
      for (let i = 0; i < iterations; i++) {
        setTimeout(() => {}, 0); // No Zone.js overhead
      }
      const endOutside = performance.now();
      
      console.log(\`Zone.js overhead: \${endInside - startInside}ms vs \${endOutside - startOutside}ms\`);
    });
  }
  
  ngOnDestroy() {
    this.stopAnimation();
  }
}

// Third-party library integration
@Injectable()
export class ThirdPartyIntegrationService {
  constructor(private ngZone: NgZone) {}
  
  // ❌ Third-party library triggering excessive change detection
  setupBadLibraryIntegration() {
    // Library that fires events frequently
    const library = new SomeThirdPartyLibrary();
    
    library.onUpdate((data) => {
      // This runs inside Angular zone
      this.processData(data);
      // Change detection runs on every library update!
    });
  }
  
  // ✅ Optimized third-party integration
  setupOptimizedLibraryIntegration() {
    this.ngZone.runOutsideAngular(() => {
      const library = new SomeThirdPartyLibrary();
      let pendingUpdate = false;
      
      library.onUpdate((data) => {
        // Process data outside zone
        this.processDataOutsideZone(data);
        
        // Batch UI updates
        if (!pendingUpdate) {
          pendingUpdate = true;
          setTimeout(() => {
            this.ngZone.run(() => {
              this.updateUI();
              pendingUpdate = false;
            });
          }, 16); // ~60fps batching
        }
      });
    });
  }
  
  private processData(data: any) {
    // Process data that triggers change detection
  }
  
  private processDataOutsideZone(data: any) {
    // Process data without triggering change detection
  }
  
  private updateUI() {
    // Update Angular components
  }
}

// Performance monitoring
@Injectable()
export class ZonePerformanceMonitor {
  private changeDetectionCount = 0;
  private lastReset = Date.now();
  
  constructor(private ngZone: NgZone) {
    this.setupMonitoring();
  }
  
  private setupMonitoring() {
    this.ngZone.onStable.subscribe(() => {
      this.changeDetectionCount++;
      
      const now = Date.now();
      if (now - this.lastReset > 5000) { // Every 5 seconds
        console.log(\`Change detection cycles in last 5s: \${this.changeDetectionCount}\`);
        this.changeDetectionCount = 0;
        this.lastReset = now;
      }
    });
  }
}`,
      explanation:
        'Zone.js adds overhead to async operations and can trigger excessive change detection. Use runOutsideAngular() for performance-critical code and batch UI updates.',
    },
    diagram: {
      type: 'performance-comparison',
      title: 'Zone.js Performance Impact',
      animated: false,
    },
    problemSolution: {
      problem:
        'Zone.js monkey patching adds overhead to all async operations and can trigger excessive change detection cycles in performance-critical applications.',
      solution:
        'Use NgZone.runOutsideAngular() for performance-critical code and batch UI updates to minimize change detection overhead.',
      benefits: [
        'Reduced change detection frequency',
        'Better animation performance',
        'Optimized third-party library integration',
        'Lower CPU usage',
      ],
      implementation:
        'Run performance-critical code outside Angular zone and re-enter only when UI updates are needed, batching multiple operations together.',
    },
  },
];

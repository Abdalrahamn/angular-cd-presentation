import { SlideData } from '../../models/slide.interface';

export const part1DefaultStrategySlides: SlideData[] = [
  {
    id: 'intro-overview',
    title: 'Angular Change Detection: A Deep Dive',
    subtitle: 'From Default Strategy to Signals - Complete Guide',
    content: [
      {
        type: 'text',
        content:
          "This comprehensive presentation will guide you through the evolution and mechanics of change detection in Angular. We'll explore how Angular knows when your data changes and how it efficiently updates the user interface.",
      },
      {
        type: 'bullet',
        content: "What we'll cover in this deep dive:",
        subItems: [
          'Part 1: The Default Strategy (CheckAlways) - Foundation & View Checking',
          'Part 2: The Trigger (Zone.js) - Automation & Monkey Patching',
          'Part 3: The Optimization (OnPush) - Performance & Immutability',
          'Part 4: The Revolution (Signals) - Fine-grained Reactivity',
          'Part 5: The Future (Zoneless) - Modern Angular Architecture',
        ],
      },
    ],
    problemSolution: {
      problem:
        'Teams often struggle with Angular performance issues without understanding the underlying change detection mechanisms, leading to inefficient applications and frustrated developers.',
      solution:
        'A comprehensive understanding of change detection evolution provides the knowledge needed to build performant, maintainable Angular applications.',
      benefits: [
        'Deep understanding of Angular internals',
        'Ability to diagnose performance issues',
        'Knowledge of modern optimization techniques',
        'Future-ready development skills',
      ],
    },
  },
  {
    id: 'default-strategy-overview',
    title: 'Part 1: The Default Strategy (CheckAlways)',
    subtitle: 'The Foundation of Angular Change Detection',
    content: [
      {
        type: 'text',
        content:
          "The default strategy is the foundational change detection mechanism in Angular. It's reliable, easy to understand, and the default behavior for all components.",
      },
      {
        type: 'highlight',
        content:
          'Every Angular application is a tree of components. Change detection always starts at the root component and proceeds downwards to its children, one by one. This is unidirectional data flow.',
      },
      {
        type: 'bullet',
        content: 'Key characteristics of the default strategy:',
        subItems: [
          'Top-down view checking from root to leaves',
          'Predictable unidirectional data flow',
          'Checks every component on every cycle',
          'Compares current vs previous values',
          'Updates DOM only when changes detected',
          'Simple but potentially inefficient at scale',
        ],
      },
      {
        type: 'code-demo',
        content: 'Default Strategy Component Tree Visualization',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Default Strategy in Action',
      code: `@Component({
  selector: 'app-root',
  // Default strategy is implicit (ChangeDetectionStrategy.Default)
  template: \`
    <div class="app">
      <h1>{{ title }}</h1>
      <app-header [user]="currentUser"></app-header>
      <app-main [data]="mainData"></app-main>
      <app-footer [stats]="footerStats"></app-footer>
    </div>
  \`
})
export class AppComponent {
  title = 'My Angular App';
  currentUser = { name: 'John', role: 'admin' };
  mainData = { items: [], loading: false };
  footerStats = { visits: 1000, users: 50 };
  
  // Any change here triggers checking of ENTIRE tree
  updateUser() {
    this.currentUser = { ...this.currentUser, name: 'Jane' };
    // Angular will check AppComponent, HeaderComponent, MainComponent, FooterComponent
    // Even though only HeaderComponent actually needs to update!
  }
}

@Component({
  selector: 'app-header',
  template: \`
    <header>
      <span>Welcome {{ user.name }}!</span>
      <span>Role: {{ user.role }}</span>
      <!-- These expressions are checked EVERY cycle -->
      <span>Time: {{ getCurrentTime() }}</span>
    </header>
  \`
})
export class HeaderComponent {
  @Input() user!: User;
  
  getCurrentTime() {
    console.log('getCurrentTime called!'); // This logs on EVERY change detection!
    return new Date().toLocaleTimeString();
  }
}`,
      explanation:
        'With default strategy, every component is checked on every change detection cycle. Even unrelated changes trigger checks across the entire component tree.',
    },
    problemSolution: {
      problem:
        'The default strategy checks every component on every change detection cycle, which can lead to performance issues in large applications with complex component trees.',
      solution:
        'Understanding how the default strategy works helps developers identify performance bottlenecks and make informed decisions about optimization strategies.',
      benefits: [
        'Guaranteed UI consistency',
        'Simple mental model',
        'No configuration required',
        'Works with any coding pattern',
      ],
      implementation:
        'Angular traverses the component tree from root to leaves, checking all bindings and executing all template expressions in every component.',
    },
  },
  {
    id: 'view-checking-internals',
    title: 'View Checking Internals: LView & TView',
    subtitle: 'How Angular Tracks and Compares Values',
    content: [
      {
        type: 'text',
        content:
          'Internally, Angular creates sophisticated data structures to efficiently track component state and detect changes. Understanding these internals helps explain why certain patterns are more performant.',
      },
      {
        type: 'bullet',
        content: "Angular's internal view structures:",
        subItems: [
          'LView (Logical View) - Runtime instance data for each component',
          'TView (Template View) - Static template structure and metadata',
          'Binding records - Track previous values for comparison',
          'Node references - Direct DOM element pointers',
          'Change detection flags - Control when checks occur',
          'Dirty checking - currentValue !== previousValue comparison',
        ],
      },
      {
        type: 'highlight',
        content:
          'Angular uses strict equality (===) for change detection. This is why immutable patterns are crucial for performance optimization.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Understanding View Checking Process',
      code: `// Simplified representation of Angular's internal process
interface LView {
  // Component instance data
  component: any;
  // DOM node references
  nodes: Node[];
  // Previous binding values for comparison
  bindingValues: any[];
  // Flags controlling change detection
  flags: LViewFlags;
}

interface TView {
  // Template structure
  template: string;
  // Binding definitions
  bindings: BindingDef[];
  // Child component definitions
  children: ComponentDef[];
}

// Simplified change detection process
function checkView(lView: LView, tView: TView) {
  const component = lView.component;
  
  // Check each binding in the template
  for (let i = 0; i < tView.bindings.length; i++) {
    const binding = tView.bindings[i];
    const currentValue = evaluateBinding(binding, component);
    const previousValue = lView.bindingValues[i];
    
    // Strict equality check - this is why immutability matters!
    if (currentValue !== previousValue) {
      // Update DOM
      updateDOM(lView.nodes[binding.nodeIndex], currentValue);
      // Store new value for next comparison
      lView.bindingValues[i] = currentValue;
    }
  }
  
  // Recursively check child components
  for (const child of getChildViews(lView)) {
    checkView(child.lView, child.tView);
  }
}

// Example of why object mutations don't trigger updates
const user = { name: 'John', age: 30 };
user.name = 'Jane'; // Same object reference!
// currentValue === previousValue (both point to same object)
// No DOM update occurs!

// Immutable update creates new reference
const updatedUser = { ...user, name: 'Jane' };
// currentValue !== previousValue (different object references)
// DOM update occurs!`,
      explanation:
        "Angular's change detection relies on reference equality checks. Understanding this internal mechanism explains why immutable patterns are essential for reliable change detection.",
    },
    diagram: {
      type: 'component-tree',
      title: 'LView & TView Structure Visualization',
      animated: false,
    },
    problemSolution: {
      problem:
        "Developers often encounter mysterious change detection issues because they don't understand Angular's internal comparison mechanisms.",
      solution:
        "Understanding LView, TView, and reference-based change detection helps developers write code that works predictably with Angular's internals.",
      benefits: [
        'Predictable change detection behavior',
        'Better debugging capabilities',
        'Understanding of performance implications',
        'Knowledge of why immutability matters',
      ],
      implementation:
        "Use immutable update patterns and avoid direct object mutations to ensure Angular's reference-based change detection works correctly.",
    },
  },
  {
    id: 'unidirectional-data-flow',
    title: 'Unidirectional Data Flow',
    subtitle: 'Predictability Through Strict Flow Control',
    content: [
      {
        type: 'text',
        content:
          'Angular enforces unidirectional data flow to prevent the infinite loops and unpredictable behavior that plagued AngularJS. Data flows down from parent to child via @Input() bindings.',
      },
      {
        type: 'comparison',
        content: 'AngularJS vs Angular Data Flow:',
        comparison: {
          before:
            'AngularJS: Bidirectional binding could cause infinite digest loops and unpredictable updates',
          after:
            'Angular: Strict unidirectional flow prevents infinite loops and makes behavior predictable',
        },
      },
      {
        type: 'bullet',
        content: 'Benefits of unidirectional data flow:',
        subItems: [
          'Prevents infinite change detection loops',
          'Makes data flow predictable and traceable',
          'Easier debugging and testing',
          'Better performance characteristics',
          'Clearer component relationships',
          'Enables better optimization strategies',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Unidirectional Data Flow Example',
      code: `// Parent Component
@Component({
  selector: 'app-parent',
  template: \`
    <div>
      <h2>Parent: {{ parentData.count }}</h2>
      <!-- Data flows DOWN to child via @Input -->
      <app-child 
        [childData]="parentData"
        (dataChange)="onChildDataChange($event)">
      </app-child>
      <button (click)="incrementParent()">Increment Parent</button>
    </div>
  \`
})
export class ParentComponent {
  parentData = { count: 0, message: 'Hello' };
  
  incrementParent() {
    // ✅ Immutable update - creates new reference
    this.parentData = {
      ...this.parentData,
      count: this.parentData.count + 1
    };
  }
  
  onChildDataChange(newData: any) {
    // Events flow UP from child to parent
    this.parentData = newData;
  }
}

// Child Component
@Component({
  selector: 'app-child',
  template: \`
    <div>
      <h3>Child: {{ childData.count }}</h3>
      <p>{{ childData.message }}</p>
      <!-- Child can emit events UP to parent -->
      <button (click)="incrementChild()">Increment Child</button>
    </div>
  \`
})
export class ChildComponent {
  @Input() childData!: { count: number; message: string };
  @Output() dataChange = new EventEmitter<any>();
  
  incrementChild() {
    // ❌ DON'T mutate input directly - breaks unidirectional flow
    // this.childData.count++; 
    
    // ✅ Emit event to parent - maintains unidirectional flow
    const newData = {
      ...this.childData,
      count: this.childData.count + 1
    };
    this.dataChange.emit(newData);
  }
}

// Angular's Change Detection Cycle
// 1. Start at root component
// 2. Check parent component bindings
// 3. Pass data DOWN to child via @Input
// 4. Check child component bindings
// 5. If child emits event, handle in parent
// 6. If parent data changes, start new cycle
// 7. Never allow child to directly modify parent during same cycle`,
      explanation:
        'Unidirectional data flow ensures predictable behavior by enforcing that data flows down through @Input and events flow up through @Output, preventing circular dependencies.',
    },
    problemSolution: {
      problem:
        'Bidirectional data binding in AngularJS could cause infinite digest loops and unpredictable application behavior.',
      solution:
        "Angular's unidirectional data flow enforces a strict parent-to-child data flow pattern with event-based communication back up.",
      benefits: [
        'Eliminates infinite loops',
        'Predictable data flow',
        'Easier debugging',
        'Better performance',
        'Clearer architecture',
      ],
      implementation:
        'Always pass data down via @Input and communicate up via @Output events. Never mutate input properties directly.',
    },
  },
  {
    id: 'performance-implications',
    title: 'Performance Implications at Scale',
    subtitle: 'When Default Strategy Becomes a Bottleneck',
    content: [
      {
        type: 'text',
        content:
          'While the default strategy is simple and reliable, it has significant performance implications in large applications. Understanding these limitations is crucial for building scalable Angular applications.',
      },
      {
        type: 'bullet',
        content: 'Performance challenges with default strategy:',
        subItems: [
          'O(n) complexity - checks grow linearly with component count',
          "Unnecessary checks - components that haven't changed are still checked",
          'Function calls in templates execute on every cycle',
          'Deep object comparisons can be expensive',
          'Large component trees create significant overhead',
          'Frequent Zone.js triggers compound the problem',
        ],
      },
      {
        type: 'highlight',
        content:
          'In a large application with 1000+ components, a single button click can trigger thousands of unnecessary binding checks, even if only one component actually needs to update.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Performance Anti-patterns with Default Strategy',
      code: `// ❌ Performance Anti-patterns
@Component({
  template: \`
    <div>
      <!-- Function calls in templates - AVOID! -->
      <h1>{{ getTitle() }}</h1>
      <p>Items: {{ getItemCount() }}</p>
      <p>Status: {{ getComplexStatus() }}</p>
      
      <!-- Complex expressions - AVOID! -->
      <div *ngFor="let item of items">
        {{ formatItem(item) }} - {{ calculatePrice(item) }}
      </div>
      
      <!-- Nested property access - can be expensive -->
      <span>{{ user.profile.settings.theme.primaryColor }}</span>
    </div>
  \`
})
export class PerformanceAntiPatternComponent {
  items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));
  user = { profile: { settings: { theme: { primaryColor: '#blue' } } } };
  
  // ❌ This runs on EVERY change detection cycle!
  getTitle() {
    console.log('getTitle called'); // Logs constantly!
    return 'My Application Title';
  }
  
  // ❌ This runs on EVERY change detection cycle!
  getItemCount() {
    console.log('getItemCount called'); // Logs constantly!
    return this.items.length;
  }
  
  // ❌ This runs on EVERY change detection cycle!
  getComplexStatus() {
    console.log('getComplexStatus called'); // Logs constantly!
    // Expensive computation
    return this.items.filter(item => item.id > 500).length > 100 ? 'High' : 'Low';
  }
  
  // ❌ This runs 1000 times per change detection cycle!
  formatItem(item: any) {
    console.log('formatItem called for:', item.id);
    return \`\${item.name} (ID: \${item.id})\`;
  }
  
  // ❌ This runs 1000 times per change detection cycle!
  calculatePrice(item: any) {
    console.log('calculatePrice called for:', item.id);
    return item.id * 10.99;
  }
}

// ✅ Performance Optimized Version
@Component({
  template: \`
    <div>
      <!-- Use component properties instead of functions -->
      <h1>{{ title }}</h1>
      <p>Items: {{ itemCount }}</p>
      <p>Status: {{ complexStatus }}</p>
      
      <!-- Pre-computed values -->
      <div *ngFor="let item of formattedItems; trackBy: trackByFn">
        {{ item.display }} - {{ item.price }}
      </div>
      
      <!-- Flatten nested properties -->
      <span>{{ primaryColor }}</span>
    </div>
  \`
})
export class PerformanceOptimizedComponent implements OnInit {
  items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));
  
  // ✅ Computed once, not on every cycle
  title = 'My Application Title';
  itemCount = this.items.length;
  complexStatus = this.items.filter(item => item.id > 500).length > 100 ? 'High' : 'Low';
  primaryColor = '#blue';
  
  // ✅ Pre-computed formatted items
  formattedItems: any[] = [];
  
  ngOnInit() {
    // ✅ Compute expensive operations once
    this.formattedItems = this.items.map(item => ({
      ...item,
      display: \`\${item.name} (ID: \${item.id})\`,
      price: item.id * 10.99
    }));
  }
  
  // ✅ TrackBy function for efficient *ngFor
  trackByFn(index: number, item: any) {
    return item.id; // Use unique identifier
  }
  
  // ✅ Update computed values only when source data changes
  updateItems(newItems: any[]) {
    this.items = newItems;
    this.itemCount = newItems.length;
    this.complexStatus = newItems.filter(item => item.id > 500).length > 100 ? 'High' : 'Low';
    this.formattedItems = newItems.map(item => ({
      ...item,
      display: \`\${item.name} (ID: \${item.id})\`,
      price: item.id * 10.99
    }));
  }
}`,
      explanation:
        'Avoiding function calls in templates and pre-computing expensive operations dramatically improves performance by eliminating redundant calculations on every change detection cycle.',
    },
    diagram: {
      type: 'performance-comparison',
      title: 'Performance Impact Visualization',
      animated: false,
    },
    problemSolution: {
      problem:
        'Default change detection strategy can cause severe performance issues in large applications due to checking every component on every cycle.',
      solution:
        'Optimize templates by avoiding function calls, pre-computing expensive operations, and using trackBy functions for efficient list rendering.',
      benefits: [
        'Dramatically improved performance',
        'Reduced CPU usage',
        'Better user experience',
        'More predictable performance characteristics',
      ],
      implementation:
        'Replace template function calls with component properties, pre-compute expensive operations, and use OnPush strategy for further optimization.',
    },
  },
];

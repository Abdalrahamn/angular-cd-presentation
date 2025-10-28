import { SlideData } from '../../models/slide.interface';

export const part5ZonelessSlides: SlideData[] = [
  {
    id: 'zoneless-future',
    title: 'Part 5: The Future (Zoneless)',
    subtitle: 'Angular Without Zone.js - The Ultimate Performance',
    content: [
      {
        type: 'text',
        content:
          "The zoneless future represents Angular's evolution toward maximum performance and simplicity. By removing Zone.js dependency, Angular achieves smaller bundles, better performance, and cleaner architecture.",
      },
      {
        type: 'highlight',
        content:
          'Zoneless Angular applications rely entirely on signals for reactivity, eliminating the need for global change detection triggers and monkey patching.',
      },
      {
        type: 'bullet',
        content: 'Benefits of zoneless Angular:',
        subItems: [
          'Smaller bundle size (no Zone.js dependency)',
          'Better performance (no monkey patching overhead)',
          'Cleaner debugging (no patched browser APIs)',
          'Better integration with other frameworks',
          'Simplified mental model',
          'Future-proof architecture',
        ],
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Zoneless Angular Configuration',
      code: `// ✅ ZONELESS ANGULAR SETUP

// main.ts - Bootstrap zoneless application
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // ✅ Enable zoneless change detection
    provideExperimentalZonelessChangeDetection(),
    
    // Other providers work normally
    provideRouter(routes),
    provideHttpClient(),
    // ... other providers
  ]
}).catch(err => console.error(err));

// ✅ ZONELESS COMPONENT ARCHITECTURE

@Component({
  selector: 'app-zoneless-demo',
  template: \`
    <div class="zoneless-app">
      <h1>{{ title() }}</h1>
      
      <!-- Signals automatically update the DOM -->
      <p>Counter: {{ counter() }}</p>
      <p>Status: {{ status() }}</p>
      <p>Last update: {{ lastUpdate() | date:'medium' }}</p>
      
      <!-- Event handlers work normally -->
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
      <button (click)="reset()">Reset</button>
      
      <!-- Async operations with signals -->
      <div *ngIf="loading()">Loading...</div>
      <div *ngFor="let item of items(); trackBy: trackByItem">
        {{ item.name }}
      </div>
    </div>
  \`
})
export class ZonelessDemoComponent {
  // ✅ Signals provide all reactivity
  title = signal('Zoneless Angular Demo');
  counter = signal(0);
  loading = signal(false);
  items = signal<Item[]>([]);
  
  // ✅ Computed signals work automatically
  status = computed(() => {
    const count = this.counter();
    if (count === 0) return 'Zero';
    return count > 0 ? 'Positive' : 'Negative';
  });
  
  lastUpdate = computed(() => {
    // Depends on counter - updates when counter changes
    this.counter();
    return new Date();
  });
  
  constructor(private http: HttpClient) {
    // ✅ Effects handle side effects
    effect(() => {
      console.log(\`Counter changed to: \${this.counter()}\`);
    });
    
    // Load initial data
    this.loadItems();
  }
  
  // ✅ Event handlers update signals
  increment() {
    this.counter.update(c => c + 1);
  }
  
  decrement() {
    this.counter.update(c => c - 1);
  }
  
  reset() {
    this.counter.set(0);
  }
  
  // ✅ Async operations with signals
  async loadItems() {
    this.loading.set(true);
    
    try {
      const items = await this.http.get<Item[]>('/api/items').toPromise();
      this.items.set(items || []);
    } catch (error) {
      console.error('Failed to load items:', error);
      this.items.set([]);
    } finally {
      this.loading.set(false);
    }
  }
  
  trackByItem(index: number, item: Item): number {
    return item.id;
  }
}

// ✅ COMPARISON: Zone.js vs Zoneless

// ❌ With Zone.js (traditional)
@Component({
  selector: 'app-with-zone',
  template: \`
    <div>
      <p>{{ message }}</p>
      <button (click)="updateMessage()">Update</button>
    </div>
  \`
})
export class WithZoneComponent {
  message = 'Hello World';
  
  updateMessage() {
    // Zone.js detects this event and triggers change detection
    setTimeout(() => {
      this.message = 'Updated!';
      // Zone.js automatically triggers change detection
    }, 1000);
  }
}

// ✅ Zoneless (signals-based)
@Component({
  selector: 'app-zoneless',
  template: \`
    <div>
      <p>{{ message() }}</p>
      <button (click)="updateMessage()">Update</button>
    </div>
  \`
})
export class ZonelessComponent {
  message = signal('Hello World');
  
  updateMessage() {
    // No Zone.js - signals handle reactivity
    setTimeout(() => {
      this.message.set('Updated!');
      // Signal automatically updates the DOM
    }, 1000);
  }
}

// ✅ ZONELESS BEST PRACTICES

@Component({
  selector: 'app-zoneless-best-practices',
  template: \`
    <div class="best-practices">
      <!-- ✅ Use signals for all reactive state -->
      <h2>{{ pageTitle() }}</h2>
      <p>User: {{ currentUser().name }}</p>
      <p>Theme: {{ theme() }}</p>
      
      <!-- ✅ Computed values update automatically -->
      <p>Greeting: {{ greeting() }}</p>
      <p>Stats: {{ userStats() }}</p>
      
      <!-- ✅ Lists with signals -->
      <ul>
        <li *ngFor="let notification of notifications(); trackBy: trackByNotification">
          {{ notification.message }}
        </li>
      </ul>
      
      <!-- ✅ Conditional rendering -->
      <div *ngIf="hasNotifications()">
        You have {{ notifications().length }} notifications
      </div>
      
      <!-- ✅ Forms with signals -->
      <form (ngSubmit)="saveUser()">
        <input [(ngModel)]="editableUser().name" placeholder="Name">
        <input [(ngModel)]="editableUser().email" placeholder="Email">
        <button type="submit" [disabled]="!isFormValid()">Save</button>
      </form>
    </div>
  \`
})
export class ZonelessBestPracticesComponent {
  // ✅ All state as signals
  pageTitle = signal('Zoneless Best Practices');
  theme = signal<'light' | 'dark'>('light');
  
  currentUser = signal({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    loginCount: 5
  });
  
  editableUser = signal({
    name: '',
    email: ''
  });
  
  notifications = signal([
    { id: 1, message: 'Welcome!', read: false },
    { id: 2, message: 'New update available', read: false }
  ]);
  
  // ✅ Computed signals for derived state
  greeting = computed(() => {
    const user = this.currentUser();
    const theme = this.theme();
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 'evening';
    
    return \`Good \${timeOfDay}, \${user.name}! (\${theme} theme)\`;
  });
  
  userStats = computed(() => {
    const user = this.currentUser();
    return \`\${user.loginCount} logins\`;
  });
  
  hasNotifications = computed(() => this.notifications().length > 0);
  
  isFormValid = computed(() => {
    const user = this.editableUser();
    return user.name.trim().length > 0 && user.email.includes('@');
  });
  
  constructor() {
    // ✅ Effects for side effects
    effect(() => {
      const theme = this.theme();
      document.body.className = theme;
      localStorage.setItem('theme', theme);
    });
    
    effect(() => {
      const user = this.currentUser();
      console.log(\`Current user: \${user.name}\`);
    });
    
    // Initialize editable user
    effect(() => {
      const user = this.currentUser();
      this.editableUser.set({
        name: user.name,
        email: user.email
      });
    });
  }
  
  saveUser() {
    const updates = this.editableUser();
    this.currentUser.update(user => ({
      ...user,
      name: updates.name,
      email: updates.email
    }));
  }
  
  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
  
  trackByNotification(index: number, notification: any): number {
    return notification.id;
  }
}`,
      explanation:
        'Zoneless Angular eliminates Zone.js dependency, relying entirely on signals for reactivity. This results in smaller bundles, better performance, and cleaner architecture.',
    },
    problemSolution: {
      problem:
        'Zone.js adds bundle size, performance overhead, and complexity through monkey patching of browser APIs.',
      solution:
        'Zoneless Angular removes Zone.js dependency, using signals for all reactivity needs, resulting in better performance and simpler architecture.',
      benefits: [
        'Smaller bundle size (no Zone.js)',
        'Better performance (no monkey patching)',
        'Cleaner debugging experience',
        'Better third-party integration',
        'Future-proof architecture',
      ],
      implementation:
        'Use provideExperimentalZonelessChangeDetection() and ensure all reactive state uses signals instead of traditional change detection.',
    },
  },
  {
    id: 'zoneless-migration',
    title: 'Migrating to Zoneless Angular',
    subtitle: 'Practical Steps for Zone.js Removal',
    content: [
      {
        type: 'text',
        content:
          "Migrating to zoneless Angular requires careful preparation and systematic conversion of reactive patterns. Here's a comprehensive guide for successful migration.",
      },
      {
        type: 'bullet',
        content: 'Zoneless migration requirements:',
        subItems: [
          'All reactive state must use signals',
          'No reliance on Zone.js change detection',
          'Manual triggering for third-party integrations',
          'Proper async operation handling',
          'Testing without Zone.js patches',
        ],
      },
      {
        type: 'highlight',
        content:
          "Zoneless migration is only successful when the entire application uses signals for reactivity and doesn't depend on Zone.js automatic change detection.",
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Complete Zoneless Migration Guide',
      code: `// ✅ STEP 1: ENABLE ZONELESS MODE

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    // Remove any Zone.js related providers
  ]
});

// ✅ STEP 2: CONVERT ALL COMPONENTS TO SIGNALS

// ❌ BEFORE: Zone.js dependent component
@Component({
  selector: 'app-old-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
      <h2>{{ user.name }}</h2>
      <p>{{ status }}</p>
      <button (click)="updateStatus()">Update</button>
    </div>
  \`
})
export class OldComponent implements OnInit, OnDestroy {
  @Input() user!: User;
  
  status = '';
  private subscription = new Subscription();
  
  constructor(
    private statusService: StatusService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.subscription.add(
      this.statusService.getStatus().subscribe(status => {
        this.status = status;
        this.cdr.markForCheck(); // Manual change detection
      })
    );
  }
  
  updateStatus() {
    this.statusService.updateStatus().subscribe(() => {
      this.cdr.markForCheck(); // Manual change detection
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

// ✅ AFTER: Zoneless ready component
@Component({
  selector: 'app-new-component',
  template: \`
    <div>
      <h2>{{ user().name }}</h2>
      <p>{{ status() }}</p>
      <button (click)="updateStatus()">Update</button>
    </div>
  \`
})
export class NewComponent {
  user = input.required<User>();
  
  // Convert to signal-based state
  private statusService = inject(StatusService);
  status = this.statusService.status; // Service exposes signal
  
  constructor() {
    // Effects replace subscriptions
    effect(() => {
      const currentUser = this.user();
      console.log(\`User changed: \${currentUser.name}\`);
    });
  }
  
  updateStatus() {
    this.statusService.updateStatus(); // Service handles signal updates
  }
}

// ✅ STEP 3: CONVERT SERVICES TO SIGNALS

// ❌ BEFORE: Observable-based service
@Injectable()
export class OldStatusService {
  private statusSubject = new BehaviorSubject<string>('idle');
  
  status$ = this.statusSubject.asObservable();
  
  getStatus(): Observable<string> {
    return this.http.get<string>('/api/status');
  }
  
  updateStatus(): Observable<void> {
    return this.http.post<void>('/api/status/update', {}).pipe(
      tap(() => this.statusSubject.next('updated'))
    );
  }
}

// ✅ AFTER: Signal-based service
@Injectable()
export class NewStatusService {
  private _status = signal<string>('idle');
  
  // Expose readonly signal
  status = this._status.asReadonly();
  
  constructor(private http: HttpClient) {}
  
  async getStatus(): Promise<string> {
    try {
      const status = await this.http.get<string>('/api/status').toPromise();
      this._status.set(status || 'idle');
      return status || 'idle';
    } catch (error) {
      this._status.set('error');
      throw error;
    }
  }
  
  async updateStatus(): Promise<void> {
    try {
      await this.http.post<void>('/api/status/update', {}).toPromise();
      this._status.set('updated');
    } catch (error) {
      this._status.set('error');
      throw error;
    }
  }
}

// ✅ STEP 4: HANDLE THIRD-PARTY INTEGRATIONS

@Component({
  selector: 'app-third-party-integration',
  template: \`
    <div>
      <div #chartContainer></div>
      <p>Chart data points: {{ dataPoints() }}</p>
      <button (click)="updateChart()">Update Chart</button>
    </div>
  \`
})
export class ThirdPartyIntegrationComponent implements AfterViewInit {
  chartContainer = viewChild<ElementRef>('chartContainer');
  dataPoints = signal<number[]>([]);
  
  private chart: any;
  
  constructor() {
    // Effect to update chart when data changes
    effect(() => {
      const data = this.dataPoints();
      if (this.chart && data.length > 0) {
        this.updateChartData(data);
      }
    });
  }
  
  ngAfterViewInit() {
    // Initialize third-party chart
    effect(() => {
      const container = this.chartContainer();
      if (container && !this.chart) {
        this.initializeChart(container.nativeElement);
      }
    });
  }
  
  private initializeChart(container: HTMLElement) {
    // Initialize chart library (e.g., Chart.js, D3)
    this.chart = new ThirdPartyChart(container, {
      onDataChange: (newData: number[]) => {
        // ✅ Manual signal update for third-party callbacks
        this.dataPoints.set(newData);
      }
    });
  }
  
  private updateChartData(data: number[]) {
    if (this.chart) {
      this.chart.updateData(data);
    }
  }
  
  updateChart() {
    const newData = Array.from({ length: 10 }, () => Math.random() * 100);
    this.dataPoints.set(newData);
  }
}

// ✅ STEP 5: HANDLE ASYNC OPERATIONS

@Component({
  selector: 'app-async-operations',
  template: \`
    <div>
      <h2>Async Operations</h2>
      <p>Loading: {{ loading() }}</p>
      <p>Data: {{ data() || 'No data' }}</p>
      <p>Error: {{ error() || 'No error' }}</p>
      
      <button (click)="loadData()">Load Data</button>
      <button (click)="startPolling()">Start Polling</button>
      <button (click)="stopPolling()">Stop Polling</button>
    </div>
  \`
})
export class AsyncOperationsComponent implements OnDestroy {
  loading = signal(false);
  data = signal<string | null>(null);
  error = signal<string | null>(null);
  
  private pollingInterval?: number;
  
  constructor(private http: HttpClient) {}
  
  async loadData() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      // ✅ Handle async operations manually
      const response = await this.http.get<{data: string}>('/api/data').toPromise();
      this.data.set(response?.data || null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.loading.set(false);
    }
  }
  
  startPolling() {
    this.stopPolling(); // Clear existing interval
    
    this.pollingInterval = window.setInterval(async () => {
      try {
        const response = await this.http.get<{data: string}>('/api/data').toPromise();
        this.data.set(response?.data || null);
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000);
  }
  
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
  }
  
  ngOnDestroy() {
    this.stopPolling();
  }
}

// ✅ STEP 6: TESTING ZONELESS COMPONENTS

describe('ZonelessComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewComponent],
      providers: [
        // ✅ Use zoneless change detection in tests
        provideExperimentalZonelessChangeDetection()
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
  });
  
  it('should update when signal changes', () => {
    // Set input signal
    fixture.componentRef.setInput('user', { 
      id: 1, 
      name: 'John' 
    });
    
    // ✅ Signals trigger updates automatically
    fixture.detectChanges();
    
    expect(fixture.nativeElement.textContent).toContain('John');
  });
  
  it('should handle async operations', async () => {
    const service = TestBed.inject(NewStatusService);
    
    // Mock async operation
    spyOn(service, 'getStatus').and.returnValue(Promise.resolve('active'));
    
    await service.getStatus();
    
    // ✅ Signal updates are synchronous
    expect(service.status()).toBe('active');
  });
});

// ✅ MIGRATION CHECKLIST

/*
ZONELESS MIGRATION CHECKLIST:

✅ Configuration:
- Enable provideExperimentalZonelessChangeDetection()
- Remove Zone.js imports and polyfills
- Update testing configuration

✅ Components:
- Convert all @Input to input()
- Convert all @ViewChild to viewChild()
- Replace component properties with signals
- Convert computed getters to computed()
- Replace ngOnChanges with effects
- Remove ChangeDetectionStrategy.OnPush (not needed)
- Remove ChangeDetectorRef injections

✅ Services:
- Convert BehaviorSubject to signal()
- Convert derived observables to computed()
- Replace subscription management with effects
- Handle async operations manually
- Expose readonly signals publicly

✅ Third-party Integration:
- Manual signal updates for third-party callbacks
- Use effects to react to signal changes
- Handle async operations without Zone.js

✅ Testing:
- Use zoneless change detection in tests
- Test signal updates directly
- Mock async operations properly

✅ Performance:
- Remove unnecessary OnPush strategies
- Optimize with computed signals
- Use effects for side effects only
- Monitor bundle size reduction

COMMON PITFALLS:
❌ Forgetting to update third-party integrations
❌ Leaving Zone.js dependencies in code
❌ Not handling async operations manually
❌ Missing signal updates in callbacks
❌ Incorrect test configuration
*/`,
      explanation:
        'Zoneless migration requires systematic conversion of all reactive patterns to signals and proper handling of third-party integrations without Zone.js.',
    },
    problemSolution: {
      problem:
        'Zone.js dependency creates bundle size overhead and complexity, while migration to zoneless requires careful handling of all reactive patterns.',
      solution:
        'Systematic migration to signals-based reactivity enables zoneless Angular with better performance and smaller bundles.',
      benefits: [
        'Significant bundle size reduction',
        'Better runtime performance',
        'Cleaner debugging experience',
        'Simplified architecture',
        'Better third-party integration',
      ],
      implementation:
        'Convert all components and services to use signals, handle third-party integrations manually, and test thoroughly with zoneless configuration.',
    },
  },
  {
    id: 'zoneless-performance',
    title: 'Zoneless Performance Benefits',
    subtitle: 'Measuring the Impact of Zone.js Removal',
    content: [
      {
        type: 'text',
        content:
          'Removing Zone.js provides measurable performance benefits in bundle size, runtime performance, and memory usage. Understanding these benefits helps justify the migration effort.',
      },
      {
        type: 'bullet',
        content: 'Zoneless performance improvements:',
        subItems: [
          'Bundle size reduction: ~45KB (Zone.js + polyfills)',
          'Faster application startup (no API patching)',
          'Reduced memory overhead (no zone tracking)',
          'Better performance in async-heavy applications',
          'Improved debugging and profiling accuracy',
          'Better integration with performance monitoring',
        ],
      },
      {
        type: 'comparison',
        content: 'Performance Comparison:',
        comparison: {
          before: 'Zone.js: Larger bundles, monkey patching overhead, global change detection',
          after: 'Zoneless: Smaller bundles, no patching overhead, surgical signal updates',
        },
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Performance Measurement and Optimization',
      code: `// ✅ PERFORMANCE MEASUREMENT TOOLS

@Injectable()
export class PerformanceMonitorService {
  private performanceMetrics = signal({
    bundleSize: 0,
    startupTime: 0,
    changeDetectionCycles: 0,
    memoryUsage: 0
  });
  
  metrics = this.performanceMetrics.asReadonly();
  
  constructor() {
    this.measureStartupPerformance();
    this.setupPerformanceObserver();
  }
  
  private measureStartupPerformance() {
    // Measure application startup time
    const navigationStart = performance.timing.navigationStart;
    const loadComplete = performance.timing.loadEventEnd;
    const startupTime = loadComplete - navigationStart;
    
    this.performanceMetrics.update(metrics => ({
      ...metrics,
      startupTime
    }));
    
    console.log(\`App startup time: \${startupTime}ms\`);
  }
  
  private setupPerformanceObserver() {
    // Monitor performance entries
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            console.log(\`Performance measure: \${entry.name} - \${entry.duration}ms\`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }
  
  measureChangeDetectionCycle() {
    performance.mark('cd-start');
    
    // This would be called after change detection
    setTimeout(() => {
      performance.mark('cd-end');
      performance.measure('change-detection', 'cd-start', 'cd-end');
    }, 0);
  }
  
  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.performanceMetrics.update(metrics => ({
        ...metrics,
        memoryUsage: memory.usedJSHeapSize
      }));
    }
  }
}

// ✅ ZONELESS PERFORMANCE OPTIMIZATIONS

@Component({
  selector: 'app-performance-optimized',
  template: \`
    <div class="performance-demo">
      <h2>Performance Optimized Component</h2>
      
      <!-- ✅ Efficient list rendering with signals -->
      <div class="large-list">
        <div *ngFor="let item of visibleItems(); trackBy: trackByItem" 
             class="list-item">
          {{ item.name }} - {{ item.value }}
        </div>
      </div>
      
      <!-- ✅ Computed values for expensive operations -->
      <div class="statistics">
        <p>Total Items: {{ totalItems() }}</p>
        <p>Average Value: {{ averageValue() }}</p>
        <p>Filtered Count: {{ filteredCount() }}</p>
      </div>
      
      <!-- ✅ Efficient search with debouncing -->
      <input 
        #searchInput
        (input)="updateSearch(searchInput.value)"
        placeholder="Search items..."
      >
      
      <!-- ✅ Virtual scrolling for large datasets -->
      <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
        <div *cdkVirtualFor="let item of allItems(); trackBy: trackByItem">
          {{ item.name }}
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  \`
})
export class PerformanceOptimizedComponent {
  // ✅ Large dataset as signal
  private allItemsSignal = signal<Item[]>([]);
  private searchTermSignal = signal('');
  private pageSignal = signal(0);
  
  // ✅ Computed for filtered and paginated data
  filteredItems = computed(() => {
    const items = this.allItemsSignal();
    const searchTerm = this.searchTermSignal().toLowerCase();
    
    if (!searchTerm) return items;
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
    );
  });
  
  visibleItems = computed(() => {
    const filtered = this.filteredItems();
    const page = this.pageSignal();
    const pageSize = 100;
    
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  });
  
  // ✅ Expensive computations memoized with computed
  totalItems = computed(() => this.allItemsSignal().length);
  
  averageValue = computed(() => {
    const items = this.allItemsSignal();
    if (items.length === 0) return 0;
    
    const sum = items.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / items.length * 100) / 100;
  });
  
  filteredCount = computed(() => this.filteredItems().length);
  
  // Expose readonly signals
  allItems = this.allItemsSignal.asReadonly();
  
  private searchDebounceTimer?: number;
  
  constructor(private performanceMonitor: PerformanceMonitorService) {
    // Generate large dataset
    this.generateLargeDataset();
    
    // ✅ Effect for performance monitoring
    effect(() => {
      const itemCount = this.totalItems();
      console.log(\`Dataset size: \${itemCount} items\`);
      this.performanceMonitor.measureMemoryUsage();
    });
  }
  
  private generateLargeDataset() {
    const items: Item[] = [];
    
    performance.mark('dataset-generation-start');
    
    for (let i = 0; i < 10000; i++) {
      items.push({
        id: i,
        name: \`Item \${i}\`,
        description: \`Description for item \${i}\`,
        value: Math.random() * 1000,
        category: \`Category \${i % 10}\`
      });
    }
    
    performance.mark('dataset-generation-end');
    performance.measure('dataset-generation', 'dataset-generation-start', 'dataset-generation-end');
    
    this.allItemsSignal.set(items);
  }
  
  // ✅ Debounced search update
  updateSearch(term: string) {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    
    this.searchDebounceTimer = window.setTimeout(() => {
      performance.mark('search-start');
      this.searchTermSignal.set(term);
      performance.mark('search-end');
      performance.measure('search-filter', 'search-start', 'search-end');
    }, 300);
  }
  
  trackByItem(index: number, item: Item): number {
    return item.id;
  }
  
  // ✅ Efficient batch operations
  batchUpdateItems(updates: { id: number; value: number }[]) {
    performance.mark('batch-update-start');
    
    this.allItemsSignal.update(items =>
      items.map(item => {
        const update = updates.find(u => u.id === item.id);
        return update ? { ...item, value: update.value } : item;
      })
    );
    
    performance.mark('batch-update-end');
    performance.measure('batch-update', 'batch-update-start', 'batch-update-end');
  }
}

// ✅ PERFORMANCE COMPARISON COMPONENT

@Component({
  selector: 'app-performance-comparison',
  template: \`
    <div class="comparison">
      <h2>Performance Comparison</h2>
      
      <div class="metrics">
        <div class="metric-card">
          <h3>Bundle Size</h3>
          <p class="before">With Zone.js: {{ bundleSizes.withZone }}KB</p>
          <p class="after">Zoneless: {{ bundleSizes.zoneless }}KB</p>
          <p class="savings">Savings: {{ bundleSavings() }}KB ({{ bundleSavingsPercent() }}%)</p>
        </div>
        
        <div class="metric-card">
          <h3>Startup Time</h3>
          <p class="before">With Zone.js: {{ startupTimes.withZone }}ms</p>
          <p class="after">Zoneless: {{ startupTimes.zoneless }}ms</p>
          <p class="savings">Improvement: {{ startupImprovement() }}ms ({{ startupImprovementPercent() }}%)</p>
        </div>
        
        <div class="metric-card">
          <h3>Memory Usage</h3>
          <p class="before">With Zone.js: {{ memoryUsage.withZone }}MB</p>
          <p class="after">Zoneless: {{ memoryUsage.zoneless }}MB</p>
          <p class="savings">Reduction: {{ memoryReduction() }}MB ({{ memoryReductionPercent() }}%)</p>
        </div>
      </div>
      
      <div class="performance-chart">
        <canvas #performanceChart></canvas>
      </div>
    </div>
  \`
})
export class PerformanceComparisonComponent implements AfterViewInit {
  performanceChart = viewChild<ElementRef>('performanceChart');
  
  // Performance data
  bundleSizes = signal({
    withZone: 245, // KB
    zoneless: 200  // KB
  });
  
  startupTimes = signal({
    withZone: 850, // ms
    zoneless: 720  // ms
  });
  
  memoryUsage = signal({
    withZone: 12.5, // MB
    zoneless: 10.8  // MB
  });
  
  // Computed improvements
  bundleSavings = computed(() => {
    const sizes = this.bundleSizes();
    return sizes.withZone - sizes.zoneless;
  });
  
  bundleSavingsPercent = computed(() => {
    const sizes = this.bundleSizes();
    return Math.round((this.bundleSavings() / sizes.withZone) * 100);
  });
  
  startupImprovement = computed(() => {
    const times = this.startupTimes();
    return times.withZone - times.zoneless;
  });
  
  startupImprovementPercent = computed(() => {
    const times = this.startupTimes();
    return Math.round((this.startupImprovement() / times.withZone) * 100);
  });
  
  memoryReduction = computed(() => {
    const usage = this.memoryUsage();
    return Math.round((usage.withZone - usage.zoneless) * 10) / 10;
  });
  
  memoryReductionPercent = computed(() => {
    const usage = this.memoryUsage();
    return Math.round((this.memoryReduction() / usage.withZone) * 100);
  });
  
  ngAfterViewInit() {
    effect(() => {
      const canvas = this.performanceChart();
      if (canvas) {
        this.renderPerformanceChart(canvas.nativeElement);
      }
    });
  }
  
  private renderPerformanceChart(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simple bar chart showing performance improvements
    const data = [
      { label: 'Bundle Size', withZone: this.bundleSizes().withZone, zoneless: this.bundleSizes().zoneless },
      { label: 'Startup Time', withZone: this.startupTimes().withZone, zoneless: this.startupTimes().zoneless },
      { label: 'Memory Usage', withZone: this.memoryUsage().withZone * 20, zoneless: this.memoryUsage().zoneless * 20 }
    ];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    const barWidth = 60;
    const barSpacing = 100;
    const maxValue = Math.max(...data.flatMap(d => [d.withZone, d.zoneless]));
    
    data.forEach((item, index) => {
      const x = index * barSpacing + 50;
      
      // With Zone.js bar (red)
      const withZoneHeight = (item.withZone / maxValue) * 200;
      ctx.fillStyle = '#ff6b9d';
      ctx.fillRect(x, 250 - withZoneHeight, barWidth / 2, withZoneHeight);
      
      // Zoneless bar (green)
      const zonelessHeight = (item.zoneless / maxValue) * 200;
      ctx.fillStyle = '#06ffa5';
      ctx.fillRect(x + barWidth / 2, 250 - zonelessHeight, barWidth / 2, zonelessHeight);
      
      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(item.label, x, 270);
    });
  }
}`,
      explanation:
        'Zoneless Angular provides significant performance benefits through reduced bundle size, faster startup, and lower memory usage, with measurable improvements in real-world applications.',
    },
    diagram: {
      type: 'performance-comparison',
      title: 'Zoneless Performance Benefits',
      animated: false,
    },
    problemSolution: {
      problem:
        'Zone.js adds significant overhead in bundle size, runtime performance, and memory usage, especially in large or performance-critical applications.',
      solution:
        'Zoneless Angular eliminates Zone.js overhead, providing measurable improvements in bundle size, startup time, and runtime performance.',
      benefits: [
        '~45KB bundle size reduction',
        '15-20% faster startup times',
        '10-15% memory usage reduction',
        'Better performance profiling accuracy',
        'Improved third-party integration',
      ],
      implementation:
        'Measure performance before and after zoneless migration, optimize with signals and computed values, and monitor improvements with performance tools.',
    },
  },
  {
    id: 'zoneless-ecosystem',
    title: 'Zoneless Ecosystem and Future',
    subtitle: 'The Road Ahead for Angular',
    content: [
      {
        type: 'text',
        content:
          "The zoneless future represents Angular's evolution toward a more performant, simpler, and more interoperable framework. Understanding the ecosystem implications helps prepare for the future.",
      },
      {
        type: 'bullet',
        content: 'Zoneless ecosystem benefits:',
        subItems: [
          'Better integration with other frameworks and libraries',
          'Simplified server-side rendering (SSR)',
          'Improved web worker compatibility',
          'Better performance monitoring and profiling',
          'Reduced complexity for new developers',
          'Future-proof architecture aligned with web standards',
        ],
      },
      {
        type: 'highlight',
        content:
          'Zoneless Angular represents the future direction of the framework, with signals becoming the primary reactivity mechanism and Zone.js eventually being phased out.',
      },
    ],
    codeExample: {
      language: 'typescript',
      title: 'Future Angular Architecture with Signals',
      code: `// ✅ FUTURE ANGULAR COMPONENT ARCHITECTURE

// The future of Angular components - fully signal-based
@Component({
  selector: 'app-future-component',
  // No changeDetection needed - signals handle everything
  template: \`
    <div class="future-component">
      <!-- Signal inputs work seamlessly -->
      <h1>{{ title() }}</h1>
      <p>Welcome, {{ user().name }}!</p>
      
      <!-- Two-way binding with signals -->
      <input [(ngModel)]="searchTerm" placeholder="Search...">
      
      <!-- Computed values update automatically -->
      <div class="results">
        <p>Found {{ filteredResults().length }} results</p>
        <div *ngFor="let result of filteredResults(); trackBy: trackByResult">
          {{ result.title }}
        </div>
      </div>
      
      <!-- Async operations with signals -->
      <div *ngIf="loading()">Loading...</div>
      <div *ngIf="error() as err" class="error">{{ err }}</div>
      
      <!-- Event handling -->
      <button (click)="refresh()">Refresh</button>
      <button (click)="exportData()">Export</button>
    </div>
  \`
})
export class FutureComponent {
  // Signal inputs - the new standard
  title = input<string>('Future Angular');
  user = input.required<User>();
  
  // Two-way binding signal
  searchTerm = model<string>('');
  
  // State signals
  private _results = signal<SearchResult[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Computed signals for derived state
  filteredResults = computed(() => {
    const results = this._results();
    const term = this.searchTerm().toLowerCase();
    
    if (!term) return results;
    
    return results.filter(result =>
      result.title.toLowerCase().includes(term) ||
      result.description.toLowerCase().includes(term)
    );
  });
  
  // Expose readonly signals
  results = this._results.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();
  
  constructor(private dataService: DataService) {
    // Effects replace lifecycle hooks for reactive operations
    effect(() => {
      const user = this.user();
      console.log(\`User changed: \${user.name}\`);
      this.loadUserData(user.id);
    });
    
    // Debounced search effect
    effect(() => {
      const term = this.searchTerm();
      if (term.length > 2) {
        this.performSearch(term);
      }
    });
  }
  
  private async loadUserData(userId: number) {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      const results = await this.dataService.getUserData(userId);
      this._results.set(results);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this._loading.set(false);
    }
  }
  
  private async performSearch(term: string) {
    try {
      const results = await this.dataService.search(term);
      this._results.set(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }
  
  refresh() {
    this.loadUserData(this.user().id);
  }
  
  async exportData() {
    const data = this.filteredResults();
    // Export logic
  }
  
  trackByResult(index: number, result: SearchResult): number {
    return result.id;
  }
}

// ✅ FUTURE SERVICE ARCHITECTURE

@Injectable({
  providedIn: 'root'
})
export class FutureDataService {
  // Private signals for internal state
  private _cache = signal(new Map<string, any>());
  private _requestsInFlight = signal(new Set<string>());
  
  // Public computed signals
  cacheSize = computed(() => this._cache().size);
  activeRequests = computed(() => this._requestsInFlight().size);
  
  constructor(private http: HttpClient) {
    // Effect for cache management
    effect(() => {
      const cache = this._cache();
      if (cache.size > 100) {
        // Implement LRU cache cleanup
        this.cleanupCache();
      }
    });
  }
  
  // Reactive data fetching with caching
  async getData(key: string): Promise<any> {
    const cache = this._cache();
    
    // Return cached data if available
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Prevent duplicate requests
    const inFlight = this._requestsInFlight();
    if (inFlight.has(key)) {
      return this.waitForRequest(key);
    }
    
    // Mark request as in flight
    this._requestsInFlight.update(set => new Set([...set, key]));
    
    try {
      const data = await this.http.get(\`/api/data/\${key}\`).toPromise();
      
      // Update cache
      this._cache.update(cache => new Map([...cache, [key, data]]));
      
      return data;
    } finally {
      // Remove from in-flight requests
      this._requestsInFlight.update(set => {
        const newSet = new Set(set);
        newSet.delete(key);
        return newSet;
      });
    }
  }
  
  private async waitForRequest(key: string): Promise<any> {
    // Wait for in-flight request to complete
    while (this._requestsInFlight().has(key)) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return this._cache().get(key);
  }
  
  private cleanupCache() {
    // Implement LRU cache cleanup logic
    const cache = this._cache();
    const entries = Array.from(cache.entries());
    const toKeep = entries.slice(-50); // Keep last 50 entries
    
    this._cache.set(new Map(toKeep));
  }
}

// ✅ FUTURE APPLICATION ARCHITECTURE

// main.ts - Future Angular bootstrap
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    // Zoneless is the default in future Angular
    provideExperimentalZonelessChangeDetection(),
    
    // Enhanced providers for signals ecosystem
    provideSignalsRouter(), // Future signals-based router
    provideSignalsHttpClient(), // Future signals-based HTTP
    provideSignalsAnimations(), // Future signals-based animations
    
    // State management with signals
    provideSignalsStore(), // Future built-in state management
  ]
});

// ✅ FUTURE FRAMEWORK FEATURES

// Future Angular Router with signals
@Injectable()
export class FutureRouterService {
  // Router state as signals
  currentRoute = signal<Route | null>(null);
  params = signal<Record<string, string>>({});
  queryParams = signal<Record<string, string>>({});
  
  // Computed navigation state
  isNavigating = signal(false);
  canGoBack = computed(() => window.history.length > 1);
  
  // Navigation methods
  navigate(path: string, params?: Record<string, any>) {
    this.isNavigating.set(true);
    // Navigation logic
    this.isNavigating.set(false);
  }
  
  // Reactive route guards
  canActivate(route: Route): boolean {
    // Use signals for reactive route guards
    return this.checkPermissions(route);
  }
  
  private checkPermissions(route: Route): boolean {
    // Permission checking logic
    return true;
  }
}

// Future HTTP Client with signals
@Injectable()
export class FutureHttpService {
  // Request state signals
  private _pendingRequests = signal(0);
  private _requestHistory = signal<RequestLog[]>([]);
  
  // Public signals
  isLoading = computed(() => this._pendingRequests() > 0);
  requestCount = computed(() => this._requestHistory().length);
  
  async get<T>(url: string): Promise<T> {
    this._pendingRequests.update(count => count + 1);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Log request
      this._requestHistory.update(history => [
        ...history,
        { url, method: 'GET', timestamp: new Date(), success: true }
      ]);
      
      return data;
    } catch (error) {
      this._requestHistory.update(history => [
        ...history,
        { url, method: 'GET', timestamp: new Date(), success: false }
      ]);
      throw error;
    } finally {
      this._pendingRequests.update(count => count - 1);
    }
  }
}

// ✅ FUTURE DEVELOPMENT EXPERIENCE

// Enhanced developer tools for signals
@Injectable()
export class SignalsDevToolsService {
  private _signalRegistry = signal(new Map<string, any>());
  private _signalUpdates = signal<SignalUpdate[]>([]);
  
  // Register signal for debugging
  registerSignal(name: string, signal: any) {
    this._signalRegistry.update(registry => 
      new Map([...registry, [name, signal]])
    );
  }
  
  // Track signal updates
  trackUpdate(signalName: string, oldValue: any, newValue: any) {
    this._signalUpdates.update(updates => [
      ...updates,
      {
        signalName,
        oldValue,
        newValue,
        timestamp: new Date()
      }
    ]);
  }
  
  // Get signal dependency graph
  getDependencyGraph(): SignalDependency[] {
    // Build dependency graph for visualization
    return [];
  }
  
  // Performance profiling
  profileSignalUpdates(): SignalProfile[] {
    // Profile signal update performance
    return [];
  }
}

// Future Angular will have built-in signals devtools
declare global {
  interface Window {
    ngSignals: {
      inspect: (signal: any) => SignalInspection;
      profile: () => SignalProfile[];
      dependencies: (signal: any) => any[];
    };
  }
}`,
      explanation:
        'The future of Angular is signals-first, zoneless, and built around reactive primitives that provide better performance, simpler mental models, and enhanced developer experience.',
    },
    problemSolution: {
      problem:
        'Current Angular complexity with Zone.js, mixed reactivity models, and performance overhead limits scalability and developer experience.',
      solution:
        'Future Angular with signals-first architecture, zoneless operation, and unified reactivity provides a simpler, more performant, and more maintainable framework.',
      benefits: [
        'Unified reactivity model with signals',
        'Better performance and smaller bundles',
        'Simplified mental model for developers',
        'Enhanced debugging and profiling',
        'Better ecosystem integration',
        'Future-proof architecture',
      ],
      implementation:
        "Adopt signals now, prepare for zoneless migration, and align with Angular's future direction for long-term maintainability and performance.",
    },
  },
];

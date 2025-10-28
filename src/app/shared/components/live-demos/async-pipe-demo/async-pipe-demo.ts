import {
  Component,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-async-pipe-demo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Async Pipe with OnPush Demo</h3>
      <div class="demo-content">
        <div class="demo-grid">
          <!-- Manual Subscription (Wrong Way) -->
          <div class="demo-section manual">
            <h4>❌ Manual Subscription</h4>
            <p class="description">Without async pipe - requires manual work</p>
            
            <div class="data-display">
              <div class="data-value">{{ manualData() }}</div>
              <div class="data-label">Manual Data</div>
            </div>

            <div class="controls">
              <button (click)="updateManualData()" class="demo-button">
                Update Data
              </button>
            </div>

            <div class="explanation">
              <p><strong>Problems:</strong></p>
              <ul>
                <li>Must manually subscribe/unsubscribe</li>
                <li>Need to call markForCheck()</li>
                <li>Memory leak risk if forgotten</li>
                <li>More boilerplate code</li>
              </ul>
            </div>
          </div>

          <!-- Async Pipe (Right Way) -->
          <div class="demo-section async">
            <h4>✅ Async Pipe</h4>
            <p class="description">Automatic subscription & change detection</p>
            
            <div class="data-display">
              <div class="data-value">{{ asyncData$ | async }}</div>
              <div class="data-label">Async Pipe Data</div>
            </div>

            <div class="controls">
              <button (click)="updateAsyncData()" class="demo-button success">
                Update Data
              </button>
              <button (click)="startTimer()" class="demo-button">
                Start Timer
              </button>
            </div>

            <div class="explanation">
              <p><strong>Benefits:</strong></p>
              <ul>
                <li>✅ Auto subscribe/unsubscribe</li>
                <li>✅ Auto calls markForCheck()</li>
                <li>✅ No memory leaks</li>
                <li>✅ Clean, declarative code</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Timer Demo -->
        @if (timerRunning()) {
          <div class="timer-section">
            <h4>⏱️ Live Timer (Async Pipe)</h4>
            <div class="timer-display">
              <div class="timer-value">{{ timer$ | async }}</div>
              <div class="timer-label">Seconds Elapsed</div>
            </div>
            <p class="timer-note">Notice how the UI updates automatically every second thanks to async pipe!</p>
          </div>
        }

        <div class="code-comparison">
          <h4>Code Comparison:</h4>
          <div class="code-grid">
            <div class="code-block manual-code">
              <h5>❌ Manual (Complex)</h5>
              <pre><code>{{ manualCodeExample }}</code></pre>
            </div>

            <div class="code-block async-code">
              <h5>✅ Async Pipe (Simple)</h5>
              <pre><code>{{ asyncCodeExample }}</code></pre>
            </div>
          </div>
        </div>

        <div class="key-insight">
          <div class="insight-icon">💡</div>
          <div class="insight-content">
            <h4>How Async Pipe Works Internally:</h4>
            <ol>
              <li>Async pipe subscribes to the Observable</li>
              <li>When new value arrives, it calls <code>markForCheck()</code></li>
              <li>OnPush component gets marked as dirty</li>
              <li>Change detection runs and updates the view</li>
              <li>On component destroy, async pipe auto-unsubscribes</li>
            </ol>
          </div>
        </div>

        <div class="console-log">
          <h4>Event Log:</h4>
          <div class="log-content">
            @for (log of logs(); track $index) {
              <div class="log-entry" [class.manual]="log.includes('Manual')" [class.auto]="log.includes('Async')">
                {{ log }}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
      border: 2px solid #9c27b0;
      box-shadow: 0 4px 20px rgba(156, 39, 176, 0.3);
    }

    .demo-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .demo-section {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      border: 2px solid transparent;
    }

    .demo-section.manual {
      border-color: #f44336;
    }

    .demo-section.async {
      border-color: #4caf50;
    }

    .demo-section h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }

    .manual h4 {
      color: #f44336;
    }

    .async h4 {
      color: #4caf50;
    }

    .description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin: 0 0 1rem 0;
    }

    .data-display {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 1rem;
    }

    .data-value {
      font-size: 2rem;
      font-weight: bold;
      color: #9c27b0;
      text-shadow: 0 0 10px rgba(156, 39, 176, 0.5);
      min-height: 2.5rem;
    }

    .data-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .demo-button {
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      color: white;
    }

    .demo-button.success {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);
    }

    .explanation {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
    }

    .explanation p {
      margin: 0 0 0.5rem 0;
      color: rgba(255, 255, 255, 0.9);
      font-weight: bold;
    }

    .explanation ul {
      margin: 0;
      padding-left: 1.5rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .explanation li {
      margin: 0.25rem 0;
    }

    .timer-section {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      border: 2px solid #00bcd4;
    }

    .timer-section h4 {
      color: #00bcd4;
      margin: 0 0 1rem 0;
    }

    .timer-display {
      background: rgba(0, 0, 0, 0.3);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 1rem;
    }

    .timer-value {
      font-size: 4rem;
      font-weight: bold;
      color: #00bcd4;
      text-shadow: 0 0 20px rgba(0, 188, 212, 0.5);
    }

    .timer-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .timer-note {
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
      margin: 0;
      text-align: center;
    }

    .code-comparison {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
    }

    .code-comparison h4 {
      color: #9c27b0;
      margin: 0 0 1rem 0;
    }

    .code-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .code-block {
      background: rgba(0, 0, 0, 0.4);
      padding: 1rem;
      border-radius: 6px;
      border-left: 4px solid;
    }

    .code-block.manual-code {
      border-left-color: #f44336;
    }

    .code-block.async-code {
      border-left-color: #4caf50;
    }

    .code-block h5 {
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
    }

    .manual-code h5 {
      color: #f44336;
    }

    .async-code h5 {
      color: #4caf50;
    }

    .code-block pre {
      margin: 0;
      overflow-x: auto;
    }

    .code-block code {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.5;
    }

    .key-insight {
      background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%);
      padding: 1.5rem;
      border-radius: 8px;
      border: 2px solid #ffc107;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .insight-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .insight-content h4 {
      color: #ffc107;
      margin: 0 0 0.75rem 0;
    }

    .insight-content ol {
      margin: 0;
      padding-left: 1.5rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .insight-content li {
      margin: 0.5rem 0;
      line-height: 1.5;
    }

    .insight-content code {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      color: #ffc107;
    }

    .console-log {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 8px;
    }

    .console-log h4 {
      color: #9c27b0;
      margin: 0 0 0.5rem 0;
    }

    .log-content {
      max-height: 200px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
    }

    .log-entry {
      padding: 0.25rem 0.5rem;
      margin: 0.25rem 0;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
    }

    .log-entry.manual {
      background: rgba(244, 67, 54, 0.2);
      border-left: 3px solid #f44336;
    }

    .log-entry.auto {
      background: rgba(76, 175, 80, 0.2);
      border-left: 3px solid #4caf50;
    }

    h3 {
      color: #9c27b0;
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
    }
  `],
})
export class AsyncPipeDemoComponent {
  // Manual subscription data
  manualData = signal('Initial Data');
  
  // Async pipe data
  private asyncDataSubject = new BehaviorSubject<string>('Initial Data');
  asyncData$ = this.asyncDataSubject.asObservable();
  
  // Timer
  timerRunning = signal(false);
  timer$ = interval(1000).pipe(
    take(10),
    map(val => val + 1)
  );
  
  logs = signal<string[]>(['Component initialized with OnPush + Async Pipe demo']);

  // Code examples
  manualCodeExample = `// Component
subscription = new Subscription();
data: string;

ngOnInit() {
  this.subscription.add(
    this.service.getData()
      .subscribe(data => {
        this.data = data;
        this.cdr.markForCheck();
      })
  );
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}

// Template
{{ data }}`;

  asyncCodeExample = `// Component
data$ = this.service.getData();

// That's it! No lifecycle hooks needed

// Template
{{ data$ | async }}`;

  updateManualData() {
    const newData = `Manual Update ${Date.now() % 1000}`;
    this.manualData.set(newData);
    this.addLog(`Manual: Updated data to "${newData}" - Using signals for reactivity`);
  }

  updateAsyncData() {
    const newData = `Async Update ${Date.now() % 1000}`;
    this.asyncDataSubject.next(newData);
    this.addLog(`Async: Observable emitted "${newData}" - Async pipe auto-called markForCheck()`);
  }

  startTimer() {
    this.timerRunning.set(true);
    this.addLog(`Async: Timer started - Async pipe will auto-update every second!`);
    
    // Reset timer after completion
    setTimeout(() => {
      this.timerRunning.set(false);
      this.timer$ = interval(1000).pipe(
        take(10),
        map(val => val + 1)
      );
      this.addLog(`Async: Timer completed and reset`);
    }, 10000);
  }

  private addLog(message: string) {
    this.logs.update(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }
}

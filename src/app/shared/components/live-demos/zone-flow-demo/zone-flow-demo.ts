import {
  Component,
  signal,
  computed,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-zone-flow-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Zone.js Flow Demo</h3>
      <div class="demo-content">
        <div class="zone-visualization">
          <h4>Zone.js Monkey Patching in Action</h4>

          <div class="api-grid">
            <div class="api-card" [class.active]="activeAPI() === 'setTimeout'">
              <h5>setTimeout</h5>
              <button (click)="testSetTimeout()" class="api-button">Test setTimeout</button>
              <div class="status">{{ setTimeoutStatus() }}</div>
            </div>

            <div class="api-card" [class.active]="activeAPI() === 'promise'">
              <h5>Promise</h5>
              <button (click)="testPromise()" class="api-button">Test Promise</button>
              <div class="status">{{ promiseStatus() }}</div>
            </div>

            <div class="api-card" [class.active]="activeAPI() === 'event'">
              <h5>DOM Event</h5>
              <button (click)="testEvent()" class="api-button">Test Event</button>
              <div class="status">{{ eventStatus() }}</div>
            </div>
          </div>

          <div class="zone-log">
            <h4>Zone.js Execution Log:</h4>
            <div class="log-content" #logContainer>{{ zoneLog() }}</div>
          </div>
        </div>

        <div class="demo-explanation">
          <h4>How Zone.js Works:</h4>
          <ol>
            <li><strong>Monkey Patching:</strong> Zone.js replaces browser APIs</li>
            <li><strong>Task Tracking:</strong> Wraps callbacks to track execution</li>
            <li><strong>Zone Context:</strong> Maintains execution context</li>
            <li><strong>Stability Detection:</strong> Knows when async work completes</li>
            <li><strong>Change Detection:</strong> Triggers Angular updates automatically</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 2px solid #22c55e;
        box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
      }

      .demo-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .zone-visualization {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
      }

      .zone-visualization h4 {
        color: #22c55e;
        margin: 0 0 1rem 0;
      }

      .api-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .api-card {
        background: rgba(0, 0, 0, 0.2);
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .api-card.active {
        border-color: #22c55e;
        background: rgba(34, 197, 94, 0.1);
        transform: scale(1.05);
      }

      .api-card h5 {
        color: #22c55e;
        margin: 0 0 0.75rem 0;
        font-size: 1.1rem;
      }

      .api-button {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 0.75rem;
        width: 100%;
      }

      .api-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
      }

      .status {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .zone-log {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 8px;
      }

      .zone-log h4 {
        color: #22c55e;
        margin: 0 0 0.5rem 0;
      }

      .log-content {
        color: #22c55e;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        white-space: pre-line;
        max-height: 150px;
        overflow-y: auto;
        line-height: 1.4;
      }

      .demo-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #22c55e;
      }

      .demo-explanation h4 {
        color: #22c55e;
        margin: 0 0 0.5rem 0;
      }

      .demo-explanation ol {
        margin: 0;
        padding-left: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .demo-explanation li {
        margin-bottom: 0.4rem;
        line-height: 1.4;
      }

      h3 {
        color: #22c55e;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class ZoneFlowDemoComponent implements AfterViewInit {
  @ViewChild('logContainer') logContainer!: ElementRef<HTMLDivElement>;

  activeAPI = signal<string | null>(null);
  zoneLog = signal('Zone.js monitoring all async operations...\n\n');

  ngAfterViewInit() {
    // Auto-scroll will be triggered after each log update
  }

  setTimeoutStatus = signal('Ready to test');
  promiseStatus = signal('Ready to test');
  eventStatus = signal('Ready to test');

  constructor(private cdr: ChangeDetectorRef) {}

  testSetTimeout() {
    this.activeAPI.set('setTimeout');
    this.setTimeoutStatus.set('⏳ setTimeout scheduled...');

    const timestamp = new Date().toLocaleTimeString();
    this.addToLog(`[${timestamp}] Zone.js: setTimeout() called`);
    this.addToLog('- Monkey patching active');
    this.addToLog('- Callback wrapped in zone context');

    setTimeout(() => {
      this.setTimeoutStatus.set('✅ Callback executed!');
      this.addToLog('- setTimeout callback executed');
      this.addToLog('- Zone detected completion');
      this.addToLog('- Change detection triggered\n');
      this.activeAPI.set(null);
    }, 1000);
  }

  testPromise() {
    this.activeAPI.set('promise');
    this.promiseStatus.set('⏳ Promise pending...');

    const timestamp = new Date().toLocaleTimeString();
    this.addToLog(`[${timestamp}] Zone.js: Promise created`);
    this.addToLog('- Promise.then() patched');
    this.addToLog('- Microtask scheduled');

    Promise.resolve('Hello Zone!').then((result) => {
      this.promiseStatus.set(`✅ Resolved: ${result}`);
      this.addToLog('- Promise resolved');
      this.addToLog('- Microtask executed');
      this.addToLog('- Zone became stable');
      this.addToLog('- Change detection triggered\n');
      this.activeAPI.set(null);
    });
  }

  testEvent() {
    this.activeAPI.set('event');
    this.eventStatus.set('✅ Event triggered!');

    const timestamp = new Date().toLocaleTimeString();
    this.addToLog(`[${timestamp}] Zone.js: DOM event fired`);
    this.addToLog('- Event listener wrapped');
    this.addToLog('- Component marked dirty');
    this.addToLog('- Change detection scheduled');
    this.addToLog('- UI updated automatically\n');

    setTimeout(() => {
      this.eventStatus.set('Ready to test');
      this.activeAPI.set(null);
    }, 2000);
  }

  private addToLog(message: string) {
    this.zoneLog.update((log) => log + message + '\n');
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.logContainer) {
        this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}

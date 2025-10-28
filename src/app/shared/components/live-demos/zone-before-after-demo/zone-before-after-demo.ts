import {
  Component,
  signal,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';

@Component({
  selector: 'app-zone-before-after-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Zone.js Before & After Demo</h3>
      <div class="demo-content">
        <div class="demo-grid">
          <!-- WITHOUT Zone.js -->
          <div class="demo-section without-zone">
            <h4>❌ WITHOUT Zone.js</h4>
            <p class="description">Manual change detection required</p>
            
            <div class="counter-display">
              <div class="counter-value">{{ withoutZoneCounter() }}</div>
              <div class="counter-label">Counter Value</div>
            </div>

            <div class="controls">
              <button (click)="incrementWithoutZone()" class="demo-button">
                Increment (No Auto-Update)
              </button>
              <button (click)="manualDetectChanges()" class="demo-button manual">
                🔄 Manual detectChanges()
              </button>
            </div>

            <div class="explanation">
              <p><strong>Problem:</strong> Clicking increment updates the data but UI doesn't refresh automatically!</p>
              <p><strong>Solution:</strong> Must manually call detectChanges()</p>
            </div>
          </div>

          <!-- WITH Zone.js -->
          <div class="demo-section with-zone">
            <h4>✅ WITH Zone.js</h4>
            <p class="description">Automatic change detection</p>
            
            <div class="counter-display">
              <div class="counter-value">{{ withZoneCounter() }}</div>
              <div class="counter-label">Counter Value</div>
            </div>

            <div class="controls">
              <button (click)="incrementWithZone()" class="demo-button success">
                Increment (Auto-Updates!)
              </button>
              <button (click)="asyncUpdateWithZone()" class="demo-button">
                Async Update (setTimeout)
              </button>
            </div>

            <div class="explanation">
              <p><strong>Magic:</strong> Zone.js automatically detects the click and triggers change detection!</p>
              <p><strong>Result:</strong> UI updates automatically without manual intervention</p>
            </div>
          </div>
        </div>

        <div class="zone-log">
          <h4>Event Log:</h4>
          <div class="log-content">
            @for (log of logs(); track $index) {
              <div class="log-entry" [class.manual]="log.includes('Manual')" [class.auto]="log.includes('Auto')">
                {{ log }}
              </div>
            }
          </div>
        </div>

        <div class="key-insight">
          <div class="insight-icon">💡</div>
          <div class="insight-content">
            <h4>Key Insight:</h4>
            <p>Zone.js monkey-patches browser APIs (setTimeout, addEventListener, Promise, etc.) to automatically trigger change detection. Without it, you'd need to manually call detectChanges() after every async operation!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
      border: 2px solid #3f51b5;
      box-shadow: 0 4px 20px rgba(63, 81, 181, 0.3);
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

    .demo-section.without-zone {
      border-color: #f44336;
    }

    .demo-section.with-zone {
      border-color: #4caf50;
    }

    .demo-section h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }

    .without-zone h4 {
      color: #f44336;
    }

    .with-zone h4 {
      color: #4caf50;
    }

    .description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      margin: 0 0 1rem 0;
    }

    .counter-display {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 1rem;
    }

    .counter-value {
      font-size: 3rem;
      font-weight: bold;
      color: #3f51b5;
      text-shadow: 0 0 10px rgba(63, 81, 181, 0.5);
    }

    .counter-label {
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
      background: linear-gradient(135deg, #3f51b5 0%, #303f9f 100%);
      color: white;
    }

    .demo-button.success {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    }

    .demo-button.manual {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(63, 81, 181, 0.4);
    }

    .explanation {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .explanation p {
      margin: 0.5rem 0;
      color: rgba(255, 255, 255, 0.9);
    }

    .explanation strong {
      color: #3f51b5;
    }

    .zone-log {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 8px;
    }

    .zone-log h4 {
      color: #3f51b5;
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
      background: rgba(255, 152, 0, 0.2);
      border-left: 3px solid #ff9800;
    }

    .log-entry.auto {
      background: rgba(76, 175, 80, 0.2);
      border-left: 3px solid #4caf50;
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
      margin: 0 0 0.5rem 0;
    }

    .insight-content p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.5;
    }

    h3 {
      color: #3f51b5;
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
    }
  `],
})
export class ZoneBeforeAfterDemoComponent {
  withoutZoneCounter = signal(0);
  withZoneCounter = signal(0);
  logs = signal<string[]>(['Demo initialized - Compare manual vs automatic change detection']);

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  // WITHOUT Zone.js - runs outside Angular zone
  incrementWithoutZone() {
    this.ngZone.runOutsideAngular(() => {
      const oldValue = this.withoutZoneCounter();
      this.withoutZoneCounter.set(oldValue + 1);
      
      this.addLog(`❌ WITHOUT Zone: Counter updated to ${this.withoutZoneCounter()} but UI NOT refreshed`);
      this.addLog(`❌ Change detection NOT triggered - need manual detectChanges()`);
      
      console.log('Without Zone: Counter incremented but UI not updated');
    });
  }

  // Manual change detection
  manualDetectChanges() {
    this.cdr.detectChanges();
    this.addLog(`🔄 Manual: Called detectChanges() - UI now shows ${this.withoutZoneCounter()}`);
    console.log('Manual detectChanges() called');
  }

  // WITH Zone.js - normal Angular behavior
  incrementWithZone() {
    const oldValue = this.withZoneCounter();
    this.withZoneCounter.set(oldValue + 1);
    
    this.addLog(`✅ Auto: Zone.js detected click event - Counter updated to ${this.withZoneCounter()}`);
    this.addLog(`✅ Auto: Change detection triggered automatically!`);
    
    console.log('With Zone: Counter incremented and UI auto-updated');
  }

  // Async operation with Zone.js
  asyncUpdateWithZone() {
    this.addLog(`⏳ Auto: setTimeout scheduled - Zone.js is watching...`);
    
    setTimeout(() => {
      const oldValue = this.withZoneCounter();
      this.withZoneCounter.set(oldValue + 5);
      
      this.addLog(`✅ Auto: setTimeout callback executed - Counter updated to ${this.withZoneCounter()}`);
      this.addLog(`✅ Auto: Zone.js detected async completion and triggered change detection!`);
      
      console.log('Async update completed with automatic change detection');
    }, 1000);
  }

  private addLog(message: string) {
    // Run inside zone to ensure logs update
    this.ngZone.run(() => {
      this.logs.update(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`]);
    });
  }
}

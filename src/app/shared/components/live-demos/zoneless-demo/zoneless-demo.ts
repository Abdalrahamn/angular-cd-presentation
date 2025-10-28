import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-zoneless-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Zoneless Angular Demo</h3>
      <div class="demo-content">
        <div class="performance-metrics">
          <h4>Performance Benefits</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Bundle Size</div>
              <div class="metric-before">Before: 245KB</div>
              <div class="metric-after">After: 200KB</div>
              <div class="metric-improvement">-45KB (18%)</div>
            </div>

            <div class="metric-card">
              <div class="metric-label">Startup Time</div>
              <div class="metric-before">Before: 850ms</div>
              <div class="metric-after">After: 720ms</div>
              <div class="metric-improvement">-130ms (15%)</div>
            </div>

            <div class="metric-card">
              <div class="metric-label">Memory Usage</div>
              <div class="metric-before">Before: 12.5MB</div>
              <div class="metric-after">After: 10.8MB</div>
              <div class="metric-improvement">-1.7MB (14%)</div>
            </div>
          </div>
        </div>

        <div class="demo-controls">
          <h4>Zoneless Counter (Signals)</h4>
          <div class="counter-display">
            <button (click)="decrement()" class="demo-button">-</button>
            <span class="counter-value">{{ count() }}</span>
            <button (click)="increment()" class="demo-button">+</button>
          </div>
          <p class="counter-status">Status: {{ status() }}</p>
        </div>

        <div class="demo-explanation">
          <h4>How Zoneless Works:</h4>
          <ol>
            <li>No Zone.js monkey patching</li>
            <li>Signals automatically notify Angular when they change</li>
            <li>markForCheck() triggers change detection directly</li>
            <li>Only components with RefreshView flag are updated</li>
            <li>Much more predictable and performant</li>
          </ol>
        </div>

        <div class="migration-info">
          <h4>Migration to Zoneless:</h4>
          <div class="code-snippet">
            <code>
              // Angular 20+ setup<br />
              import &#123; provideZonelessChangeDetection &#125; from '@angular/core';<br /><br />
              bootstrapApplication(AppComponent, &#123;<br />
              &nbsp;&nbsp;providers: [provideZonelessChangeDetection()]<br />
              &#125;);
            </code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
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

      .performance-metrics h4,
      .demo-controls h4,
      .demo-explanation h4,
      .migration-info h4 {
        color: #3f51b5;
        margin: 0 0 1rem 0;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .metric-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
      }

      .metric-label {
        color: #3f51b5;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }

      .metric-before {
        color: rgba(244, 67, 54, 0.8);
        font-size: 0.9rem;
      }

      .metric-after {
        color: rgba(76, 175, 80, 0.8);
        font-size: 0.9rem;
      }

      .metric-improvement {
        color: #4caf50;
        font-weight: bold;
        margin-top: 0.5rem;
        font-size: 1.1rem;
      }

      .counter-display {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        margin: 1rem 0;
      }

      .demo-button {
        background: linear-gradient(135deg, #3f51b5 0%, #303f9f 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.2rem;
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(63, 81, 181, 0.4);
      }

      .counter-value {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 2rem;
        font-weight: bold;
        color: #3f51b5;
        min-width: 80px;
        text-align: center;
      }

      .counter-status {
        text-align: center;
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        margin: 0;
      }

      .demo-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #3f51b5;
      }

      .demo-explanation ol {
        margin: 0;
        padding-left: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .demo-explanation li {
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }

      .migration-info {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 8px;
      }

      .code-snippet {
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 8px;
        margin-top: 0.5rem;
      }

      .code-snippet code {
        color: #4caf50;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      h3 {
        color: #3f51b5;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class ZonelessDemoComponent {
  count = signal(0);

  status = computed(() => {
    const value = this.count();
    if (value === 0) return 'Starting point';
    if (value > 0) return `Positive (${value > 10 ? 'High' : 'Low'})`;
    return `Negative (${value < -10 ? 'Very Low' : 'Low'})`;
  });

  increment() {
    this.count.update((c) => c + 1);
  }

  decrement() {
    this.count.update((c) => c - 1);
  }
}

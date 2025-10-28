import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-performance-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Performance Comparison Demo</h3>
      <div class="demo-content">
        <div class="performance-metrics">
          <h4>Real-time Performance Simulation</h4>

          <div class="metrics-comparison">
            <div class="metric-section">
              <h5>Default Strategy</h5>
              <div class="metric-bar">
                <div class="bar default" [style.width.%]="defaultPerformance()">
                  <span class="bar-label">{{ defaultPerformance() }}%</span>
                </div>
              </div>
              <div class="metric-details">
                <p>Components checked: {{ componentsChecked() }}</p>
                <p>Time: {{ defaultTime() }}ms</p>
              </div>
            </div>

            <div class="metric-section">
              <h5>OnPush Strategy</h5>
              <div class="metric-bar">
                <div class="bar onpush" [style.width.%]="onPushPerformance()">
                  <span class="bar-label">{{ onPushPerformance() }}%</span>
                </div>
              </div>
              <div class="metric-details">
                <p>Components checked: {{ onPushComponentsChecked() }}</p>
                <p>Time: {{ onPushTime() }}ms</p>
              </div>
            </div>

            <div class="metric-section">
              <h5>Signals Strategy</h5>
              <div class="metric-bar">
                <div class="bar signals" [style.width.%]="signalsPerformance()">
                  <span class="bar-label">{{ signalsPerformance() }}%</span>
                </div>
              </div>
              <div class="metric-details">
                <p>Components updated: {{ signalsComponentsUpdated() }}</p>
                <p>Time: {{ signalsTime() }}ms</p>
              </div>
            </div>
          </div>

          <div class="controls">
            <button (click)="simulateUpdate()" class="demo-button">Simulate Update</button>
            <button (click)="addComponents()" class="demo-button secondary">Add Components</button>
            <button (click)="reset()" class="demo-button danger">Reset</button>
          </div>

          <div class="component-count">
            <label>Total Components: </label>
            <span class="count-value">{{ totalComponents() }}</span>
          </div>
        </div>

        <div class="demo-explanation">
          <h4>Performance Comparison:</h4>
          <ul>
            <li><strong>Default:</strong> Checks all components on every change</li>
            <li><strong>OnPush:</strong> Skips unchanged components and subtrees</li>
            <li><strong>Signals:</strong> Only updates components with changed signals</li>
            <li>
              <strong>Result:</strong> Signals provide the best performance with fine-grained
              updates
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 2px solid #8b5cf6;
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
      }

      .demo-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .performance-metrics {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
      }

      .performance-metrics h4 {
        color: #8b5cf6;
        margin: 0 0 1.5rem 0;
        text-align: center;
      }

      .metrics-comparison {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .metric-section {
        background: rgba(0, 0, 0, 0.2);
        padding: 1rem;
        border-radius: 8px;
      }

      .metric-section h5 {
        color: #8b5cf6;
        margin: 0 0 0.75rem 0;
        font-size: 1.1rem;
      }

      .metric-bar {
        background: rgba(255, 255, 255, 0.1);
        height: 30px;
        border-radius: 15px;
        overflow: hidden;
        margin-bottom: 0.75rem;
        position: relative;
      }

      .bar {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: width 0.8s ease;
        border-radius: 15px;
        position: relative;
      }

      .bar.default {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }

      .bar.onpush {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }

      .bar.signals {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }

      .bar-label {
        color: white;
        font-weight: bold;
        font-size: 0.9rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .metric-details {
        display: flex;
        justify-content: space-between;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
      }

      .metric-details p {
        margin: 0;
      }

      .controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .demo-button {
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .demo-button:not(.secondary):not(.danger) {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
      }

      .demo-button.secondary {
        background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        color: white;
      }

      .demo-button.danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      }

      .component-count {
        text-align: center;
        font-size: 1.1rem;
      }

      .component-count label {
        color: rgba(255, 255, 255, 0.9);
        font-weight: bold;
      }

      .count-value {
        color: #8b5cf6;
        font-weight: bold;
        background: rgba(139, 92, 246, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        margin-left: 0.5rem;
      }

      .demo-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #8b5cf6;
      }

      .demo-explanation h4 {
        color: #8b5cf6;
        margin: 0 0 0.75rem 0;
      }

      .demo-explanation ul {
        margin: 0;
        padding-left: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .demo-explanation li {
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }

      h3 {
        color: #8b5cf6;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class PerformanceDemoComponent {
  totalComponents = signal(100);

  // Performance percentages (lower is better)
  defaultPerformance = computed(() => Math.min(100, this.totalComponents() * 0.8));
  onPushPerformance = computed(() => Math.min(100, this.totalComponents() * 0.3));
  signalsPerformance = computed(() => Math.min(100, this.totalComponents() * 0.1));

  // Components checked/updated
  componentsChecked = computed(() => this.totalComponents());
  onPushComponentsChecked = computed(() => Math.ceil(this.totalComponents() * 0.3));
  signalsComponentsUpdated = computed(() => Math.ceil(this.totalComponents() * 0.05));

  // Time calculations (simulated)
  defaultTime = computed(() => Math.ceil(this.totalComponents() * 0.15));
  onPushTime = computed(() => Math.ceil(this.totalComponents() * 0.05));
  signalsTime = computed(() => Math.ceil(this.totalComponents() * 0.01));

  simulateUpdate() {
    // Simulate a performance update by temporarily increasing the load
    const currentComponents = this.totalComponents();
    this.totalComponents.set(currentComponents + 10);

    setTimeout(() => {
      this.totalComponents.set(currentComponents);
    }, 2000);
  }

  addComponents() {
    this.totalComponents.update((count) => count + 50);
  }

  reset() {
    this.totalComponents.set(100);
  }
}

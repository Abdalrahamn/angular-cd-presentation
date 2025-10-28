import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Signals in Action</h3>
      <div class="demo-content">
        <div class="controls">
          <button (click)="increment()" class="demo-button">Increment</button>
          <button (click)="decrement()" class="demo-button">Decrement</button>
          <button (click)="reset()" class="demo-button secondary">Reset</button>
        </div>

        <div class="signals-display">
          <div class="signal-item">
            <label>Count Signal:</label>
            <span class="signal-value">{{ count() }}</span>
          </div>

          <div class="signal-item">
            <label>Doubled (Computed):</label>
            <span class="signal-value">{{ doubled() }}</span>
          </div>

          <div class="signal-item">
            <label>Status (Computed):</label>
            <span class="signal-value">{{ status() }}</span>
          </div>
        </div>

        <div class="demo-explanation">
          <p>
            ✅ <strong>Automatic Reactivity:</strong> When count() changes, doubled() and status()
            automatically update. Only the DOM nodes that depend on these signals are updated!
          </p>
          <p>🎯 <strong>Fine-grained Updates:</strong> No full component tree traversal needed.</p>
        </div>

        <div class="effect-log">
          <h4>Effect Log:</h4>
          <div class="log-content">{{ effectLog }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #2d5016 0%, #3d6b1c 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 2px solid #4caf50;
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
      }

      .demo-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .demo-button {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .demo-button.secondary {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
      }

      .signals-display {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .signal-item {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .signal-item label {
        color: rgba(255, 255, 255, 0.9);
        font-weight: bold;
      }

      .signal-value {
        color: #4caf50;
        font-size: 1.2rem;
        font-weight: bold;
        background: rgba(76, 175, 80, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
      }

      .demo-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #4caf50;
      }

      .demo-explanation p {
        margin: 0.5rem 0;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.5;
      }

      .effect-log {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 8px;
      }

      .effect-log h4 {
        color: #4caf50;
        margin: 0 0 0.5rem 0;
      }

      .log-content {
        color: #4caf50;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        white-space: pre-line;
      }

      h3 {
        color: #4caf50;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class SignalsDemoComponent {
  count = signal(0);
  effectLog = '';

  // Computed signals
  doubled = computed(() => this.count() * 2);
  status = computed(() => {
    const value = this.count();
    if (value === 0) return 'Zero';
    if (value > 0) return 'Positive';
    return 'Negative';
  });

  constructor() {
    // Effect for logging
    effect(() => {
      const currentCount = this.count();
      const timestamp = new Date().toLocaleTimeString();
      this.effectLog = `[${timestamp}] Count changed to: ${currentCount}`;
    });
  }

  increment() {
    this.count.update((c) => c + 1);
  }

  decrement() {
    this.count.update((c) => c - 1);
  }

  reset() {
    this.count.set(0);
  }
}

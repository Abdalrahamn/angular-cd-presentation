import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-asynchronous-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Asynchronous Change Detection Problem</h3>
      <div class="demo-content">
        <button (click)="changeNameAsync()" class="demo-button">Change name (setTimeout)</button>
        <p class="demo-output">Name: {{ name }}</p>
        <p class="demo-explanation">
          ❌ Without Zone.js, this wouldn't work! The setTimeout callback runs AFTER Angular has
          already run change detection. Zone.js monkey patches setTimeout to make this work
          automatically.
        </p>

        <div class="execution-timeline">
          <h4>Execution Timeline:</h4>
          <ol>
            <li>1. Button clicked → changeNameAsync() called</li>
            <li>2. setTimeout scheduled</li>
            <li>3. Angular runs change detection (name still 'John')</li>
            <li>4. 1 second later: setTimeout callback executes</li>
            <li>5. Zone.js detects completion → triggers change detection</li>
            <li>6. UI updates with new name!</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 2px solid #ff6b6b;
        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
      }

      .demo-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .demo-button {
        background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        max-width: 250px;
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      }

      .demo-output {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: bold;
        color: #ff6b6b;
      }

      .demo-explanation {
        color: rgba(255, 255, 255, 0.9);
        font-style: italic;
        line-height: 1.5;
      }

      .execution-timeline {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #ff6b6b;
      }

      .execution-timeline h4 {
        color: #ff6b6b;
        margin: 0 0 0.5rem 0;
      }

      .execution-timeline ol {
        margin: 0;
        padding-left: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .execution-timeline li {
        margin-bottom: 0.25rem;
      }

      h3 {
        color: #ff6b6b;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class AsynchronousDemoComponent {
  name = 'John';

  constructor(private cdr: ChangeDetectorRef) {}

  changeNameAsync() {
    setTimeout(() => {
      this.name = this.name === 'John' ? 'Jane' : 'John';
      // In a zoneless environment, we'd need: this.cdr.detectChanges();
    }, 1000);
  }
}

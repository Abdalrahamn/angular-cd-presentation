import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-synchronous-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: Synchronous Change Detection</h3>
      <div class="demo-content">
        <button (click)="changeName()" class="demo-button">Change name</button>
        <p class="demo-output">Name: {{ name }}</p>
        <p class="demo-explanation">
          ✅ This works fine! When you click the button, the changeName method is called, and
          because everything is wrapped by Angular, change detection runs automatically.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 2px solid #40e0d0;
        box-shadow: 0 4px 20px rgba(64, 224, 208, 0.3);
      }

      .demo-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .demo-button {
        background: linear-gradient(135deg, #40e0d0 0%, #48d1cc 100%);
        color: #1a1a2e;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        max-width: 200px;
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(64, 224, 208, 0.4);
      }

      .demo-output {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: bold;
        color: #40e0d0;
      }

      .demo-explanation {
        color: rgba(255, 255, 255, 0.9);
        font-style: italic;
        line-height: 1.5;
      }

      h3 {
        color: #40e0d0;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class SynchronousDemoComponent {
  name = 'John';

  changeName() {
    this.name = this.name === 'John' ? 'Jane' : 'John';
  }
}

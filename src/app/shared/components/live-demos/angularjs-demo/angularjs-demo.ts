import { Component, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-angularjs-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: AngularJS Digest Cycle Demo</h3>
      <div class="demo-content">
        <div class="angularjs-simulation">
          <h4>Simulated AngularJS Controller</h4>
          <div class="controller-display">
            <div class="scope-variable">
              <label>$scope.name:</label>
              <span class="variable-value">{{ name() }}</span>
            </div>
            <div class="watcher-count">
              <label>Watchers:</label>
              <span class="count-value">{{ watcherCount() }}</span>
            </div>
          </div>

          <div class="controls">
            <button (click)="updateName()" class="demo-button">
              Update Name ($scope.updateName)
            </button>
            <button (click)="addWatcher()" class="demo-button secondary">Add Watcher</button>
            <button (click)="removeWatcher()" class="demo-button danger">Remove Watcher</button>
          </div>

          <div class="digest-log">
            <h4>Digest Cycle Log:</h4>
            <div class="log-content" #logContainer>{{ digestLog() }}</div>
          </div>
        </div>

        <div class="demo-explanation">
          <h4>AngularJS Digest Cycle:</h4>
          <ol>
            <li>User interaction triggers $apply()</li>
            <li>Digest cycle starts ($rootScope.$digest())</li>
            <li>All watchers are checked (dirty checking)</li>
            <li>If changes found, DOM is updated</li>
            <li>Process repeats until no changes (max 10 times)</li>
            <li>Performance degrades with 2000+ watchers</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #8b4513 0%, #cd853f 100%);
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 2px solid #daa520;
        box-shadow: 0 4px 20px rgba(218, 165, 32, 0.3);
      }

      .demo-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .angularjs-simulation {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
      }

      .angularjs-simulation h4 {
        color: #daa520;
        margin: 0 0 1rem 0;
      }

      .controller-display {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .scope-variable,
      .watcher-count {
        background: rgba(0, 0, 0, 0.2);
        padding: 0.75rem;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .scope-variable label,
      .watcher-count label {
        color: rgba(255, 255, 255, 0.9);
        font-weight: bold;
      }

      .variable-value,
      .count-value {
        color: #daa520;
        font-weight: bold;
        background: rgba(218, 165, 32, 0.2);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
      }

      .controls {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .demo-button {
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .demo-button:not(.secondary):not(.danger) {
        background: linear-gradient(135deg, #daa520 0%, #b8860b 100%);
        color: #1a1a1a;
      }

      .demo-button.secondary {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
      }

      .demo-button.danger {
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        color: white;
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
      }

      .digest-log {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 8px;
      }

      .digest-log h4 {
        color: #daa520;
        margin: 0 0 0.5rem 0;
      }

      .log-content {
        color: #daa520;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        white-space: pre-line;
        max-height: 120px;
        overflow-y: auto;
      }

      .demo-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #daa520;
      }

      .demo-explanation h4 {
        color: #daa520;
        margin: 0 0 0.5rem 0;
      }

      .demo-explanation ol {
        margin: 0;
        padding-left: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .demo-explanation li {
        margin-bottom: 0.3rem;
        line-height: 1.4;
      }

      h3 {
        color: #daa520;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class AngularJSDemoComponent implements AfterViewInit {
  @ViewChild('logContainer') logContainer!: ElementRef<HTMLDivElement>;

  name = signal('John');
  watcherCount = signal(3);
  digestLog = signal('');

  ngAfterViewInit() {
    // Auto-scroll will be triggered after each log update
  }

  updateName() {
    const newName = this.name() === 'John' ? 'Jane' : 'John';
    this.name.set(newName);

    const timestamp = new Date().toLocaleTimeString();
    const log =
      `[${timestamp}] Digest cycle triggered\n` +
      `- Checking ${this.watcherCount()} watchers\n` +
      `- Name changed: ${newName}\n` +
      `- DOM updated\n\n`;

    this.digestLog.set(this.digestLog() + log);
    this.scrollToBottom();
  }

  addWatcher() {
    this.watcherCount.update((count) => count + 1);

    const timestamp = new Date().toLocaleTimeString();
    const log = `[${timestamp}] Watcher added\n` + `- Total watchers: ${this.watcherCount()}\n\n`;

    this.digestLog.set(this.digestLog() + log);
    this.scrollToBottom();
  }

  removeWatcher() {
    if (this.watcherCount() > 1) {
      this.watcherCount.update((count) => count - 1);

      const timestamp = new Date().toLocaleTimeString();
      const log =
        `[${timestamp}] Watcher removed\n` + `- Total watchers: ${this.watcherCount()}\n\n`;

      this.digestLog.set(this.digestLog() + log);
      this.scrollToBottom();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.logContainer) {
        this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}

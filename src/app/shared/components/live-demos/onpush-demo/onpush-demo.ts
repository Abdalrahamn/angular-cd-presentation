import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

@Component({
  selector: 'app-onpush-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-container">
      <h3>🔴 LIVE: OnPush Strategy Demo</h3>
      <div class="demo-content">
        <div class="user-display">
          <h4>User Information (OnPush Component)</h4>
          <div class="user-info">
            <p><strong>Name:</strong> {{ currentUser().name }}</p>
            <p><strong>Email:</strong> {{ currentUser().email }}</p>
            <p><strong>Status:</strong> {{ userStatus() }}</p>
            <p class="update-count">Updates: {{ updateCount() }}</p>
          </div>
        </div>

        <div class="controls">
          <button (click)="mutateUser()" class="demo-button danger">
            ❌ Mutate User (Won't Update UI)
          </button>
          <button (click)="updateUserImmutable()" class="demo-button success">
            ✅ Update User (Will Update UI)
          </button>
          <button (click)="toggleStatus()" class="demo-button">
            Toggle Status (Event Handler)
          </button>
        </div>

        <div class="demo-explanation">
          <h4>OnPush Rules:</h4>
          <ul>
            <li>✅ Only updates when input reference changes</li>
            <li>✅ Event handlers trigger change detection</li>
            <li>✅ Async pipe automatically triggers updates</li>
            <li>❌ Object mutations are ignored</li>
          </ul>
        </div>

        <div class="mutation-warning">
          <p>
            <strong>Try the red button:</strong> It mutates the existing object, so OnPush won't
            detect the change and UI stays the same. The green button creates a new object reference,
            which OnPush will detect and update the UI.
          </p>
        </div>

        <div class="console-log">
          <h4>Console Log:</h4>
          <div class="log-content">
            @for (log of logs(); track $index) {
              <div class="log-entry" [class.error]="log.includes('❌')" [class.success]="log.includes('✅')">
                {{ log }}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        background: linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%);
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

      .user-display {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
      }

      .user-display h4 {
        color: #9c27b0;
        margin: 0 0 1rem 0;
      }

      .user-info p {
        margin: 0.5rem 0;
        color: rgba(255, 255, 255, 0.9);
      }

      .controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .demo-button {
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .demo-button.danger {
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        color: white;
      }

      .demo-button.success {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        color: white;
      }

      .demo-button:not(.danger):not(.success) {
        background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
        color: white;
      }

      .demo-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);
      }

      .demo-explanation {
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #9c27b0;
      }

      .demo-explanation h4 {
        color: #9c27b0;
        margin: 0 0 0.5rem 0;
      }

      .demo-explanation ul {
        margin: 0;
        padding-left: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .demo-explanation li {
        margin-bottom: 0.25rem;
      }

      .mutation-warning {
        background: rgba(244, 67, 54, 0.1);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid rgba(244, 67, 54, 0.3);
      }

      .mutation-warning p {
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.5;
      }

      .console-log {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
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

      .log-entry.error {
        background: rgba(244, 67, 54, 0.2);
        border-left: 3px solid #f44336;
      }

      .log-entry.success {
        background: rgba(76, 175, 80, 0.2);
        border-left: 3px solid #4caf50;
      }

      .update-count {
        color: #9c27b0;
        font-weight: bold;
        font-size: 1.1rem;
      }

      h3 {
        color: #9c27b0;
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
      }
    `,
  ],
})
export class OnPushDemoComponent {
  // Internal state using signals
  private userState = signal<User>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    isActive: true,
  });

  currentUser = computed(() => this.userState());
  userStatus = computed(() => (this.currentUser().isActive ? '🟢 Active' : '🔴 Inactive'));
  updateCount = signal(0);
  logs = signal<string[]>(['Component initialized with OnPush strategy']);

  constructor(private cdr: ChangeDetectorRef) {}

  // ❌ This won't trigger OnPush change detection
  mutateUser() {
    const user = this.userState();
    const oldName = user.name;
    
    // This mutates the existing object - OnPush won't detect it
    user.name = user.name === 'John Doe' ? 'Jane Doe' : 'John Doe';
    
    this.addLog(`❌ MUTATION: Changed name from "${oldName}" to "${user.name}"`);
    this.addLog(`❌ Same object reference - OnPush IGNORES this change!`);
    this.addLog(`❌ UI will NOT update (notice the name stays the same)`);
    
    console.log("Mutated user (OnPush won't detect this):", user);
  }

  // ✅ This will trigger OnPush change detection
  updateUserImmutable() {
    const currentUser = this.currentUser();
    const oldName = currentUser.name;
    
    // Create new object reference - OnPush will detect this
    const updatedUser = {
      ...currentUser,
      name: currentUser.name === 'John Doe' ? 'Jane Doe' : 'John Doe',
    };

    // Update the signal with new reference
    this.userState.set(updatedUser);
    this.updateCount.update(c => c + 1);
    
    this.addLog(`✅ IMMUTABLE UPDATE: Changed name from "${oldName}" to "${updatedUser.name}"`);
    this.addLog(`✅ New object reference created - OnPush DETECTS this!`);
    this.addLog(`✅ UI updated successfully`);
    
    console.log('Updated user immutably:', updatedUser);
  }

  // ✅ Event handlers always trigger OnPush change detection
  toggleStatus() {
    const currentUser = this.currentUser();
    const oldStatus = currentUser.isActive;
    
    const updatedUser = {
      ...currentUser,
      isActive: !currentUser.isActive,
    };
    
    this.userState.set(updatedUser);
    this.updateCount.update(c => c + 1);
    
    this.addLog(`✅ EVENT HANDLER: Toggled status from ${oldStatus ? 'Active' : 'Inactive'} to ${updatedUser.isActive ? 'Active' : 'Inactive'}`);
    this.addLog(`✅ Event handlers ALWAYS trigger OnPush change detection`);
    
    console.log('Toggled user status:', updatedUser);
  }

  private addLog(message: string) {
    this.logs.update(logs => [...logs, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }
}

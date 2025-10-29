import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { ZonelessUserListComponent } from './zoneless-user-list.component';

@Component({
  selector: 'app-user-comparison-demo',
  standalone: true,
  imports: [CommonModule, UserListComponent, ZonelessUserListComponent],
  template: `
    <div class="demo-container">
      <h1>Change Detection Comparison Demo</h1>
      <div class="comparison-grid">
        <div class="demo-section">
          <app-user-list></app-user-list>
        </div>
        <div class="demo-section">
          <app-zoneless-user-list></app-zoneless-user-list>
        </div>
      </div>
      <div class="explanation">
        <h3>Key Differences:</h3>
        <div class="differences">
          <div class="difference-item">
            <strong>Default Strategy:</strong>
            <ul>
              <li>Requires manual change detection triggers</li>
              <li>Uses traditional properties</li>
              <li>May need markForCheck() for updates</li>
            </ul>
          </div>
          <div class="difference-item">
            <strong>Zoneless with Signals:</strong>
            <ul>
              <li>Automatic reactivity with signals</li>
              <li>No change detection strategy needed</li>
              <li>Updates happen automatically when signals change</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 30px;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }

      @media (max-width: 768px) {
        .comparison-grid {
          grid-template-columns: 1fr;
        }
      }

      .demo-section {
        min-height: 400px;
      }

      .explanation {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      }

      .explanation h3 {
        color: #495057;
        margin-bottom: 15px;
        text-align: center;
      }

      .differences {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      @media (max-width: 768px) {
        .differences {
          grid-template-columns: 1fr;
        }
      }

      .difference-item {
        background: white;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #e9ecef;
      }

      .difference-item strong {
        color: #495057;
        display: block;
        margin-bottom: 10px;
      }

      .difference-item ul {
        margin: 0;
        padding-left: 20px;
      }

      .difference-item li {
        margin-bottom: 5px;
        color: #6c757d;
      }
    `,
  ],
})
export class UserComparisonDemoComponent {}

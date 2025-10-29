import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-zoneless-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list-container zoneless">
      <h2>Users (Zoneless with Signals)</h2>
      <div class="loading" *ngIf="loading()">Loading users...</div>
      <ul class="user-list" *ngIf="!loading()">
        @for (user of users(); track user.id) {
          <li class="user-item">
            <div class="user-info">
              <strong>{{ user.name }}</strong>
              <span class="username">@{{ user.username }}</span>
              <div class="email">{{ user.email }}</div>
            </div>
          </li>
        }
      </ul>
      <div class="signal-info">
        <small>✨ Powered by Signals - Auto-reactive!</small>
      </div>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: #f8f9fa;
      margin: 10px 0;
    }
    
    .zoneless {
      border-color: #28a745;
      background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
    }
    
    h2 {
      color: #155724;
      margin-bottom: 15px;
      font-size: 1.2em;
    }
    
    .loading {
      text-align: center;
      color: #6c757d;
      font-style: italic;
    }
    
    .user-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .user-item {
      padding: 10px;
      border-bottom: 1px solid #d4edda;
      background: white;
      margin-bottom: 5px;
      border-radius: 4px;
      border-left: 3px solid #28a745;
    }
    
    .user-item:last-child {
      border-bottom: none;
    }
    
    .user-info strong {
      color: #495057;
      display: block;
    }
    
    .username {
      color: #6c757d;
      font-size: 0.9em;
      margin-left: 8px;
    }
    
    .email {
      color: #007bff;
      font-size: 0.85em;
      margin-top: 4px;
    }
    
    .signal-info {
      margin-top: 10px;
      text-align: center;
      color: #28a745;
      font-weight: 500;
    }
  `],
  // No changeDetection strategy needed in zoneless!
})
export class ZonelessUserListComponent implements OnInit {
  private http = inject(HttpClient);
  users = signal<User[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe((users) => {
        this.users.set(users); // Automatically triggers UI update!
        this.loading.set(false);
      });
  }
}

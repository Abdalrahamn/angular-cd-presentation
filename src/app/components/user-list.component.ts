import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list-container">
      <h2>Users (Zoneless + Async Pipe)</h2>

      @if (users$ | async; as userList) {
      <ul class="user-list">
        @for (user of userList; track user.id) {
        <li class="user-item">
          <div class="user-info">
            <strong>{{ user.name }}</strong>
            <span class="username">@{{ user.username }}</span>
            <div class="email">{{ user.email }}</div>
          </div>
        </li>
        }
      </ul>
      }
    </div>
  `,
  styles: [
    `
      .user-list-container {
        padding: 20px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        background: #f8f9fa;
        margin: 10px 0;
      }

      h2 {
        color: #2c3e50;
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
        border-bottom: 1px solid #dee2e6;
        background: white;
        margin-bottom: 5px;
        border-radius: 4px;
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
    `,
  ],
})
export class UserListComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  //users: User[] = [];
  users$!: Observable<User[]>;
  loading = true;

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
}

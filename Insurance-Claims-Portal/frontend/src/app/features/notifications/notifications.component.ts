import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../shared/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-titles">
          <h1>Notification Center</h1>
          <p>Real-time lifecycle alerts, underwriting decisions, and claims assessment messages.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary btn-sm" (click)="markAllAsRead()">
            <span class="material-icons">done_all</span> Mark All as Read
          </button>
        </div>
      </div>

      @if (isLoading) {
        <div class="spinner-container">
          <div class="spinner"></div>
          <p>Loading notification feed...</p>
        </div>
      } @else if (notifications.length === 0) {
        <div class="empty-state app-card">
          <span class="material-icons empty-icon">notifications_off</span>
          <h3>No notifications</h3>
          <p>You're all caught up! You will be notified whenever there are updates to your policies or claims.</p>
        </div>
      } @else {
        <div class="notifications-container app-card">
          @for (n of notifications; track n.id) {
            <div class="notif-row" [class.unread]="!n.isRead" (click)="openNotif(n)">
              <div class="notif-type-icon" [ngClass]="n.type.toLowerCase()">
                <span class="material-icons">
                  @if (n.type === 'SUCCESS') { check_circle }
                  @else if (n.type === 'WARNING') { warning }
                  @else if (n.type === 'ERROR') { cancel }
                  @else { info }
                </span>
              </div>
              <div class="notif-details">
                <div class="notif-title-row">
                  <h4>{{ n.title }}</h4>
                  <span class="notif-date">{{ n.createdAt | date:'medium' }}</span>
                </div>
                <p>{{ n.message }}</p>
              </div>
              @if (!n.isRead) {
                <span class="unread-dot"></span>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .notifications-container {
      padding: 0;
      overflow: hidden;
    }
    .notif-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: background 0.15s;
      position: relative;

      &:last-child { border-bottom: none; }
      &:hover { background: #f8fafc; }
      &.unread { background: #f0f9ff; }

      .notif-type-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        &.info { background: #e0f2fe; color: #0284c7; }
        &.success { background: #dcfce7; color: #16a34a; }
        &.warning { background: #fef3c7; color: #d97706; }
        &.error { background: #fee2e2; color: #dc2626; }
      }

      .notif-details {
        flex: 1;
        .notif-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;

          h4 {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--primary-navy);
          }
          .notif-date {
            font-size: 0.75rem;
            color: var(--text-light);
          }
        }
        p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      }

      .unread-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #1d4ed8;
      }
    }
  `],
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  notifications: Notification[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.fetchNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.notifications;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.fetchNotifications();
      },
    });
  }

  openNotif(n: Notification): void {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.id).subscribe();
    }
    if (n.link) {
      this.router.navigateByUrl(n.link);
    }
  }
}

import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  private router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();

  showUserMenu = false;
  showNotificationMenu = false;

  get currentUser() {
    return this.authService.currentUserSignal();
  }

  get unreadCount() {
    return this.notificationService.unreadCountSignal();
  }

  get notifications() {
    return this.notificationService.notificationsSignal().slice(0, 5);
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.notificationService.fetchNotifications().subscribe();
    }
  }

  toggleNotifications() {
    this.showNotificationMenu = !this.showNotificationMenu;
    this.showUserMenu = false;
  }

  toggleUser() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotificationMenu = false;
  }

  markAsRead(id: string, link?: string | null) {
    this.notificationService.markAsRead(id).subscribe(() => {
      if (link) {
        this.router.navigateByUrl(link);
        this.showNotificationMenu = false;
      }
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  logout() {
    this.authService.logout();
  }
}

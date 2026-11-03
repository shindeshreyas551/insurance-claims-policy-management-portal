import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification } from '../../shared/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:5000/api/notifications';

  unreadCountSignal = signal<number>(0);
  notificationsSignal = signal<Notification[]>([]);

  constructor(private http: HttpClient) {}

  fetchNotifications(): Observable<{ success: boolean; unreadCount: number; notifications: Notification[] }> {
    return this.http
      .get<{ success: boolean; unreadCount: number; notifications: Notification[] }>(this.apiUrl)
      .pipe(
        tap((res) => {
          this.unreadCountSignal.set(res.unreadCount);
          this.notificationsSignal.set(res.notifications);
        })
      );
  }

  markAsRead(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        this.notificationsSignal.update((list) =>
          list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        this.unreadCountSignal.update((count) => Math.max(0, count - 1));
      })
    );
  }

  markAllAsRead(): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        this.notificationsSignal.update((list) => list.map((n) => ({ ...n, isRead: true })));
        this.unreadCountSignal.set(0);
      })
    );
  }
}


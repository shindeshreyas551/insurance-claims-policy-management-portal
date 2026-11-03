import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(filter?: { role?: UserRole | ''; search?: string }): Observable<{
    success: boolean;
    count: number;
    users: User[];
  }> {
    let params = new HttpParams();
    if (filter?.role) params = params.set('role', filter.role);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<{ success: boolean; count: number; users: User[] }>(this.apiUrl, { params });
  }

  getOfficers(): Observable<{ success: boolean; officers: User[] }> {
    return this.http.get<{ success: boolean; officers: User[] }>(`${this.apiUrl}/officers`);
  }

  createUser(data: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'OFFICER';
    phone?: string;
    address?: string;
  }): Observable<{ success: boolean; message: string; user: User }> {
    return this.http.post<{ success: boolean; message: string; user: User }>(this.apiUrl, data);
  }

  toggleUserStatus(id: string): Observable<{ success: boolean; message: string; user: User }> {
    return this.http.patch<{ success: boolean; message: string; user: User }>(
      `${this.apiUrl}/${id}/toggle-status`,
      {}
    );
  }

  getAuditLogs(): Observable<{ success: boolean; count: number; logs: any[] }> {
    return this.http.get<{ success: boolean; count: number; logs: any[] }>(`${this.apiUrl}/audit-logs`);
  }
}


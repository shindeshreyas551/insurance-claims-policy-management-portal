import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminDashboardData,
  CustomerDashboardData,
  OfficerDashboardData,
} from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getCustomerDashboard(): Observable<{ success: boolean; data: CustomerDashboardData }> {
    return this.http.get<{ success: boolean; data: CustomerDashboardData }>(`${this.apiUrl}/customer`);
  }

  getOfficerDashboard(): Observable<{ success: boolean; data: OfficerDashboardData }> {
    return this.http.get<{ success: boolean; data: OfficerDashboardData }>(`${this.apiUrl}/officer`);
  }

  getAdminDashboard(): Observable<{ success: boolean; data: AdminDashboardData }> {
    return this.http.get<{ success: boolean; data: AdminDashboardData }>(`${this.apiUrl}/admin`);
  }
}


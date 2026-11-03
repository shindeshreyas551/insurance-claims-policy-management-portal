import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy, PolicyCategory } from '../../shared/models/policy.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private readonly apiUrl = 'http://localhost:5000/api/policies';

  constructor(private http: HttpClient) {}

  getPolicies(filter?: { category?: PolicyCategory | ''; search?: string; activeOnly?: boolean }): Observable<{ success: boolean; count: number; policies: Policy[] }> {
    let params = new HttpParams();
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.search) params = params.set('search', filter.search);
    if (filter?.activeOnly !== undefined) params = params.set('activeOnly', String(filter.activeOnly));

    return this.http.get<{ success: boolean; count: number; policies: Policy[] }>(this.apiUrl, { params });
  }

  getPolicyById(id: string): Observable<{ success: boolean; policy: Policy }> {
    return this.http.get<{ success: boolean; policy: Policy }>(`${this.apiUrl}/${id}`);
  }

  createPolicy(data: Partial<Policy>): Observable<{ success: boolean; message: string; policy: Policy }> {
    return this.http.post<{ success: boolean; message: string; policy: Policy }>(this.apiUrl, data);
  }

  updatePolicy(id: string, data: Partial<Policy>): Observable<{ success: boolean; message: string; policy: Policy }> {
    return this.http.put<{ success: boolean; message: string; policy: Policy }>(`${this.apiUrl}/${id}`, data);
  }

  togglePolicyStatus(id: string): Observable<{ success: boolean; message: string; policy: Policy }> {
    return this.http.patch<{ success: boolean; message: string; policy: Policy }>(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}


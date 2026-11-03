import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../../shared/models/claim.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = 'http://localhost:5000/api/reports';

  constructor(private http: HttpClient) {}

  getClaimsReport(filter?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    status?: string;
    officerId?: string;
    search?: string;
  }): Observable<{
    success: boolean;
    summary: {
      totalRecords: number;
      totalClaimedAmount: number;
      totalApprovedAmount: number;
      totalSettledAmount: number;
    };
    claims: Claim[];
  }> {
    let params = new HttpParams();
    if (filter?.startDate) params = params.set('startDate', filter.startDate);
    if (filter?.endDate) params = params.set('endDate', filter.endDate);
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.officerId) params = params.set('officerId', filter.officerId);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<any>(`${this.apiUrl}/claims`, { params });
  }

  downloadCSV(filter?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    status?: string;
    officerId?: string;
    search?: string;
  }): Observable<Blob> {
    let params = new HttpParams();
    if (filter?.startDate) params = params.set('startDate', filter.startDate);
    if (filter?.endDate) params = params.set('endDate', filter.endDate);
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.officerId) params = params.set('officerId', filter.officerId);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get(`${this.apiUrl}/claims/export-csv`, {
      params,
      responseType: 'blob',
    });
  }
}


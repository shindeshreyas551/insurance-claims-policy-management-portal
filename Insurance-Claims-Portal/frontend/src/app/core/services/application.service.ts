import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationStatus, CustomerPolicy, PolicyApplication } from '../../shared/models/policy.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly apiUrl = 'http://localhost:5000/api/applications';

  constructor(private http: HttpClient) {}

  submitApplication(data: {
    policyId: string;
    nomineeName: string;
    nomineeRelation: string;
    annualIncome?: number;
    existingConditions?: string;
    remarks?: string;
  }): Observable<{ success: boolean; message: string; application: PolicyApplication }> {
    return this.http.post<{ success: boolean; message: string; application: PolicyApplication }>(
      `${this.apiUrl}/apply`,
      data
    );
  }

  getMyApplications(): Observable<{ success: boolean; count: number; applications: PolicyApplication[] }> {
    return this.http.get<{ success: boolean; count: number; applications: PolicyApplication[] }>(
      `${this.apiUrl}/my-applications`
    );
  }

  getAllApplications(filter?: { status?: ApplicationStatus | ''; search?: string }): Observable<{
    success: boolean;
    count: number;
    applications: PolicyApplication[];
  }> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<{ success: boolean; count: number; applications: PolicyApplication[] }>(
      `${this.apiUrl}/all`,
      { params }
    );
  }

  reviewApplication(
    id: string,
    data: { status: 'APPROVED' | 'REJECTED'; remarks?: string }
  ): Observable<{
    success: boolean;
    message: string;
    application: PolicyApplication;
    customerPolicy?: CustomerPolicy;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      application: PolicyApplication;
      customerPolicy?: CustomerPolicy;
    }>(`${this.apiUrl}/${id}/review`, data);
  }
}


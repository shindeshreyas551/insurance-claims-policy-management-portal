import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerPolicy } from '../../shared/models/policy.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerPolicyService {
  private readonly apiUrl = 'http://localhost:5000/api/customer-policies';

  constructor(private http: HttpClient) {}

  getMyPolicies(): Observable<{ success: boolean; count: number; policies: CustomerPolicy[] }> {
    return this.http.get<{ success: boolean; count: number; policies: CustomerPolicy[] }>(
      `${this.apiUrl}/my-policies`
    );
  }

  getCustomerPolicyById(id: string): Observable<{ success: boolean; customerPolicy: CustomerPolicy }> {
    return this.http.get<{ success: boolean; customerPolicy: CustomerPolicy }>(`${this.apiUrl}/${id}`);
  }
}


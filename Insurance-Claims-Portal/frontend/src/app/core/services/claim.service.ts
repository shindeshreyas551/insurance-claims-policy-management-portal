import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim, ClaimStatus } from '../../shared/models/claim.model';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  private readonly apiUrl = 'http://localhost:5000/api/claims';
  private readonly docApiUrl = 'http://localhost:5000/api/documents';

  constructor(private http: HttpClient) {}

  submitClaim(formData: FormData): Observable<{ success: boolean; message: string; claim: Claim }> {
    return this.http.post<{ success: boolean; message: string; claim: Claim }>(
      `${this.apiUrl}/submit`,
      formData
    );
  }

  getClaims(filter?: {
    status?: ClaimStatus | '';
    category?: string;
    search?: string;
    assignedOnly?: boolean;
  }): Observable<{ success: boolean; count: number; claims: Claim[] }> {
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.search) params = params.set('search', filter.search);
    if (filter?.assignedOnly !== undefined) params = params.set('assignedOnly', String(filter.assignedOnly));

    return this.http.get<{ success: boolean; count: number; claims: Claim[] }>(this.apiUrl, { params });
  }

  getClaimById(id: string): Observable<{ success: boolean; claim: Claim }> {
    return this.http.get<{ success: boolean; claim: Claim }>(`${this.apiUrl}/${id}`);
  }

  updateClaimStatus(
    id: string,
    data: {
      status: ClaimStatus;
      remarks: string;
      approvedAmount?: number;
      rejectionReason?: string;
    }
  ): Observable<{ success: boolean; message: string; claim: Claim }> {
    return this.http.patch<{ success: boolean; message: string; claim: Claim }>(
      `${this.apiUrl}/${id}/status`,
      data
    );
  }

  assignOfficer(id: string, officerId: string): Observable<{ success: boolean; message: string; claim: Claim }> {
    return this.http.patch<{ success: boolean; message: string; claim: Claim }>(
      `${this.apiUrl}/${id}/assign`,
      { officerId }
    );
  }

  uploadAdditionalDocuments(
    claimId: string,
    formData: FormData
  ): Observable<{ success: boolean; message: string; documents: any[] }> {
    return this.http.post<{ success: boolean; message: string; documents: any[] }>(
      `${this.apiUrl}/${claimId}/upload-documents`,
      formData
    );
  }

  getDocumentViewUrl(documentId: string): string {
    return `${this.docApiUrl}/${documentId}/view`;
  }

  getDocumentDownloadUrl(documentId: string): string {
    return `${this.docApiUrl}/${documentId}/download`;
  }
}


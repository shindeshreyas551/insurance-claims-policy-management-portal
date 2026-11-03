import { TestBed } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ClaimService } from './claim.service';

describe('ClaimService', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClaimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch claims registry', () => {
    service.getClaims().subscribe((res) => {
      expect(res.claims.length).toBe(1);
      expect(res.claims[0].claimNumber).toBe('CLM-2026-001');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/api/claims'));
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      count: 1,
      claims: [
        {
          id: 'c-1',
          claimNumber: 'CLM-2026-001',
          claimAmount: 45000,
          status: 'SUBMITTED',
          incidentDate: new Date().toISOString(),
          claimCategory: 'HEALTH',
        },
      ],
    });
  });

  it('should generate valid document download and view URLs', () => {
    const viewUrl = service.getDocumentViewUrl('doc-123');
    const dlUrl = service.getDocumentDownloadUrl('doc-123');
    expect(viewUrl).toContain('/api/documents/doc-123/view');
    expect(dlUrl).toContain('/api/documents/doc-123/download');
  });
});


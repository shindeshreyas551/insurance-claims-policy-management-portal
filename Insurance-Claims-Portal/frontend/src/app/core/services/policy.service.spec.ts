import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PolicyService } from './policy.service';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolicyService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch public policies list', () => {
    service.getPolicies({ activeOnly: true }).subscribe((res) => {
      expect(res.policies.length).toBe(1);
      expect(res.policies[0].name).toBe('CareShield Plan');
    });

    const req = httpMock.expectOne((r) => r.url.includes('/api/policies'));
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      count: 1,
      policies: [
        {
          id: 'p-1',
          policyNumber: 'POL-HLT-001',
          name: 'CareShield Plan',
          category: 'HEALTH',
          premiumAmount: 12500,
          coverageAmount: 500000,
          durationMonths: 12,
          isActive: true,
        },
      ],
    });
  });
});


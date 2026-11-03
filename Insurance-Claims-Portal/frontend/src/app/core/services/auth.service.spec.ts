import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should initialize with no authenticated user', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUserSignal()).toBeNull();
  });

  it('should authenticate user and store token on successful login', () => {
    const mockUser = {
      id: 'usr-1',
      name: 'Shreyas Shinde',
      email: 'customer.shreyas@insurance.portal',
      role: 'CUSTOMER' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    service.login({ email: 'customer.shreyas@insurance.portal', password: 'Password@123' }).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.currentUserRole()).toBe('CUSTOMER');
    });

    const req = httpMock.expectOne('http://localhost:5000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-12345',
      user: mockUser,
    });
  });

  it('should clear signals and local storage on logout', () => {
    localStorage.setItem('ins_portal_token', 'test-token');
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUserSignal()).toBeNull();
    expect(localStorage.getItem('ins_portal_token')).toBeNull();
  });
});


import request from 'supertest';
import app from '../app';
import prisma from '../prisma';

describe('Insurance Portal Backend API Tests', () => {
  let adminToken: string;
  let customerToken: string;
  let officerToken: string;
  let createdPolicyId: string;
  let testCustomerPolicyId: string;

  beforeAll(async () => {
    // 1. Login as Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@insurance.portal', password: 'AdminPassword@123' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.token;

    // 2. Login as Officer
    const officerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'officer.rajesh@insurance.portal', password: 'Officer@123' });
    expect(officerRes.status).toBe(200);
    officerToken = officerRes.body.token;

    // 3. Login as Customer
    const customerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer.shreyas@insurance.portal', password: 'Customer@123' });
    expect(customerRes.status).toBe(200);
    customerToken = customerRes.body.token;

    // Get an active customer policy for claims testing
    const custPolRes = await request(app)
      .get('/api/customer-policies/my-policies')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(custPolRes.status).toBe(200);
    expect(custPolRes.body.policies.length).toBeGreaterThan(0);
    testCustomerPolicyId = custPolRes.body.policies[0].id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Health Check API', () => {
    it('should return server status online', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('online');
    });
  });

  describe('Authentication Module', () => {
    it('should register a new customer successfully', async () => {
      const uniqueEmail = `test.user.${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Academic Test Customer',
          email: uniqueEmail,
          password: 'Password@123',
          phone: '9876500000',
          address: 'College Campus, Computer Science Dept',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('CUSTOMER');
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@insurance.portal', password: 'WrongPassword' });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fetch the profile of authenticated customer', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('customer.shreyas@insurance.portal');
      expect(res.body.user.role).toBe('CUSTOMER');
    });

    it('should reject access to protected endpoint without token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('Insurance Policy Management Module', () => {
    it('should list all public active policies', async () => {
      const res = await request(app).get('/api/policies');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.policies)).toBe(true);
      expect(res.body.policies.length).toBeGreaterThan(0);
    });

    it('should allow Admin to create a new policy', async () => {
      const res = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Academic Test Health Shield',
          category: 'HEALTH',
          description: 'A comprehensive medical test plan for academic validation suite.',
          premiumAmount: 15000,
          coverageAmount: 600000,
          durationMonths: 12,
          eligibility: 'Standard eligibility criteria apply.',
          termsAndConditions: 'Standard 30-day waiting period. Cashless settlement.',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.policy.name).toBe('Academic Test Health Shield');
      createdPolicyId = res.body.policy.id;
    });

    it('should block non-admin users from creating policies', async () => {
      const res = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Unauthorized Policy',
          category: 'HEALTH',
          description: 'This must fail with 403 Forbidden.',
          premiumAmount: 5000,
          coverageAmount: 100000,
          durationMonths: 12,
          eligibility: 'None',
          termsAndConditions: 'None',
        });
      expect(res.status).toBe(403);
    });

    it('should fetch single policy details by ID', async () => {
      const res = await request(app).get(`/api/policies/${createdPolicyId}`);
      expect(res.status).toBe(200);
      expect(res.body.policy.id).toBe(createdPolicyId);
    });
  });

  describe('Claim Management & Workflow Rules', () => {
    let createdClaimId: string;

    it('should allow customer to submit a valid claim against active policy', async () => {
      const res = await request(app)
        .post('/api/claims/submit')
        .set('Authorization', `Bearer ${customerToken}`)
        .field('customerPolicyId', testCustomerPolicyId)
        .field('incidentDate', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .field('claimAmount', '25000')
        .field('description', 'Consultation, laboratory diagnostics, and prescribed emergency medication at city hospital.');
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.claim.claimNumber).toBeDefined();
      expect(res.body.claim.status).toBe('SUBMITTED');
      createdClaimId = res.body.claim.id;
    });

    it('should reject claim with invalid negative amount', async () => {
      const res = await request(app)
        .post('/api/claims/submit')
        .set('Authorization', `Bearer ${customerToken}`)
        .field('customerPolicyId', testCustomerPolicyId)
        .field('incidentDate', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .field('claimAmount', '-5000')
        .field('description', 'Invalid claim with negative amount for validation check.');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject claim with amount exceeding policy coverage limit', async () => {
      const res = await request(app)
        .post('/api/claims/submit')
        .set('Authorization', `Bearer ${customerToken}`)
        .field('customerPolicyId', testCustomerPolicyId)
        .field('incidentDate', new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .field('claimAmount', '999999999')
        .field('description', 'Claim amount exceeding coverage limit should be immediately rejected.');
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('cannot exceed the policy coverage limit');
    });

    it('should allow officer to transition claim status to UNDER_REVIEW', async () => {
      const res = await request(app)
        .patch(`/api/claims/${createdClaimId}/status`)
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          status: 'UNDER_REVIEW',
          remarks: 'Officer verified medical documents and initiated assessment.',
        });
      expect(res.status).toBe(200);
      expect(res.body.claim.status).toBe('UNDER_REVIEW');
    });

    it('should enforce rejection reason when rejecting a claim', async () => {
      const res = await request(app)
        .patch(`/api/claims/${createdClaimId}/status`)
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          status: 'REJECTED',
          remarks: 'Rejected without reason should fail',
          rejectionReason: '', // Empty reason
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('rejection reason is mandatory');
    });

    it('should allow admin to approve claim with approved amount', async () => {
      const res = await request(app)
        .patch(`/api/claims/${createdClaimId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'APPROVED',
          approvedAmount: 22000,
          remarks: 'Claim approved after deductible adjustment of ₹3,000.',
        });
      expect(res.status).toBe(200);
      expect(res.body.claim.status).toBe('APPROVED');
      expect(res.body.claim.approvedAmount).toBe(22000);
    });

    it('should allow admin to mark approved claim as SETTLED', async () => {
      const res = await request(app)
        .patch(`/api/claims/${createdClaimId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'SETTLED',
          remarks: 'Bank transfer dispatched. UTR Number: UTR9988112233.',
        });
      expect(res.status).toBe(200);
      expect(res.body.claim.status).toBe('SETTLED');
      expect(res.body.claim.settledAt).toBeDefined();
    });
  });

  describe('Role-Based Dashboards & Real Analytics', () => {
    it('should return Customer dashboard with calculated database statistics', async () => {
      const res = await request(app)
        .get('/api/dashboard/customer')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.stats.activePolicies).toBeGreaterThanOrEqual(1);
      expect(res.body.data.stats.totalClaims).toBeGreaterThanOrEqual(1);
    });

    it('should return Officer dashboard with review queues', async () => {
      const res = await request(app)
        .get('/api/dashboard/officer')
        .set('Authorization', `Bearer ${officerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.stats).toBeDefined();
      expect(Array.isArray(res.body.data.recentlyProcessed)).toBe(true);
    });

    it('should return Admin dashboard with real aggregation and Chart.js datasets', async () => {
      const res = await request(app)
        .get('/api/dashboard/admin')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.stats.totalCustomers).toBeGreaterThanOrEqual(1);
      expect(res.body.data.stats.totalPolicies).toBeGreaterThanOrEqual(1);
      expect(res.body.data.charts.monthly.labels.length).toBe(6);
      expect(res.body.data.charts.statusDistribution).toBeDefined();
    });
  });

  describe('Reports & CSV Export', () => {
    it('should return filtered claim report records', async () => {
      const res = await request(app)
        .get('/api/reports/claims')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.summary).toBeDefined();
      expect(Array.isArray(res.body.claims)).toBe(true);
    });

    it('should export valid CSV with proper headers and data rows', async () => {
      const res = await request(app)
        .get('/api/reports/claims/export-csv')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('text/csv');
      expect(res.text).toContain('Claim Number');
      expect(res.text).toContain('Customer Name');
    });
  });
});


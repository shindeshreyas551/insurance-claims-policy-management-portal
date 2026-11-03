# Test Case Documentation & Quality Assurance Report

## 1. Test Strategy & Scope
Quality Assurance was performed systematically across the technology stack:
- **Backend API Integration Testing:** Jest (v29) & Supertest (v7) testing HTTP endpoints, role guards, Prisma queries, and SQLite persistence.
- **Frontend Unit Testing:** Jasmine and Angular Test Bed testing components, dependency injection, and signal changes.
- **Production Build Verification:** `tsc` strict TypeScript compilation and `ng build` production bundling.

---

## 2. Automated Test Matrix & Execution Results

| Test ID | Test Category | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-AUTH-01** | Authentication | Register new customer account | HTTP 201, JWT returned, user stored | HTTP 201 Created | **PASSED** |
| **TC-AUTH-02** | Authentication | Attempt login with incorrect password | HTTP 401, error message returned | HTTP 401 Unauthorized | **PASSED** |
| **TC-AUTH-03** | Authentication | Fetch authenticated user profile | HTTP 200, user details returned | HTTP 200 OK | **PASSED** |
| **TC-AUTH-04** | Authentication | Access protected profile without token | HTTP 401, token required | HTTP 401 Unauthorized | **PASSED** |
| **TC-POL-01** | Policy Mgmt | List public active insurance policies | HTTP 200, array of policies | HTTP 200 OK | **PASSED** |
| **TC-POL-02** | Policy Mgmt | Admin creates new policy | HTTP 201, auto-generated policy number | HTTP 201 Created | **PASSED** |
| **TC-POL-03** | Policy Mgmt | Customer attempts to create policy | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASSED** |
| **TC-POL-04** | Policy Mgmt | Fetch single policy details by ID | HTTP 200, full policy record | HTTP 200 OK | **PASSED** |
| **TC-CLM-01** | Claims Mgmt | Customer submits valid claim against active policy | HTTP 201, claim number `CLM-2026-XXXX` | HTTP 201 Created | **PASSED** |
| **TC-CLM-02** | Claims Mgmt | Customer submits claim with negative amount | HTTP 400 Bad Request | HTTP 400 Bad Request | **PASSED** |
| **TC-CLM-03** | Claims Mgmt | Customer submits claim exceeding coverage limit | HTTP 400, coverage limit error | HTTP 400 Bad Request | **PASSED** |
| **TC-CLM-04** | Workflow | Officer moves claim to `UNDER_REVIEW` | HTTP 200, status updated | HTTP 200 OK | **PASSED** |
| **TC-CLM-05** | Workflow | Reject claim without providing rejection reason | HTTP 400, rejection reason mandatory | HTTP 400 Bad Request | **PASSED** |
| **TC-CLM-06** | Workflow | Admin approves claim with validated approved amount | HTTP 200, status `APPROVED` | HTTP 200 OK | **PASSED** |
| **TC-CLM-07** | Workflow | Admin finalizes approved claim to `SETTLED` | HTTP 200, `settledAt` timestamp populated | HTTP 200 OK | **PASSED** |
| **TC-DASH-01** | Dashboards | Customer dashboard returns computed database stats | HTTP 200, active policies and claims | HTTP 200 OK | **PASSED** |
| **TC-DASH-02** | Dashboards | Officer dashboard returns review queues | HTTP 200, assigned and unassigned queues | HTTP 200 OK | **PASSED** |
| **TC-DASH-03** | Dashboards | Admin dashboard returns real stats and 4 Chart.js datasets | HTTP 200, monthly trend and status breakdown | HTTP 200 OK | **PASSED** |
| **TC-REP-01** | Reports | Filter claims by date/category/status | HTTP 200, summary sums and claims array | HTTP 200 OK | **PASSED** |
| **TC-REP-02** | Reports | Export claims as CSV file attachment | HTTP 200, `text/csv` header, valid CSV content | HTTP 200 OK | **PASSED** |
| **TC-SYS-01** | Health | Server health check endpoint | HTTP 200, `status: 'online'` | HTTP 200 OK | **PASSED** |

---

## 3. Automated Test Execution Evidence
```text
PASS src/tests/api.spec.ts
  Insurance Portal Backend API Tests
    Health Check API
      √ should return server status online (17 ms)
    Authentication Module
      √ should register a new customer successfully (92 ms)
      √ should reject login with incorrect password (74 ms)
      √ should fetch the profile of authenticated customer (9 ms)
      √ should reject access to protected endpoint without token (14 ms)
    Insurance Policy Management Module
      √ should list all public active policies (11 ms)
      √ should allow Admin to create a new policy (20 ms)
      √ should block non-admin users from creating policies (9 ms)
      √ should fetch single policy details by ID (9 ms)
    Claim Management & Workflow Rules
      √ should allow customer to submit a valid claim against active policy (94 ms)
      √ should reject claim with invalid negative amount (9 ms)
      √ should reject claim with amount exceeding policy coverage limit (15 ms)
      √ should allow officer to transition claim status to UNDER_REVIEW (47 ms)
      √ should enforce rejection reason when rejecting a claim (11 ms)
      √ should allow admin to approve claim with approved amount (36 ms)
      √ should allow admin to mark approved claim as SETTLED (36 ms)
    Role-Based Dashboards & Real Analytics
      √ should return Customer dashboard with calculated database statistics (25 ms)
      √ should return Officer dashboard with review queues (12 ms)
      √ should return Admin dashboard with real aggregation and Chart.js datasets (15 ms)
    Reports & CSV Export
      √ should return filtered claim report records (17 ms)
      √ should export valid CSV with proper headers and data rows (20 ms)

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        4.206 s
```


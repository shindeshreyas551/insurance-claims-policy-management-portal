# Insurance Claims & Policy Management Portal

> **Academic Project Submission:** Group 20 — Individual Academic Project (Final Assessment)  
> **Candidate Name:** Shreyas Shinde  
> **Degree Program:** Bachelor of Technology in Computer Science & Engineering  
> **Academic Session:** 2026–2027  
> **Industry Collaboration:** HCL Academic Collaboration Initiative  
> **Development Platform:** Google Antigravity AI  

---

## 1. Executive Summary

The **Insurance Claims & Policy Management Portal** is a production-quality, enterprise-grade web application engineered to modernize and digitize the complete insurance coverage and loss claims adjudication lifecycle.

The system replaces manual, error-prone paper workflows with an automated, auditable, and transparent 3-tier architecture. It enforces role-based access control (RBAC) across three discrete user personas:
1. **Administrator (Executive Underwriter & System Admin)**
2. **Insurance Officer (Claims Adjuster & Investigator)**
3. **Customer (Insured Policyholder)**

Built upon an **Angular 19 Single Page Application (SPA)** frontend utilizing modern standalone component schematics, Angular Material, and Chart.js, the system interfaces with a high-throughput **Node.js / Express TypeScript REST API**. Data persistence is managed via **Prisma ORM v6** with **SQLite 3**, providing 100% ACID compliance and referential integrity across 9 fully normalized relational entities.

---

## 2. Technology Stack

### Frontend
- **Framework:** Angular 19.2 (Standalone Component Architecture, RxJS 7.8)
- **UI Components & Icons:** Angular Material 19.2, Google Material Icons Outlined
- **Styling:** Custom SCSS Enterprise Design System (Authoritative Navy Blue `#0f2b48` Theme)
- **State & Reactivity:** Angular Signals & RxJS Observables
- **Forms & Validation:** Angular Reactive Forms with asynchronous and custom validators
- **Data Visualization:** Chart.js 4.4 with responsive HTML5 canvas bindings
- **HTTP Interceptors:** JWT Bearer Token Injection & Centralized HTTP Error Handling
- **Route Protection:** Functional `authGuard` and `roleGuard`

### Backend
- **Runtime & Framework:** Node.js v26.13.0 with Express.js 4.21
- **Language:** TypeScript 5.7 (Strict Type Checking)
- **Authentication:** Stateless JSON Web Tokens (`jsonwebtoken` v9.0)
- **Password Security:** Salted one-way adaptive password hashing (`bcryptjs` v3.0)
- **Input Validation:** TypeScript-first schema validation (`zod` v3.24)
- **Evidence File Uploads:** Multipart ingestion via `multer` v1.4.5 with MIME-type filtering
- **Security:** Rate limiting (`express-rate-limit`), CORS protection, error middleware

### Database & Persistence
- **Database Engine:** SQLite 3 (Zero-configuration, serverless, transactional SQL engine)
- **Object-Relational Mapping (ORM):** Prisma ORM v6.19
- **Schema Normalization:** Third Normal Form (3NF) across 9 relational models
- **Database File:** Pre-seeded local relational database (`backend/prisma/dev.db`)

### Testing & Verification
- **Backend API Integration Testing:** Jest 29.7 & Supertest 7.0 (21 of 21 tests passed, 100%)
- **Frontend Unit Testing:** Jasmine & Angular Test Bed
- **Production Bundling:** `tsc` clean compilation & `ng build` (792 kB optimized bundle)

---

## 3. Demo Credentials & Pre-Seeded Accounts

The database is pre-seeded with realistic policies, active customer coverage, and claims across all 6 lifecycle stages:

| Role | Name | Email Address | Default Password | Permissions & Dashboard |
|---|---|---|---|---|
| **Administrator** | System Administrator | `admin@insurance.portal` | `AdminPassword@123` | Full access, policy CRUD, underwriting, settlements, Chart.js metrics, user management, CSV export |
| **Insurance Officer** | Officer Rajesh Kumar | `officer.rajesh@insurance.portal` | `Officer@123` | Claims review queue, document inspection, request evidence, audit notes, recommend approval/rejection |
| **Insurance Officer** | Officer Priya Sharma | `officer.priya@insurance.portal` | `Officer@123` | Secondary claims review workbench and verification |
| **Customer** | Shreyas Shinde | `customer.shreyas@insurance.portal` | `Customer@123` | 2 Active Policies (Health & Vehicle), 2 Claims filed, full timeline tracking |
| **Customer** | Anita Desai | `customer.anita@insurance.portal` | `Customer@123` | 1 Active Policy (Life Insurance), 1 Claim under review |
| **Customer** | Vikram Malhotra | `customer.vikram@insurance.portal` | `Customer@123` | 1 Active Policy (Home Insurance), claim settled |

> *Quick-Fill Convenience:* The Login page features one-click demo account selector buttons to easily test any role without manual typing.

---

## 4. 20 Working Application Pages & Feature Matrix

The application delivers 20 fully functional, production-ready routes:

1. **Landing Page (`/`):** Enterprise hero section, feature breakdown, live stats ribbon, testimonials, and category directory.
2. **Login Page (`/login`):** JWT credential verification, quick demo login buttons, remember-me options.
3. **Registration Page (`/register`):** Customer onboarding with instant client & server validation and bcrypt hashing.
4. **Customer Dashboard (`/dashboard/customer`):** Policy counters, claim status breakdown, quick actions, recent claims table.
5. **Officer Dashboard (`/dashboard/officer`):** Assigned workbench, pending queues, evidence audit shortcuts.
6. **Administrator Dashboard (`/dashboard/admin`):** System KPIs, 4 interactive Chart.js charts, recent audit logs.
7. **Policy Catalog (`/policies`):** Categorized browsing across Health, Life, Vehicle, Home, Travel with search & filters.
8. **Policy Details (`/policies/:id`):** Complete plan schedule, coverage ceilings, deductibles, exclusions, terms.
9. **Apply for Policy (`/policies/:id/apply`):** Multi-step proposal form with nominee details and income disclosures.
10. **My Active Policies (`/my-policies`):** Policyholder active policies with start/end dates, policy number, coverage, and quick claim triggers.
11. **Claims Registry (`/claims`):** Filterable claim records with status badges, date ranges, and category pills.
12. **File New Claim (`/claims/new`):** Policy selection, incident date validation, coverage limit checks, narrative description, and multi-file evidence upload.
13. **Claim Dossier & Timeline (`/claims/:id`):** 6-stage chronological milestone audit trail, evidence viewer, officer review notes workbench.
14. **Additional Document Upload (`/claims/:id`):** Embedded supplementary document upload module for claims in `ADDITIONAL_DOCS_REQUIRED`.
15. **Officer Adjudication Workbench (`/officer/claims`):** Filtered assigned/unassigned claims queues with status transition actions.
16. **Admin Policy Management (`/admin/policies`):** Create new insurance plans, edit terms, deactivate obsolete policies.
17. **Admin Underwriting Workbench (`/admin/applications`):** Review pending customer applications, approve to generate `CustomerPolicy`, or reject with notes.
18. **Audit & Compliance Logs (`/admin/audit-logs`):** Immutable security logs capturing actors, IP addresses, actions, and timestamps.
19. **Reports & Analytics (`/reports`):** Multi-parameter filter engine with dynamic table calculation and one-click CSV export.
20. **User Profile Settings (`/profile`):** Personal profile management, password update with bcrypt hashing, active session viewer.

---

## 5. Automated 6-Stage Claim Adjudication Lifecycle

```
[ Customer Files Claim ]
          │
          ▼
    1. SUBMITTED ──► (Eligibility & coverage limit verified)
          │
          ▼
   2. UNDER REVIEW ◄────────────────┐ (Customer uploads
          │                         │  requested bills)
          ├─────────────────────────┤
          ▼                         │
3. ADDITIONAL DOCS REQUIRED ────────┘
          │
          ├──► 4. APPROVED (Within coverage ceiling) ──► 6. SETTLED (Fund disbursement)
          │
          └──► 5. REJECTED (Mandatory legal reason recorded)
```

### Server-Enforced Business Rules
- **Active Policy Check:** Claims can strictly only be submitted against policies in `ACTIVE` status.
- **Coverage Limit Ceiling:** Claim amounts cannot exceed the policy's sum insured (`coverageAmount`).
- **Incident Date Boundaries:** Incident dates must be within active coverage dates (`startDate` to `endDate`) and not in the future.
- **Duplicate Prevention:** The system blocks duplicate claims filed against the same policy on the same incident date.
- **Mandatory Rejection Reasons:** Insurers cannot reject a claim without stating official documented legal grounds.
- **Settlement Segregation:** Only Administrators can transition approved claims to `SETTLED`.

---

## 6. How to Run the Application

### Option A: One-Click Startup (Recommended for Windows)
Double-click `start-all.bat` in the project root. This automatically opens two terminal windows:
- Backend REST API server on **http://localhost:5000**
- Angular 19 Single Page Application on **http://localhost:4200**

### Option B: Manual Command-Line Startup

#### 1. Start the Backend API
```powershell
cd "c:\Users\shind\Desktop\HCL final project\Insurance-Claims-Portal\backend"
npm start
```
*Backend health check:* Visit [http://localhost:5000/api/health](http://localhost:5000/api/health) (returns `{"status":"online"}`).

#### 2. Start the Frontend UI
```powershell
cd "c:\Users\shind\Desktop\HCL final project\Insurance-Claims-Portal\frontend"
npm start
```
*Frontend web application:* Open your browser and navigate to [http://localhost:4200](http://localhost:4200).

---

## 7. Automated Test Suite Execution

The backend contains a complete automated integration test suite written with Jest and Supertest.

To execute the automated tests:
```powershell
cd "c:\Users\shind\Desktop\HCL final project\Insurance-Claims-Portal\backend"
npm test
```

### Test Results Summary:
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

---

## 8. Academic Deliverables & Documentation Index

All academic submission files strictly follow the college's **"Angular Main Project Report Guidelines"** (Times New Roman, 12pt, 1.5 line spacing, 18 standard chapters):

| Deliverable File | Description & Format | Location |
|---|---|---|
| **`final-project-report.docx`** | Full 18-Chapter College Project Report (Microsoft Word format, 35-60 pages) | Root & `docs/final-project-report.docx` |
| **`final-project-report.pdf`** | Print-ready Academic Project Report with running headers, footers, & page numbers | Root & `docs/final-project-report.pdf` |
| **`project-presentation.pptx`** | 15-Slide Professional Viva Voce Defense Presentation (16:9 Widescreen) | Root & `docs/project-presentation.pptx` |
| **`docs/synopsis.md`** | Academic Project Synopsis & Executive Summary | `docs/synopsis.md` |
| **`docs/problem-statement.md`** | Industrial Motivation & System Gaps Analysis | `docs/problem-statement.md` |
| **`docs/objectives-and-scope.md`** | Functional Scope, Deliverables & Boundaries | `docs/objectives-and-scope.md` |
| **`docs/srs.md`** | Software Requirements Specification (IEEE 830 standard) | `docs/srs.md` |
| **`docs/architecture-diagram.md`** | 3-Tier Enterprise Architecture Diagram | `docs/architecture-diagram.md` |
| **`docs/use-case-diagram.md`** | Complete Actor Use-Case Specification | `docs/use-case-diagram.md` |
| **`docs/workflow-diagram.md`** | 6-Stage Claim Settlement Lifecycle Diagram | `docs/workflow-diagram.md` |
| **`docs/database-er-diagram.md`** | 3NF Entity-Relationship Diagram & Data Dictionary | `docs/database-er-diagram.md` |
| **`docs/component-hierarchy.md`** | Angular 19 Component Tree & Service Architecture | `docs/component-hierarchy.md` |
| **`docs/api-documentation.md`** | Complete REST API Endpoints Specification | `docs/api-documentation.md` |
| **`docs/test-cases.md`** | QA Test Matrix (21 Test Cases) & Execution Logs | `docs/test-cases.md` |

---

## 9. Viva Voce Key Defense Answers

When presenting this project to external academic examiners:

1. **Why was Angular 19 chosen over React or Next.js?**  
   *Answer:* Angular provides an enterprise-standard, unified architecture with first-class TypeScript typing, native Dependency Injection, fine-grained reactivity via Angular Signals, built-in Reactive Forms, and robust functional route guards. It avoids the fragile third-party dependency fragmentation common in React ecosystems.

2. **How does the system prevent insurance fraud?**  
   *Answer:* The backend synchronously enforces multi-tiered business constraints: verifying that the policy is currently ACTIVE, checking that the incident date falls strictly within policy coverage boundaries, rejecting any claim amount exceeding the policy's remaining coverage limit, and blocking duplicate claims on identical incident dates.

3. **Why use SQLite with Prisma ORM rather than MongoDB or PostgreSQL?**  
   *Answer:* Insurance policies and claim audit trails demand strict ACID compliance, transactional integrity, and relational foreign keys. Prisma ORM guarantees compile-time type-safe database queries and migrations. SQLite provides serverless, zero-latency local relational persistence without needing heavyweight background server daemons.

4. **How are administrative privileges separated from claims adjuster privileges?**  
   *Answer:* The application implements strict Segregation of Duties. Insurance Officers can review claims, inspect documents, request additional evidence, and recommend approvals, but they cannot create policies or authorize final monetary settlements. Only Administrators possess permissions to publish plans, underwrite applications, and disburse settlements.

---

## 10. Candidate Verification & Signature

This project represents an **INDIVIDUAL ACADEMIC SUBMISSION** for Group 20. All software architecture, REST APIs, Angular components, database schemas, automated test suites, and academic documentation were engineered solely and comprehensively by the candidate.

**Candidate Name:** Shreyas Shinde  
**Project Group:** Group 20 (Individual Submission)  
**Academic Year:** 2026–2027  
**Date:** November 3, 2026  

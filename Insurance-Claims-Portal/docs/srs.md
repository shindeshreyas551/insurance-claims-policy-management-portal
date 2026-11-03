# Software Requirements Specification (SRS)

## 1. Introduction
This Software Requirements Specification (SRS) defines the functional, non-functional, interface, and security requirements for the **Insurance Claims & Policy Management Portal** (Group 20 Individual Academic Project).

## 2. User Classes and Characteristics
- **Customer (Policyholder):**
  - General public user who registers, explores insurance plans, applies for coverage, manages issued active policies, submits claims with digital documentation, and tracks claim milestones.
- **Insurance Officer (Claims Adjuster / Assessor):**
  - Regional branch staff responsible for investigating claims assigned to them or claimed from the unassigned pool, inspecting medical and repair bills, requesting additional evidence, and recommending approval or documented rejection.
- **Administrator (Executive / Operations Manager):**
  - Superuser with total organizational governance: manages users, publishes and deactivates insurance plans, assesses policy proposals, assigns claims to officers, authorizes financial settlements, reviews compliance audit trails, and exports analytics reports.

## 3. Operating Environment
- **Client Side:** Any modern ECMAScript-compliant web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) on Desktop, Tablet, or Mobile.
- **Server Side:** Node.js v18+ / v20+ / v22+ / v26+, Express.js v4.21+.
- **Database System:** SQLite 3 with Prisma ORM v6.
- **Network Protocol:** HTTP/1.1 and HTTPS with REST JSON payloads.

## 4. Functional Requirements

### FR-01: Authentication & Authorization
- **FR-01.1:** System shall permit new customer account registration with name, email, password, phone, and address.
- **FR-01.2:** System shall authenticate users via email and password, issuing signed JSON Web Tokens (JWT) valid for 7 days.
- **FR-01.3:** System shall encrypt all passwords using bcrypt hashing with a salt factor of 10.
- **FR-01.4:** Angular frontend shall protect restricted routes using `authGuard` and `roleGuard`.
- **FR-01.5:** Angular `jwtInterceptor` shall automatically attach Bearer tokens to all outgoing `/api/` requests.
- **FR-01.6:** Rate limiting middleware shall limit incoming requests to 300 per 15-minute interval per IP address.

### FR-02: Policy Catalog Management
- **FR-02.1:** System shall manage policies across 5 categories: Health, Life, Vehicle, Home, Travel.
- **FR-02.2:** System shall display policy name, description, coverage limit, annual premium, duration, eligibility, and terms.
- **FR-02.3:** System shall allow search by keyword and filtering by category.
- **FR-02.4:** Only Administrators shall have permission to create, edit, or toggle the active status of policies.

### FR-03: Underwriting & Applications
- **FR-03.1:** Eligible customers shall submit policy applications specifying Nominee Name, Nominee Relationship, Annual Income, and health/asset disclosures.
- **FR-03.2:** System shall assign unique tracking identifiers (`APP-YYYY-XXXX`) and set status to `PENDING`.
- **FR-03.3:** Administrators shall review proposals and approve or reject them with audit remarks.
- **FR-03.4:** Upon approval, system shall automatically instantiate a `CustomerPolicy` record with unique policy number (`CP-CAT-YYYY-XXXX`), active status, and calculated start and expiry dates.

### FR-04: Claims Submission & Evidence Uploads
- **FR-04.1:** Customers shall only submit claims against their own active policies.
- **FR-04.2:** System shall reject claims where incident date is in the future, earlier than policy inception, or after policy expiration.
- **FR-04.3:** System shall reject claim amounts that are negative, zero, or exceed the policy's maximum coverage limit.
- **FR-04.4:** System shall prevent duplicate claims for the same policy and identical incident date.
- **FR-04.5:** System shall accept up to 5 supporting evidence files (PDF, JPG, JPEG, PNG, max 5MB per file) and persist document metadata in `ClaimDocument`.

### FR-05: 6-Tier Claims Workflow
- **FR-05.1:** Status transitions shall follow: `SUBMITTED` -> `UNDER_REVIEW` -> `ADDITIONAL_DOCS_REQUIRED` -> `APPROVED` / `REJECTED` -> `SETTLED`.
- **FR-05.2:** Rejections shall strictly require documented rejection grounds.
- **FR-05.3:** Settlements shall require the claim to be in `APPROVED` status and shall only be authorized by Administrators.
- **FR-05.4:** Every status change shall append an entry to `ClaimStatusHistory` capturing actor ID, timestamp, and remarks.

### FR-06: Notifications & Auditing
- **FR-06.1:** System shall generate notifications upon claim submission, status transitions, additional document requests, approvals, and settlements.
- **FR-06.2:** System shall record operational actions in the `AuditLog` table with user ID, action code, entity name, entity ID, details, and client IP address.

### FR-07: Reporting & Analytics
- **FR-07.1:** Admin dashboard shall aggregate live database counts and render 4 Chart.js charts: Monthly Inflow, Status Breakdown, Category Distribution, and Claimed vs Settled Sums.
- **FR-07.2:** Reports module shall filter claims by date range, category, status, and officer, and export formatted CSV files.

## 5. Non-Functional Requirements
- **NFR-01: Reliability:** 100% referential integrity enforced via Prisma relational foreign keys and cascading delete rules.
- **NFR-02: Security:** Strict defense against OWASP vulnerabilities, role verification on every private endpoint, and parameter sanitization via Zod.
- **NFR-03: Performance:** Production build bundle under 800kB transfer size with tree-shaking and lazy chunk generation.
- **NFR-04: Compatibility:** Full compatibility with modern evergreen browsers on Windows, macOS, Linux, Android, and iOS.


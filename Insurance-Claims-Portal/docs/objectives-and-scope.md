# Project Objectives and Scope

## 1. Primary Objectives
1. **Develop an Enterprise-Grade Single Page Application (SPA):**
   Utilize Angular 19, Angular Material, TypeScript, and modern CSS/SCSS to construct a responsive, accessible, Navy-Blue themed enterprise portal for three distinct user roles: Administrator, Insurance Officer, and Customer.

2. **Implement End-to-End Insurance Lifecycle Management:**
   Digitize the complete workflow encompassing user registration, policy browsing, application underwriting, active policy issuance with automated policy numbering and valid dates, claim filing, evidence uploading, claim review, and payout settlement.

3. **Enforce Robust 6-Stage Claim Workflow:**
   Support the strict status lifecycle:
   $$\text{SUBMITTED} \longrightarrow \text{UNDER\_REVIEW} \rightleftarrows \text{ADDITIONAL\_DOCS\_REQUIRED} \longrightarrow \text{APPROVED / REJECTED} \longrightarrow \text{SETTLED}$$
   Ensure no automated rubber-stamping, require detailed rejection justifications, and record every status transition in an immutable `ClaimStatusHistory` audit table.

4. **Deliver Secure Document Management:**
   Implement server-side multi-file uploads (Multer) for PDF, JPG, JPEG, and PNG files up to 5MB, validating MIME types, generating unique disk filenames, and providing authorized viewing and downloading endpoints.

5. **Provide Dynamic Business Analytics & Reporting:**
   Generate live dashboard statistics from database aggregations (avoiding hardcoded statistics) and present interactive Chart.js visualizations for monthly claims, status distribution, policy category distribution, and claimed vs settled financials. Enable customizable CSV data exports.

## 2. Project Scope

### Functional Scope:
- **Authentication & Authorization Module:** Customer self-registration, secure JWT login, role-based Angular route guards, HTTP Bearer interceptor, and profile management.
- **Policy Catalog Module:** Categorized policy directory (Health, Life, Vehicle, Home, Travel), detailed eligibility specs, and admin CRUD controls.
- **Underwriting & Application Module:** Digital application proposals with nominee specifications, annual income, pre-existing conditions, and admin approval/rejection issuing `CustomerPolicy` records.
- **Claims Assessment Module:** Claim registration against active policies with coverage limit validation, duplicate check, and incident verification.
- **Evidence Management Module:** Secure uploads, disk storage, and role-authorized file streaming.
- **Notification Engine:** Event-driven in-app notifications with unread badge counter.
- **Auditing & Reporting Module:** Audit logs tracking all critical operational actions and CSV report generation with filtering by date, status, category, and officer.

### Non-Functional Scope:
- **Performance:** Sub-100ms API response times for standard queries using indexed SQLite tables.
- **Security:** Password hashing using bcrypt (10 rounds), token expiration, input sanitization via Zod, and rate limiting (300 requests per 15 min).
- **Usability:** Responsive layout supporting mobile, tablet, laptop, and desktop viewports with consistent enterprise styling.
- **Maintainability:** Modular architecture adhering to Clean Architecture principles, full TypeScript typing across frontend and backend, and comprehensive automated test coverage.


# Problem Statement

## 1. Context and Background
The contemporary insurance sector is fundamentally dependent upon rapid, transparent, and accurate claims adjudication and policy administration. However, many conventional insurance firms and legacy academic models suffer from disjointed operational silos. Policy purchasing, claims submission, loss verification, and settlement payouts often rely on disconnected manual documentation, fragmented spreadsheet logging, and opaque verification hierarchies.

## 2. Core Operational Deficiencies
1. **Prolonged Claim Settlement Turnaround Time (TAT):**
   Physical submission of medical discharge certificates, vehicle damage assessments, or police FIRs creates an average delay of 2 to 4 weeks. Misplaced records and manual routing between branch offices severely harm customer satisfaction.

2. **Absence of Real-Time Transparency for Policyholders:**
   Customers often submit claims into a "black box" where they have no visibility into whether their claim is under technical review, waiting for supplementary diagnostic receipts, or approved by the underwriting desk.

3. **High Incidence of Document Fraud & Duplicate Claims:**
   Without centralized relational database validations, opportunistic submissions can file identical incident claims across overlapping intervals, or claim sums exceeding the remaining coverage limit of the active policy.

4. **Inflexible Role Authorization & Segregation of Duties:**
   In small-to-medium systems, boundary blurring between operational staff (adjusters/officers) and executive decision-makers (administrators) leads to unauthorized approvals and compromised internal audit controls.

5. **Lack of Dynamic Business Intelligence & Real-Time Reporting:**
   Legacy systems fail to calculate claims-to-settlement ratios and monthly financial outflows directly from operational databases, relying on manual batch calculations that are prone to error.

## 3. The Proposed Solution
The **Insurance Claims & Policy Management Portal** resolves these challenges by introducing:
- A completely digital, responsive **Angular 19** frontend with role-specific workspaces for Customers, Officers, and Administrators.
- A secure **Express.js + TypeScript REST API** with JWT authentication, role guards, Zod validation, and rate limiting.
- Strict database constraints and relational mapping via **Prisma ORM and SQLite**, guaranteeing that claims can only be filed against active policies, claim amounts never exceed coverage limits, duplicate claims on identical incident dates are prevented, and status transitions enforce documented rejection and approval reasons.
- Integrated digital file management (Multer) supporting multi-document evidence uploads (PDF, JPG, JPEG, PNG up to 5MB).
- Instant in-app notifications and immutable system-wide audit logging.
- Real-time Chart.js visual analytics and one-click filtered CSV exports.


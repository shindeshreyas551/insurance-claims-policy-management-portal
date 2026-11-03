# Project Synopsis

## 1. Project Title
**Insurance Claims & Policy Management Portal**

## 2. Project Group & Student Submission
- **Group ID:** Group 20
- **Submission Type:** Individual Academic Project (Final Assessment)
- **Degree / Branch:** Bachelor of Engineering in Computer Science & Engineering (3rd Year)
- **Development Platform:** Google Antigravity AI

---

## 3. Executive Summary
The **Insurance Claims & Policy Management Portal** is a production-grade, full-stack enterprise web application engineered to streamline the full lifecycle of insurance policies and claim settlement. The platform eliminates manual delays, opacity, and paper-heavy overhead typical of conventional insurance ecosystems. 

Built using **Angular 19** with standalone component architecture and **Angular Material** on the frontend, a modular **Node.js / Express TypeScript REST API** backend, and a relational database managed with **Prisma ORM and SQLite**, the portal strictly separates operational responsibilities across three discrete user roles:
1. **Customer (Policyholder):** Explores curated insurance catalogs across 5 domains (Health, Life, Vehicle, Home, Travel), submits digital policy applications with nominee details, reviews active policy schedules, submits claims with multiple supporting documents (PDF, JPG, PNG up to 5MB), responds to document requests, and tracks claims in real-time.
2. **Insurance Officer:** Accesses an assigned verification queue, inspects uploaded physical evidence, records audit findings, issues requests for additional documentation, and recommends claim approval or rejection.
3. **Administrator:** Governs user accounts, reviews applications and authorizes active policy issuance, manages claim assignment to officers, authorizes final fund settlements, accesses dynamic interactive Chart.js analytics, conducts compliance audits via immutable system logs, and exports full datasets to CSV.

---

## 4. Key Problem Addressed
Traditional claim processing is characterized by:
- Fragmented communications between policyholders and adjusters.
- Delayed verification of physical medical bills and damage estimates.
- Lack of transparent status tracking leading to customer anxiety.
- Administrative bottlenecks without real-time dashboard analytics.
- Inadequate audit trails and vulnerability to duplicate claims.

---

## 5. Technology Stack
- **Frontend:** Angular 19, TypeScript, RxJS, Angular Material, Angular Reactive Forms, Chart.js, SCSS.
- **Backend:** Node.js, Express.js (v4/v5), TypeScript, JWT (JSON Web Tokens), bcryptjs password encryption, Zod schema validation, Multer file upload middleware.
- **Database & ORM:** SQLite, Prisma ORM (v6).
- **Quality Assurance & Testing:** Jest, Supertest, Karma, Angular CLI Headless Chrome testing.

---

## 6. Real Database Metrics & Seeding
The application is populated with authentic seed data across 9 relational tables:
- 1 Administrator, 2 Regional Insurance Officers, 3 Customers.
- 8 Insurance policies across 5 categories with customized coverage amounts and waiting period rules.
- 5 Policy applications covering Pending, Approved, and Rejected states.
- 4 Active customer policies with distinct coverage limits.
- 6 Claims demonstrating every stage of the 6-tier claim lifecycle: `SUBMITTED`, `UNDER_REVIEW`, `ADDITIONAL_DOCS_REQUIRED`, `APPROVED`, `REJECTED`, and `SETTLED`.
- Physical supporting documents linked to claims and stored in dedicated server directory.
- Full status history logs and real-time in-app notification records.


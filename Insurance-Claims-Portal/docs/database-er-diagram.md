# Database Entity-Relationship (ER) Diagram

The Insurance Claims & Policy Management Portal database is normalized to Third Normal Form (3NF) and implemented using **Prisma ORM** with **SQLite**.

```mermaid
erDiagram
    USER ||--o{ POLICY_APPLICATION : "submits"
    USER ||--o{ CUSTOMER_POLICY : "owns"
    USER ||--o{ CLAIM : "files"
    USER ||--o{ CLAIM : "assigned_as_officer"
    USER ||--o{ CLAIM_STATUS_HISTORY : "changed_by"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ AUDIT_LOG : "triggers"

    POLICY ||--o{ POLICY_APPLICATION : "applied_for"
    POLICY ||--o{ CUSTOMER_POLICY : "instantiated_into"
    POLICY ||--o{ CLAIM : "covered_by"

    POLICY_APPLICATION ||--o| CUSTOMER_POLICY : "produces_on_approval"

    CUSTOMER_POLICY ||--o{ CLAIM : "claimed_against"

    CLAIM ||--o{ CLAIM_DOCUMENT : "contains"
    CLAIM ||--o{ CLAIM_STATUS_HISTORY : "tracks_milestones"

    USER {
        string id PK "UUID"
        string name "User legal name"
        string email UK "Unique email address"
        string passwordHash "bcrypt hashed password"
        enum role "ADMIN | OFFICER | CUSTOMER"
        string phone "Contact number"
        string address "Residential address"
        boolean isActive "Default: true"
        datetime createdAt "Timestamp"
        datetime updatedAt "Timestamp"
    }

    POLICY {
        string id PK "UUID"
        string policyNumber UK "e.g. POL-HLT-001"
        string name "Plan name"
        enum category "HEALTH | LIFE | VEHICLE | HOME | TRAVEL"
        string description "Plan narrative"
        float premiumAmount "Annual/periodic premium in INR"
        float coverageAmount "Maximum sum insured in INR"
        int durationMonths "Duration in months"
        string eligibility "Eligibility rules"
        string termsAndConditions "Legal exclusions and waiting periods"
        boolean isActive "Default: true"
        datetime createdAt "Timestamp"
        datetime updatedAt "Timestamp"
    }

    POLICY_APPLICATION {
        string id PK "UUID"
        string applicationNumber UK "e.g. APP-2026-0001"
        string customerId FK "User reference"
        string policyId FK "Policy reference"
        enum status "PENDING | APPROVED | REJECTED"
        string nomineeName "Beneficiary name"
        string nomineeRelation "Spouse, Father, Child, etc."
        float annualIncome "Applicant income"
        string existingConditions "Medical/asset disclosures"
        string remarks "Admin remarks"
        string reviewedById FK "Admin reference"
        datetime reviewedAt "Review timestamp"
        datetime createdAt "Timestamp"
        datetime updatedAt "Timestamp"
    }

    CUSTOMER_POLICY {
        string id PK "UUID"
        string policyNumber UK "e.g. CP-HLT-2026-8891"
        string customerId FK "User reference"
        string policyId FK "Policy reference"
        string applicationId FK "Application reference"
        datetime startDate "Coverage inception"
        datetime endDate "Coverage expiration"
        float premiumPaid "Premium paid"
        float coverageAmount "Coverage ceiling"
        enum status "ACTIVE | EXPIRED | CANCELLED"
        datetime createdAt "Timestamp"
        datetime updatedAt "Timestamp"
    }

    CLAIM {
        string id PK "UUID"
        string claimNumber UK "e.g. CLM-2026-0001"
        string customerId FK "User reference"
        string customerPolicyId FK "CustomerPolicy reference"
        string policyId FK "Policy reference"
        datetime incidentDate "Event date"
        string claimCategory "HEALTH, VEHICLE, etc."
        float claimAmount "Amount demanded"
        float approvedAmount "Validated payout amount"
        string description "Incident description"
        enum status "SUBMITTED | UNDER_REVIEW | ADDITIONAL_DOCS_REQUIRED | APPROVED | REJECTED | SETTLED"
        string assignedOfficerId FK "Officer User reference"
        string officerRemarks "Internal assessment notes"
        string rejectionReason "Mandatory grounds on rejection"
        datetime settledAt "Disbursement timestamp"
        datetime createdAt "Timestamp"
        datetime updatedAt "Timestamp"
    }

    CLAIM_DOCUMENT {
        string id PK "UUID"
        string claimId FK "Claim reference"
        string fileName "Stored file name on disk"
        string originalName "Original file name uploaded"
        string filePath "Relative disk storage path"
        string mimeType "application/pdf, image/jpeg, etc."
        int fileSize "Size in bytes"
        string uploadedBy FK "User reference"
        datetime uploadedAt "Upload timestamp"
    }

    CLAIM_STATUS_HISTORY {
        string id PK "UUID"
        string claimId FK "Claim reference"
        enum previousStatus "Prior state"
        enum newStatus "Transitioned state"
        string changedById FK "User who altered status"
        string remarks "Action commentary"
        datetime createdAt "Timestamp"
    }

    NOTIFICATION {
        string id PK "UUID"
        string userId FK "Recipient User reference"
        string title "Notification title"
        string message "Notification message"
        enum type "INFO | WARNING | SUCCESS | ERROR"
        boolean isRead "Default: false"
        string link "Portal route redirect"
        datetime createdAt "Timestamp"
    }

    AUDIT_LOG {
        string id PK "UUID"
        string userId FK "Actor reference"
        string action "e.g. SUBMIT_CLAIM, SETTLE_CLAIM"
        string entity "Target entity name"
        string entityId "Target primary key"
        string details "Operational summary"
        string ipAddress "Client IP"
        datetime createdAt "Timestamp"
    }
```


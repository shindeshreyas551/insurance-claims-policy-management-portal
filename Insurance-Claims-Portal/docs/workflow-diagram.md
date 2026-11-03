# Workflow Diagram

This document illustrates the two critical business workflows of the portal:
1. **Policy Application & Issuance Workflow**
2. **The 6-Stage Insurance Claims & Settlement Lifecycle**

---

## 1. Policy Application & Issuance Workflow

```mermaid
flowchart TD
    Start(["Customer Browses Policy Catalog"]) --> SelectPolicy["Select Plan & Click 'Apply Now'"]
    SelectPolicy --> FillForm["Complete Proposal: Nominee Name, Relation, Income, Disclosures"]
    FillForm --> ValidateForm{"Frontend Validation Passed?"}
    ValidateForm -- No --> ShowErrors["Highlight Invalid Form Fields"]
    ValidateForm -- Yes --> SubmitAPI["POST /api/applications/apply"]
    SubmitAPI --> StorePending["Store Application in DB (Status: PENDING)"]
    StorePending --> NotifyAdmin["Send In-App Notification to Administrators"]
    
    NotifyAdmin --> AdminReview{"Administrator Assessment"}
    AdminReview -- Rejected --> RejectApp["Status: REJECTED\nRecord Admin Remarks\nNotify Customer"]
    AdminReview -- Approved --> ApproveApp["Status: APPROVED\nCalculate Inception & Expiry Dates\nGenerate Policy No: CP-CAT-YYYY-XXXX\nCreate CustomerPolicy Record\nNotify Customer"]
    ApproveApp --> EndActive(["Policy Becomes ACTIVE & Eligible for Claims"])
```

---

## 2. 6-Stage Insurance Claim & Settlement Lifecycle

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Customer files claim with date, amount, description & documents
    
    SUBMITTED --> UNDER_REVIEW : Admin assigns Officer OR Officer self-assigns claim
    
    state "UNDER_REVIEW" as UR {
        [*] --> EvidenceInspection
        EvidenceInspection --> CrossCheckCoverage
        CrossCheckCoverage --> AssessmentRemarks
    }

    UR --> ADDITIONAL_DOCS_REQUIRED : Officer finds bills/FIR missing or ambiguous
    ADDITIONAL_DOCS_REQUIRED --> UR : Customer uploads requested supporting files
    
    UR --> REJECTED : Officer/Admin rejects (Mandatory Rejection Grounds Recorded)
    UR --> APPROVED : Officer/Admin approves (Validated Payout Amount Recorded)
    
    APPROVED --> SETTLED : Administrator confirms NEFT fund transfer & settlement reference
    
    REJECTED --> [*]
    SETTLED --> [*]
```

## Business Rules & Validation Checkpoints
1. **Active Policy Validation:** Claims cannot be submitted against policies with status `EXPIRED` or `CANCELLED`.
2. **Date Boundaries:** $\text{StartDate} \le \text{IncidentDate} \le \text{CurrentDate} \le \text{EndDate}$.
3. **Financial Limit:** $\text{ClaimAmount} \le \text{PolicyCoverageAmount}$.
4. **Duplicate Prevention:** No two non-rejected claims can exist for the same policy on the same incident date.
5. **Rejection Justification:** Every status change to `REJECTED` strictly requires a populated `rejectionReason`.
6. **Settlement Prerequisite:** A claim must hold status `APPROVED` prior to transitioning to `SETTLED`.


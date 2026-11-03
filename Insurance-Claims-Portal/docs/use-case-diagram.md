# Use-Case Diagram

The use-case model delineates the interactions between the three primary actors—**Customer**, **Insurance Officer**, and **Administrator**—and the core capabilities of the portal.

```mermaid
flowchart LR
    Customer["👤 Customer (Policyholder)"]
    Officer["👮 Insurance Officer"]
    Admin["👑 System Administrator"]

    subgraph AuthCases ["Authentication & Profile"]
        UC1["Register Account"]
        UC2["Login / Logout"]
        UC3["Update Profile & Password"]
    end

    subgraph PolicyCases ["Policy Management"]
        UC4["Browse & Search Policies"]
        UC5["View Policy Details"]
        UC6["Apply for Policy"]
        UC7["Review Proposals & Issue Policy"]
        UC8["Create / Deactivate Policy Plans"]
    end

    subgraph ClaimCases ["Claim Operations & Evidence"]
        UC9["File Claim against Active Policy"]
        UC10["Upload Supporting Invoices / Photos"]
        UC11["Track Claim Status History"]
        UC12["Inspect Evidence & Add Remarks"]
        UC13["Request Additional Documents"]
        UC14["Recommend Approval / Rejection"]
        UC15["Assign Officer to Claim"]
        UC16["Authorize Settlement & Disburse Payout"]
    end

    subgraph AnalyticsCases ["Analytics & Governance"]
        UC17["View In-App Notifications"]
        UC18["Review Chart.js Analytics"]
        UC19["Generate & Export CSV Reports"]
        UC20["Inspect Audit Compliance Trail"]
        UC21["Manage Staff Accounts"]
    end

    %% Customer Connections
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC9
    Customer --> UC10
    Customer --> UC11
    Customer --> UC17

    %% Officer Connections
    Officer --> UC2
    Officer --> UC3
    Officer --> UC4
    Officer --> UC11
    Officer --> UC12
    Officer --> UC13
    Officer --> UC14
    Officer --> UC17
    Officer --> UC19

    %% Admin Connections
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC7
    Admin --> UC8
    Admin --> UC11
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
```


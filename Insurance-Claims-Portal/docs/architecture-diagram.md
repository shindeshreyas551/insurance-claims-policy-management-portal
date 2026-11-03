# System Architecture Diagram

The Insurance Claims & Policy Management Portal follows a 3-tier enterprise client-server architectural pattern, strictly separating presentation, business logic, and relational persistence.

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Angular 19 SPA)"]
        UI["Angular Presentation (HTML5 / SCSS / Angular Material)"]
        Router["Angular Router & Route Guards (authGuard, roleGuard)"]
        Components["Standalone Feature Components (Admin, Officer, Customer, Claims)"]
        Services["Core Singleton Services (Auth, Policy, Claim, Dashboard, Report)"]
        Interceptor["HTTP Interceptors (JWT Bearer Token & Error Interceptor)"]
        ChartJS["Chart.js Data Visualization Engine"]
        
        UI --> Components
        Components --> Router
        Components --> Services
        Components --> ChartJS
        Services --> Interceptor
    end

    subgraph APILayer ["API & Business Logic Layer (Node.js & Express TS)"]
        CORS["CORS & Rate Limiter Middleware"]
        AuthMid["JWT Authentication & Role Authorization Middleware"]
        MulterMid["Multer File Upload Middleware (PDF, JPG, PNG <= 5MB)"]
        ZodVal["Zod Schema Validation & Sanitization"]
        Controllers["Domain Controllers (Auth, Policy, Application, Claim, Report)"]
        AuditLogger["Audit Logger & In-App Notification Engine"]
        
        Interceptor -->|REST JSON / Multipart HTTP| CORS
        CORS --> AuthMid
        CORS --> MulterMid
        AuthMid --> ZodVal
        ZodVal --> Controllers
        Controllers --> AuditLogger
    end

    subgraph DataLayer ["Data & Persistence Layer (Prisma ORM & SQLite)"]
        PrismaClient["Prisma Client ORM (Query Engine)"]
        SQLiteDB[("SQLite Relational Database (dev.db)")]
        FileStorage[("Server Storage: /uploads/ Directory")]
        
        Controllers --> PrismaClient
        MulterMid -->|Stream Write| FileStorage
        PrismaClient --> SQLiteDB
    end
```

## Architectural Highlights
1. **Separation of Concerns:** Business rules (e.g. claim amount <= coverage limit, valid dates) are enforced both on the client via Angular Reactive Forms and authoritatively on the backend via Zod and Prisma queries.
2. **Stateless JWT Security:** Authentication is completely stateless; the client stores the signed token and transmits it in the `Authorization: Bearer <token>` header, verified on each protected backend route.
3. **Dedicated Physical Storage:** Binary document files (medical invoices, police FIRs, accident photos) are stored on disk in the `uploads/` folder with cryptographically randomized unique filenames, while metadata and claim relationships reside in SQLite.


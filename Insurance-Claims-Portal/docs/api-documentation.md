# REST API Documentation

The Insurance Claims & Policy Management Portal exposes a comprehensive RESTful API built with Express.js and TypeScript, operating under the `/api` prefix on port 5000.

---

## 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account | `{ name, email, password, phone?, address? }` |
| `POST` | `/api/auth/login` | Public | Authenticate and issue JWT token | `{ email, password }` |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve current user profile | Header: `Bearer <token>` |
| `PUT` | `/api/auth/profile` | Authenticated | Update user name, phone, address | `{ name?, phone?, address? }` |
| `PUT` | `/api/auth/change-password` | Authenticated | Change account password | `{ currentPassword, newPassword }` |

---

## 2. Insurance Policy Endpoints (`/api/policies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/policies` | Public / Auth | List policies with optional query params `?category=&search=&activeOnly=` |
| `GET` | `/api/policies/:id` | Public / Auth | Get policy details by ID |
| `POST` | `/api/policies` | Admin Only | Create new policy plan |
| `PUT` | `/api/policies/:id` | Admin Only | Update policy plan fields |
| `PATCH` | `/api/policies/:id/toggle-status` | Admin Only | Activate or deactivate policy |

---

## 3. Policy Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/apply` | Customer | Submit proposal for a policy plan |
| `GET` | `/api/applications/my-applications` | Customer | List logged-in customer's applications |
| `GET` | `/api/applications/all` | Admin Only | List all applications with status/search filter |
| `PATCH` | `/api/applications/:id/review` | Admin Only | Approve (issues `CustomerPolicy`) or Reject proposal |

---

## 4. Customer Policies (`/api/customer-policies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/customer-policies/my-policies` | Customer | Retrieve all active issued policies for logged-in user |
| `GET` | `/api/customer-policies/:id` | Owner / Staff | Get full policy schedule & linked claims history |

---

## 5. Insurance Claims (`/api/claims`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/claims` | Role-Filtered | List claims (Customer sees own; Officer sees assigned/queue; Admin sees all) |
| `GET` | `/api/claims/:id` | Role-Filtered | Get full claim dossier with documents & status history |
| `POST` | `/api/claims/submit` | Customer | Multipart submit claim with date, amount, description, and up to 5 files |
| `POST` | `/api/claims/:id/upload-documents` | Customer | Upload additional requested supporting documents |
| `PATCH` | `/api/claims/:id/status` | Officer / Admin | Transition status (`UNDER_REVIEW`, `ADDITIONAL_DOCS`, `APPROVED`, `REJECTED`, `SETTLED`) |
| `PATCH` | `/api/claims/:id/assign` | Admin Only | Assign insurance officer to claim |

---

## 6. Document Management (`/api/documents`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/documents/:id/view` | Owner / Staff | Stream document inline in browser |
| `GET` | `/api/documents/:id/download` | Owner / Staff | Download file attachment with original filename |

---

## 7. Dashboards (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/customer` | Customer | Real-time counts, active policies, recent claims & notifications |
| `GET` | `/api/dashboard/officer` | Officer | Assigned claims queue, review metrics, unassigned pool |
| `GET` | `/api/dashboard/admin` | Admin | Real database statistics & 4 Chart.js datasets |

---

## 8. Reports & Governance (`/api/reports` & `/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/claims` | Officer / Admin | Filter claims report with financial summary |
| `GET` | `/api/reports/claims/export-csv` | Admin Only | Download claims report formatted as CSV attachment |
| `GET` | `/api/users` | Admin Only | User directory with policy/claim counts |
| `POST` | `/api/users` | Admin Only | Create new staff user (Officer or Admin) |
| `PATCH` | `/api/users/:id/toggle-status` | Admin Only | Toggle user account activation |
| `GET` | `/api/users/officers` | Officer / Admin | Dropdown list of active officers |
| `GET` | `/api/users/audit-logs` | Admin Only | Retrieve system compliance audit trail |


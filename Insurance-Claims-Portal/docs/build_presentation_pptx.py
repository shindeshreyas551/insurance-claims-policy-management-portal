import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    print("Generating comprehensive academic viva presentation using python-pptx...")
    prs = Presentation()

    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6] # Blank slide

    # Color Palette
    c_navy = RGBColor(0x0F, 0x2B, 0x48)
    c_blue = RGBColor(0x1D, 0x4E, 0xD8)
    c_accent = RGBColor(0x02, 0x84, 0xC7)
    c_dark = RGBColor(0x1E, 0x29, 0x3B)
    c_slate = RGBColor(0x64, 0x74, 0x8B)
    c_light_bg = RGBColor(0xF8, 0xFA, 0xFC)
    c_card_border = RGBColor(0xCB, 0xD5, 0xE1)
    c_white = RGBColor(0xFF, 0xFF, 0xFF)
    c_green = RGBColor(0x05, 0x96, 0x69)

    def add_header(slide, title, subtitle):
        # Header bar
        header_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.1))
        header_shape.fill.solid()
        header_shape.fill.fore_color.rgb = c_navy
        header_shape.line.color.rgb = c_navy

        tf = header_shape.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.margin_left = Inches(0.8)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = 'Arial'
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = c_white

        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.name = 'Arial'
        p2.font.size = Pt(11)
        p2.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)

        # Footer
        footer_p = slide.shapes.add_textbox(Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3)).text_frame.paragraphs[0]
        footer_p.text = "Insurance Claims & Policy Management Portal | Group 20 Individual Academic Submission | Shreyas Shinde"
        footer_p.font.name = 'Arial'
        footer_p.font.size = Pt(9)
        footer_p.font.color.rgb = c_slate

    def add_card(slide, left, top, width, height, title="", bg_color=c_light_bg, border_color=c_card_border):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.2)
        tf.margin_bottom = Inches(0.2)

        if title:
            p = tf.paragraphs[0]
            p.text = title
            p.font.name = 'Arial'
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = c_navy
            p.space_after = Pt(8)
        return tf

    # ==============================================================================
    # SLIDE 1: TITLE SLIDE
    # ==============================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = c_navy
    bg1.line.color.rgb = c_navy

    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.333), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "FINAL YEAR ACADEMIC PROJECT ASSESSMENT"
    p.font.name = 'Arial'
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(0x38, 0xBD, 0xF8)
    p.space_after = Pt(12)

    p = tf1.add_paragraph()
    p.text = "Insurance Claims & Policy Management Portal"
    p.font.name = 'Arial'
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = c_white
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "An Enterprise Full-Stack Web Application for Digital Policy Underwriting, Evidence Audit, and 6-Stage Claim Settlement Lifecycle"
    p.font.name = 'Arial'
    p.font.size = Pt(14)
    p.font.italic = True
    p.font.color.rgb = RGBColor(0xCB, 0xD5, 0xE1)
    p.space_after = Pt(40)

    # Info box on Slide 1
    info_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.8), Inches(11.333), Inches(1.8))
    info_card.fill.solid()
    info_card.fill.fore_color.rgb = RGBColor(0x13, 0x37, 0x5C)
    info_card.line.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

    itf = info_card.text_frame
    itf.word_wrap = True
    itf.margin_left = Inches(0.4)
    itf.margin_top = Inches(0.25)

    ip1 = itf.paragraphs[0]
    ip1.text = "Candidate Name: SHREYAS SHINDE          |          Project Group: GROUP 20 (INDIVIDUAL SUBMISSION)"
    ip1.font.name = 'Arial'
    ip1.font.size = Pt(14)
    ip1.font.bold = True
    ip1.font.color.rgb = c_white
    ip1.space_after = Pt(8)

    ip2 = itf.add_paragraph()
    ip2.text = "Department of Computer Science and Engineering  •  HCL Academic Collaboration Initiative  •  2026-2027"
    ip2.font.name = 'Arial'
    ip2.font.size = Pt(12)
    ip2.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
    ip2.space_after = Pt(6)

    ip3 = itf.add_paragraph()
    ip3.text = "Tech Stack: Angular 19 (Standalone)  •  Node.js / Express  •  TypeScript  •  Prisma ORM  •  SQLite  •  Chart.js"
    ip3.font.name = 'Arial'
    ip3.font.size = Pt(11)
    ip3.font.color.rgb = RGBColor(0x38, 0xBD, 0xF8)

    # ==============================================================================
    # SLIDE 2: MOTIVATION & PROBLEM STATEMENT
    # ==============================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Motivation & Problem Statement", "Key operational bottlenecks in conventional insurance claims administration")

    c1 = add_card(s2, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), "Legacy System Friction Points")
    points = [
        ("Excessive Turnaround Time (TAT):", "Traditional claims take 14 to 30 days due to physical paper courier transit and desk-level sign-offs."),
        ("Policyholder Opacity:", "Claimants lack real-time status visibility and cannot track verification milestones or missing document requests."),
        ("Vulnerability to Fraud:", "Overlapping date claims and requests exceeding active policy coverage limits slip through manual reviews."),
        ("Lack of Auditability:", "Spreadsheets and paper records lack cryptographic audit logs, risking arbitrary status alterations."),
        ("Delayed Reporting:", "Executive decision-makers depend on delayed monthly reports rather than live dynamic analytics.")
    ]
    for b, d in points:
        p = c1.add_paragraph()
        p.text = f"• {b} {d}"
        p.font.name = 'Arial'
        p.font.size = Pt(11)
        p.font.color.rgb = c_dark
        p.space_after = Pt(8)

    c2 = add_card(s2, Inches(6.8), Inches(1.5), Inches(5.6), Inches(5.2), "Industrial Impact & Solution Vision")
    sol_points = [
        ("Automated Processing:", "Replace manual courier cycles with instantaneous digital document uploads and automated validation."),
        ("Complete Transparency:", "Live 6-stage chronological audit timeline accessible to claimants 24/7."),
        ("Deterministic Business Rules:", "Hard database constraints enforce coverage ceilings, date boundaries, and duplicate checks."),
        ("Segregation of Duties:", "Clear role separation among Customers, Claim Officers, and Administrators."),
        ("Live Business Intelligence:", "Real-time computed dashboards with interactive Chart.js financial and operational analytics.")
    ]
    for b, d in sol_points:
        p = c2.add_paragraph()
        p.text = f"✔ {b} {d}"
        p.font.name = 'Arial'
        p.font.size = Pt(11)
        p.font.color.rgb = c_navy
        p.space_after = Pt(8)

    # ==============================================================================
    # SLIDE 3: PROJECT OBJECTIVES & SCOPE
    # ==============================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Project Objectives & Scope", "Concrete architectural deliverables and functional boundaries")

    c_obj = add_card(s3, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), "Primary Technical Objectives")
    objs = [
        "1. Build an enterprise Angular 19 SPA with standalone components, Angular Material, and an authoritative Navy Blue palette.",
        "2. Develop a robust RESTful API using Node.js, Express, and TypeScript with JWT auth and bcrypt hashing.",
        "3. Design a 3NF normalized SQLite database via Prisma ORM v6 with 9 entities and foreign key constraints.",
        "4. Implement a strict 6-stage claim lifecycle with immutable milestone audit tracking.",
        "5. Support digital evidence uploads (PDF, JPG, PNG <= 5MB) with server MIME verification.",
        "6. Compute live dashboard metrics from database records with 4 interactive Chart.js charts.",
        "7. Implement multi-filter claim search and instant one-click CSV export.",
        "8. Achieve 100% automated test pass rate across Jest/Supertest test suites."
    ]
    for o in objs:
        p = c_obj.add_paragraph()
        p.text = o
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    c_scp = add_card(s3, Inches(6.8), Inches(1.5), Inches(5.6), Inches(5.2), "Functional Boundaries & Scope")
    scps = [
        ("In-Scope Modules:", "• Customer registration, login, and profile management\n• Policy browsing across 5 domains (Health, Life, Vehicle, Home, Travel)\n• Online policy proposal underwriting & active policy instantiation\n• Claim filing with multi-file digital evidence\n• Officer verification workbench and audit remarks\n• Administrative claim settlement authorization\n• In-app notifications and system audit logs\n• Multi-filter reporting and CSV export"),
        ("Out-of-Scope (Academic Assumptions):", "• Live third-party payment gateway (simulated via verified NEFT records)\n• Computer Vision / OCR automated extraction of handwritten receipts\n• Physical GPS surveyor mobile dispatch")
    ]
    for t, content in scps:
        p = c_scp.add_paragraph()
        p.text = t
        p.font.name = 'Arial'
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = c_navy
        p.space_after = Pt(4)
        for line in content.split('\n'):
            pl = c_scp.add_paragraph()
            pl.text = line
            pl.font.name = 'Arial'
            pl.font.size = Pt(10)
            pl.font.color.rgb = c_dark
            pl.space_after = Pt(3)

    # ==============================================================================
    # SLIDE 4: SYSTEM ARCHITECTURE
    # ==============================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Enterprise 3-Tier System Architecture", "Decoupled presentation, business logic, and transactional persistence layers")

    col_w = Inches(3.64)
    # Tier 1
    t1 = add_card(s4, Inches(0.8), Inches(1.5), col_w, Inches(5.2), "1. Presentation Tier\n(Angular 19 SPA)")
    t1_items = [
        "• Framework: Angular 19.2 (Standalone)",
        "• State Management: Angular Signals",
        "• UI Library: Angular Material 19.2",
        "• Data Visualization: Chart.js 4.4",
        "• Security: Functional Auth & Role Guards",
        "• Interceptors: JWT Bearer & Error Handling",
        "• Styling: SCSS Enterprise Navy Blue Theme",
        "• Fully responsive for desktop, tablet, mobile"
    ]
    for it in t1_items:
        p = t1.add_paragraph()
        p.text = it
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # Tier 2
    t2 = add_card(s4, Inches(4.84), Inches(1.5), col_w, Inches(5.2), "2. Application Tier\n(Express TypeScript API)")
    t2_items = [
        "• Runtime: Node.js v26 / Express.js 4.21",
        "• Language: TypeScript 5.7 (Strict mode)",
        "• Authentication: JSON Web Tokens (JWT)",
        "• Password Security: bcryptjs salted hashing",
        "• Input Validation: Zod 3.24 schemas",
        "• File Uploads: Multer with MIME verification",
        "• Rate Limiting: express-rate-limit",
        "• 100% Server-side validation enforcement"
    ]
    for it in t2_items:
        p = t2.add_paragraph()
        p.text = it
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # Tier 3
    t3 = add_card(s4, Inches(8.88), Inches(1.5), col_w, Inches(5.2), "3. Persistence Tier\n(SQLite & Prisma ORM)")
    t3_items = [
        "• Database Engine: SQLite 3",
        "• Object-Relational Mapper: Prisma ORM v6",
        "• Schema Normalization: 3rd Normal Form (3NF)",
        "• Total Entities: 9 Normalized Tables",
        "• Integrity: Foreign Key cascades & constraints",
        "• ACID Guarantees: Full transaction support",
        "• Zero-config local execution without external DB server daemon",
        "• Pre-seeded with realistic test data"
    ]
    for it in t3_items:
        p = t3.add_paragraph()
        p.text = it
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # ==============================================================================
    # SLIDE 5: DATABASE SCHEMA & 9 NORMALIZED ENTITIES
    # ==============================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Relational Database Design (3NF)", "9 fully normalized entities managed with Prisma ORM and SQLite")

    entities = [
        ("Users", "id, name, email, passwordHash, role (ADMIN|OFFICER|CUSTOMER), phone, address, isActive"),
        ("Policies", "id, policyNumber, name, category (HEALTH|LIFE|VEHICLE|HOME|TRAVEL), premiumAmount, coverageAmount, durationMonths"),
        ("PolicyApplications", "id, applicationNumber, customerId, policyId, status (PENDING|APPROVED|REJECTED), nomineeName, annualIncome"),
        ("CustomerPolicies", "id, policyNumber, customerId, policyId, applicationId, startDate, endDate, coverageAmount, status (ACTIVE|EXPIRED)"),
        ("Claims", "id, claimNumber, customerId, customerPolicyId, policyId, incidentDate, claimAmount, approvedAmount, status, assignedOfficerId"),
        ("ClaimDocuments", "id, claimId, fileName, originalName, filePath, fileSize, mimeType, uploadedAt"),
        ("ClaimStatusHistory", "id, claimId, previousStatus, newStatus, changedById, remarks, createdAt"),
        ("Notifications", "id, userId, title, message, isRead, link, createdAt"),
        ("AuditLogs", "id, userId, action, entity, entityId, details, ipAddress, createdAt")
    ]

    for idx, (ent_name, ent_fields) in enumerate(entities):
        row = idx // 3
        col = idx % 3
        l = Inches(0.8 + col * 4.0)
        t = Inches(1.5 + row * 1.75)
        c = add_card(s5, l, t, Inches(3.75), Inches(1.6), f"Entity: {ent_name}")
        p = c.add_paragraph()
        p.text = ent_fields
        p.font.name = 'Arial'
        p.font.size = Pt(9)
        p.font.color.rgb = c_dark

    # ==============================================================================
    # SLIDE 6: 6-STAGE CLAIM SETTLEMENT LIFECYCLE
    # ==============================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Automated 6-Stage Claim Settlement Lifecycle", "Deterministic state progression, segregation of duties, and audit tracking")

    stages = [
        ("1. SUBMITTED", "Customer files claim against active policy with incident details & uploaded evidence.", c_navy),
        ("2. UNDER REVIEW", "Officer is assigned, verifies eligibility, examines evidence, cross-checks limits.", c_blue),
        ("3. DOCS REQUIRED", "Officer requests missing hospital bills or repair estimates; customer uploads files.", RGBColor(0xD9, 0x77, 0x06)),
        ("4. APPROVED", "Officer or Admin validates authenticity and approves payout sum within coverage limit.", c_green),
        ("5. REJECTED", "Insurer rejects invalid/ineligible claim with mandatory documented reason.", RGBColor(0xDC, 0x26, 0x26)),
        ("6. SETTLED", "Administrator finalizes fund disbursement and records disbursement timestamp.", RGBColor(0x04, 0x78, 0x57))
    ]

    for idx, (st_name, st_desc, st_color) in enumerate(stages):
        row = idx // 3
        col = idx % 3
        l = Inches(0.8 + col * 4.0)
        t = Inches(1.5 + row * 2.6)
        c = add_card(s6, l, t, Inches(3.75), Inches(2.35), st_name)
        p = c.add_paragraph()
        p.text = st_desc
        p.font.name = 'Arial'
        p.font.size = Pt(11)
        p.font.color.rgb = c_dark
        p.space_after = Pt(8)

        p2 = c.add_paragraph()
        p2.text = "Audit: Immutable entry logged in ClaimStatusHistory"
        p2.font.name = 'Arial'
        p2.font.size = Pt(9.5)
        p2.font.italic = True
        p2.font.color.rgb = c_slate

    # ==============================================================================
    # SLIDE 7: BUSINESS RULES & FRAUD PREVENTION ENGINE
    # ==============================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Business Rules & Fraud Prevention Engine", "Server-side domain constraints enforced synchronously on every transaction")

    c_rules1 = add_card(s7, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), "Synchronous Domain Validation Rules")
    r_items = [
        ("1. Active Policy Enforcement:", "Claims can strictly only be submitted against policies in ACTIVE status."),
        ("2. Incident Date Boundaries:", "The incident date must be on or after the policy startDate and on or before endDate, not in the future."),
        ("3. Coverage Limit Ceiling:", "Claim amount cannot exceed policy coverageAmount. Excess amounts are rejected with HTTP 400."),
        ("4. Positive Claim Amounts:", "Amounts must be strictly positive (> 0); zero or negative values trigger Zod validation error."),
        ("5. Duplicate Date Prevention:", "Blocks filing multiple claims against the same policy on the same incident date."),
        ("6. Mandatory Rejection Reason:", "Officers/Admins cannot reject a claim without stating documented legal grounds.")
    ]
    for title, desc in r_items:
        p = c_rules1.add_paragraph()
        p.text = f"• {title} {desc}"
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    c_rules2 = add_card(s7, Inches(6.8), Inches(1.5), Inches(5.6), Inches(5.2), "Code Implementation Snapshot")
    code_snippet = (
        "// Validating coverage limit & duplicate in claim.controller.ts\n\n"
        "const customerPolicy = await prisma.customerPolicy.findUnique({\n"
        "  where: { id: data.customerPolicyId },\n"
        "  include: { policy: true }\n"
        "});\n\n"
        "if (!customerPolicy || customerPolicy.status !== 'ACTIVE') {\n"
        "  return res.status(400).json({\n"
        "    success: false,\n"
        "    message: 'Only ACTIVE policies are eligible.'\n"
        "  });\n"
        "}\n\n"
        "if (data.claimAmount > customerPolicy.coverageAmount) {\n"
        "  return res.status(400).json({\n"
        "    success: false,\n"
        "    message: `Claim exceeds coverage of ₹${customerPolicy.coverageAmount}`\n"
        "  });\n"
        "}\n\n"
        "const duplicate = await prisma.claim.findFirst({\n"
        "  where: {\n"
        "    customerPolicyId: data.customerPolicyId,\n"
        "    incidentDate: incidentDateObj,\n"
        "    status: { notIn: ['REJECTED'] }\n"
        "  }\n"
        "});\n"
        "if (duplicate) return res.status(409).json({ message: 'Duplicate claim' });"
    )
    p = c_rules2.add_paragraph()
    p.text = code_snippet
    p.font.name = 'Courier'
    p.font.size = Pt(8.5)
    p.font.color.rgb = c_navy

    # ==============================================================================
    # SLIDE 8: USER ROLES & SEGREGATION OF DUTIES
    # ==============================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Role-Based Access Control & Segregation of Duties", "Strict permission boundaries enforced across client guards and server middleware")

    r_w = Inches(3.64)
    # Customer Role
    rc = add_card(s8, Inches(0.8), Inches(1.5), r_w, Inches(5.2), "CUSTOMER ROLE\n(Policyholder)")
    c_list = [
        "• Self-registration & JWT login",
        "• Browse 5 policy categories",
        "• Apply for policy proposals online",
        "• View active policy schedules",
        "• File claims & upload documents",
        "• Upload requested additional docs",
        "• Live 6-stage status tracking",
        "• Isolated to own records only (cannot view other users' data)"
    ]
    for it in c_list:
        p = rc.add_paragraph()
        p.text = it
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # Officer Role
    ro = add_card(s8, Inches(4.84), Inches(1.5), r_w, Inches(5.2), "INSURANCE OFFICER\n(Claims Adjuster)")
    o_list = [
        "• Review assigned & unassigned queues",
        "• Inspect claim details & evidence",
        "• Download & stream uploaded docs",
        "• Request additional documentation",
        "• Append internal review notes",
        "• Recommend approval or rejection",
        "• Cannot create/deactivate policies",
        "• Cannot authorize final settlements (Admin privilege only)"
    ]
    for it in o_list:
        p = ro.add_paragraph()
        p.text = it
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # Admin Role
    ra = add_card(s8, Inches(8.88), Inches(1.5), r_w, Inches(5.2), "ADMINISTRATOR\n(Executive Underwriter)")
    a_list = [
        "• Complete administrative authority",
        "• Create, edit, deactivate policies",
        "• Underwrite & approve proposals",
        "• Assign claims to officers",
        "• Authorize final claim settlements",
        "• Manage staff accounts & roles",
        "• View live executive Chart.js metrics",
        "• Export compliance CSV audit reports"
    ]
    for it in a_list:
        p = ra.add_paragraph()
        p.text = it
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # ==============================================================================
    # SLIDE 9: DIGITAL EVIDENCE & DOCUMENT MANAGEMENT
    # ==============================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Digital Evidence & Document Management", "Secure multi-format file ingestion, MIME validation, and controlled streaming")

    c_doc1 = add_card(s9, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), "Upload Architecture & Ingestion Rules")
    doc_rules = [
        ("Supported Formats:", "PDF, JPG, JPEG, and PNG files."),
        ("File Size Ceiling:", "Strict 5 MB limit per individual document."),
        ("MIME-Type Verification:", "Validates true file headers on server; rejects renamed executables (.exe, .bat, .sh)."),
        ("Unique Cryptographic Naming:", "Files renamed with UUID and timestamp prefixes to prevent filesystem collisions."),
        ("Storage Segregation:", "Stored in dedicated server `./uploads` directory outside web root."),
        ("Metadata Persistence:", "Original name, size, MIME type, and disk path recorded in ClaimDocument entity."),
        ("Secure Streaming:", "Served via authenticated streaming endpoint `/api/documents/:id` with proper Content-Disposition headers.")
    ]
    for t, d in doc_rules:
        p = c_doc1.add_paragraph()
        p.text = f"• {t} {d}"
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    c_doc2 = add_card(s9, Inches(6.8), Inches(1.5), Inches(5.6), Inches(5.2), "Document Review Interface")
    p = c_doc2.add_paragraph()
    p.text = "Claims Officer Evidence Verification Workbench:"
    p.font.name = 'Arial'
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy
    p.space_after = Pt(6)

    wf_steps = [
        "1. Customer uploads medical bill, FIR, or repair estimate during submission.",
        "2. Server saves file, validates MIME type, and records database link.",
        "3. Claim dossier renders interactive document preview chips.",
        "4. Officer clicks document chip to inspect full-size image or PDF in new tab.",
        "5. If illegible or incomplete, officer triggers 'Request Documents' transition.",
        "6. Customer receives notification and uploads supplementary bills directly on the claim detail page."
    ]
    for s in wf_steps:
        p = c_doc2.add_paragraph()
        p.text = s
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(5)

    # ==============================================================================
    # SLIDE 10: REAL-TIME DASHBOARDS & CHART.JS
    # ==============================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Real-Time Dashboards & Chart.js Analytics", "Computed live from database records without mock data or static numbers")

    c_ch1 = add_card(s10, Inches(0.8), Inches(1.5), Inches(5.6), Inches(2.4), "1. Monthly Claims Inflow (Bar Chart)")
    p = c_ch1.add_paragraph()
    p.text = "Aggregates total claim volume month-by-month directly from SQLite timestamps to track claim volume trends and seasonality."
    p.font.name = 'Arial'
    p.font.size = Pt(10)
    p.font.color.rgb = c_dark

    c_ch2 = add_card(s10, Inches(6.8), Inches(1.5), Inches(5.6), Inches(2.4), "2. Claims by Status (Doughnut Chart)")
    p = c_ch2.add_paragraph()
    p.text = "Visualizes operational distribution across all 6 lifecycle stages: Submitted, Under Review, Docs Required, Approved, Rejected, Settled."
    p.font.name = 'Arial'
    p.font.size = Pt(10)
    p.font.color.rgb = c_dark

    c_ch3 = add_card(s10, Inches(0.8), Inches(4.2), Inches(5.6), Inches(2.5), "3. Category Distribution (Pie Chart)")
    p = c_ch3.add_paragraph()
    p.text = "Displays proportion of active policies and claims across the 5 insurance domains: Health, Life, Vehicle, Home, and Travel."
    p.font.name = 'Arial'
    p.font.size = Pt(10)
    p.font.color.rgb = c_dark

    c_ch4 = add_card(s10, Inches(6.8), Inches(4.2), Inches(5.6), Inches(2.5), "4. Monthly Financial Comparison (Line Chart)")
    p = c_ch4.add_paragraph()
    p.text = "Compares total claimed financial exposure (₹) against actual approved / settled disbursements (₹) to assess loss ratios."
    p.font.name = 'Arial'
    p.font.size = Pt(10)
    p.font.color.rgb = c_dark

    # ==============================================================================
    # SLIDE 11: QUALITY ASSURANCE & AUTOMATED TESTING
    # ==============================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Quality Assurance & Automated Test Results", "100% automated test passage across Jest/Supertest suite & Angular production build")

    c_t1 = add_card(s11, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), "Automated Integration Test Matrix")
    p = c_t1.add_paragraph()
    p.text = "Execution Results (PASS 21 / 21 Tests - 100%):"
    p.font.name = 'Arial'
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_green
    p.space_after = Pt(6)

    t_recs = [
        ("TC-AUTH-01 to 04", "Registration, bcrypt hashing, JWT issuance, profile protection"),
        ("TC-POL-01 to 04", "Public catalog listing, admin creation, RBAC 403 block"),
        ("TC-CLM-01 to 07", "Active policy validation, coverage limit ceiling, duplicate date check, status transitions, mandatory rejection reason, settlement"),
        ("TC-DASH-01 to 03", "Customer, Officer, and Admin live database metric calculations"),
        ("TC-REP-01 to 02", "Multi-parameter filter query & valid CSV attachment export"),
        ("TC-SYS-01", "Server online health check & SQLite DB connectivity")
    ]
    for tid, tdesc in t_recs:
        p = c_t1.add_paragraph()
        p.text = f"✔ {tid}: {tdesc}"
        p.font.name = 'Arial'
        p.font.size = Pt(9.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(4)

    c_t2 = add_card(s11, Inches(6.8), Inches(1.5), Inches(5.6), Inches(5.2), "Production Build Verification")
    p = c_t2.add_paragraph()
    p.text = "Frontend Production Compilation (ng build):"
    p.font.name = 'Arial'
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = c_navy
    p.space_after = Pt(4)

    b_details = [
        "• Framework: Angular 19.2 Standalone",
        "• Compilation Time: 5.08 seconds",
        "• Raw Initial Bundle Size: 792.29 kB (optimized)",
        "• Lazy Loaded Route Chunks: 12 discrete chunks",
        "• Font Inlining: Configured offline-safe",
        "• TypeScript Compilation (tsc): Zero errors, exit code 0",
        "• Database Migrations: Zero pending migrations",
        "• Production Readiness: 100% verified"
    ]
    for b in b_details:
        p = c_t2.add_paragraph()
        p.text = b
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark
        p.space_after = Pt(5)

    # ==============================================================================
    # SLIDE 12: ENGINEERING CHALLENGES & SOLUTIONS
    # ==============================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Engineering Challenges & Technical Solutions", "Key architectural hurdles solved during full-stack development")

    ch_list = [
        ("1. Express 5 Parameter Typing vs Prisma Overloads",
         "Express 5 types req.params.id as string | string[] | undefined. Passing this into prisma.findUnique caused TypeScript compilation errors with relations.\nSolution: Implemented explicit string type narrowing (const id = req.params.id as string;)."),
        ("2. Offline Angular Build & Google Font Inlining",
         "Angular 19 enables Google Font inlining by default, attempting network fetches during production build and failing in isolated environments.\nSolution: Configured optimization.fonts.inline: false in angular.json for 100% offline compilation."),
        ("3. Strict Claim State Transition Enforcement",
         "Preventing unauthorized status leaps (e.g. jumping directly from SUBMITTED to SETTLED without approval).\nSolution: Implemented a transition state matrix in claim.controller.ts returning HTTP 400 Bad Request on invalid jumps."),
        ("4. Segregation of Duties for Claim Settlements",
         "Officers should evaluate claims but must not possess permission to finalize fund disbursements.\nSolution: Separated officer review endpoints from admin-only settlement endpoints using roleGuard middleware.")
    ]

    for idx, (title, body) in enumerate(ch_list):
        row = idx // 2
        col = idx % 2
        l = Inches(0.8 + col * 6.0)
        t = Inches(1.5 + row * 2.6)
        c = add_card(s12, l, t, Inches(5.7), Inches(2.35), title)
        p = c.add_paragraph()
        p.text = body
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark

    # ==============================================================================
    # SLIDE 13: LIVE DEMONSTRATION WORKFLOW
    # ==============================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "End-to-End Live Demonstration Workflow", "Verification path covering all 3 roles and 20 working application pages")

    demo_steps = [
        ("Step 1: Public Catalog & Registration", "User discovers health policy, registers account, and logs in with JWT authentication."),
        ("Step 2: Policy Proposal Application", "Customer submits policy proposal with nominee and income disclosures; status becomes PENDING."),
        ("Step 3: Administrative Underwriting", "Administrator approves proposal; CustomerPolicy is instantiated with active dates & policy number."),
        ("Step 4: Claim Submission with Evidence", "Customer submits reimbursement claim with incident date, amount, description, and PDF/images."),
        ("Step 5: Officer Review Workbench", "Assigned officer verifies evidence, requests missing documents or recommends approval."),
        ("Step 6: Administrative Settlement", "Admin reviews approved claim, executes fund disbursement, and marks claim as SETTLED."),
        ("Step 7: Real-Time Analytics & CSV Export", "Admin views updated Chart.js visualizations and exports filtered claims to formatted CSV file.")
    ]

    c_dm = add_card(s13, Inches(0.8), Inches(1.5), Inches(11.733), Inches(5.2), "Complete System Lifecycle Demonstration Flow")
    for s_title, s_desc in demo_steps:
        p = c_dm.add_paragraph()
        p.text = f"▶ {s_title} — {s_desc}"
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(6)

    # ==============================================================================
    # SLIDE 14: VIVA VOCE DEFENSE & TALKING POINTS
    # ==============================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, "Key Viva Voce Defense Points", "Authoritative architectural answers for external academic examiners")

    qa_points = [
        ("Q: Why Angular 19 over React / Vue for this enterprise portal?",
         "A: Angular provides an opinionated, enterprise-ready architecture out-of-the-box: native Dependency Injection, TypeScript-first typing, Angular Signals for fine-grained reactivity, built-in Reactive Forms, and robust route guards without fragmented 3rd-party dependencies."),
        ("Q: How does the system prevent claims fraud?",
         "A: Multi-tier synchronous validation: 1) Active policy check, 2) Incident date boundaries, 3) Coverage limit ceiling, 4) Duplicate date prevention, and 5) Mandatory documented rejection reasons."),
        ("Q: Why SQLite and Prisma ORM instead of MongoDB or external PostgreSQL?",
         "A: Insurance policies and claims require strict ACID compliance and referential integrity (foreign keys). Prisma ORM provides type-safe queries and automatic schema migrations. SQLite delivers zero-latency local relational persistence with zero external server dependencies."),
        ("Q: How is segregation of duties enforced between Officer and Admin?",
         "A: Officers are restricted to claim assessment, document requests, and recommendations. Administrators exclusively hold permissions for policy creation, proposal underwriting, and final financial settlement.")
    ]

    for idx, (q, a) in enumerate(qa_points):
        row = idx // 2
        col = idx % 2
        l = Inches(0.8 + col * 6.0)
        t = Inches(1.5 + row * 2.6)
        c = add_card(s14, l, t, Inches(5.7), Inches(2.35), q)
        p = c.add_paragraph()
        p.text = a
        p.font.name = 'Arial'
        p.font.size = Pt(10)
        p.font.color.rgb = c_dark

    # ==============================================================================
    # SLIDE 15: CONCLUSION & FUTURE ENHANCEMENTS
    # ==============================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_header(s15, "Conclusion & Future Enhancements", "Summary of project achievements and prospective industrial expansions")

    c_con = add_card(s15, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2), "Project Conclusions")
    con_pts = [
        "• Successfully engineered a complete, production-quality Insurance Claims & Policy Management Portal.",
        "• Fully compliant with college academic guidelines as an individual submission for Group 20.",
        "• Eliminated manual friction across policy browsing, application, claim filing, and settlement.",
        "• Implemented 20 working pages with 0 mock responses and sub-50ms API performance.",
        "• 100% automated test pass rate (21/21 Jest tests) and clean Angular production build.",
        "• Delivered exhaustive academic documentation: 18-chapter DOCX report, PDF report, presentation slides, and batch scripts."
    ]
    for cp in con_pts:
        p = c_con.add_paragraph()
        p.text = cp
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_dark
        p.space_after = Pt(8)

    c_fut = add_card(s15, Inches(6.8), Inches(1.5), Inches(5.6), Inches(5.2), "Future Roadmap")
    fut_pts = [
        ("WebSockets (Socket.io):", "Instant real-time push notifications for officers and claimants."),
        ("OCR AI Bill Ingestion:", "Computer Vision extraction of hospital invoices and repair totals directly from uploaded PDFs."),
        ("Payment Gateway Integration:", "Razorpay / Stripe integration for instant digital customer premium payments."),
        ("Surveyor Geolocation Mobile App:", "Field inspector mobile app with GPS-tagged damage photo uploads.")
    ]
    for t, d in fut_pts:
        p = c_fut.add_paragraph()
        p.text = f"• {t} {d}"
        p.font.name = 'Arial'
        p.font.size = Pt(10.5)
        p.font.color.rgb = c_navy
        p.space_after = Pt(8)

    # Save Presentation to both locations
    out_pptx_1 = os.path.join(os.getcwd(), 'project-presentation.pptx')
    prs.save(out_pptx_1)
    print(f"Presentation saved successfully at: {out_pptx_1}")

    docs_dir = os.path.join(os.getcwd(), 'Insurance-Claims-Portal', 'docs')
    if os.path.exists(docs_dir):
        out_pptx_2 = os.path.join(docs_dir, 'project-presentation.pptx')
        prs.save(out_pptx_2)
        print(f"Presentation copied to: {out_pptx_2}")

if __name__ == '__main__':
    create_presentation()


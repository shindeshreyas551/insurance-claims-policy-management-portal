import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('screenshots', exist_ok=True)

# Helper to draw professional application UI representations
def create_ui_screen(filename, title, subtitle, role, content_blocks):
    width, height = 1200, 750
    img = Image.new('RGB', (width, height), '#f8fafc')
    draw = ImageDraw.Draw(img)

    # 1. Top Navbar (Navy #0f2b48)
    draw.rectangle([0, 0, width, 60], fill='#0f2b48')
    draw.rectangle([20, 15, 50, 45], fill='#1e40af') # Logo box
    draw.text((60, 20), "SecureGuard — Insurance Claims & Policy Portal", fill='#ffffff')
    draw.text((width - 320, 22), f"Logged in as: {role} (Demo)", fill='#93c5fd')
    draw.rectangle([width - 80, 15, width - 20, 45], fill='#dc2626')
    draw.text((width - 70, 22), "Logout", fill='#ffffff')

    # 2. Sidebar (Dark Navy #0a1c30)
    draw.rectangle([0, 60, 220, height], fill='#0a1c30')
    menu_items = [
        "Dashboard", "Browse Policies", "My Policies", 
        "File Claim", "My Claims", "Notifications", 
        "Reports & Export", "User Management", "Audit Logs", "Profile"
    ]
    y_pos = 90
    for idx, item in enumerate(menu_items):
        if idx == 0:
            draw.rectangle([10, y_pos - 6, 210, y_pos + 26], fill='#1d4ed8')
            draw.text((30, y_pos), f"• {item}", fill='#ffffff')
        else:
            draw.text((30, y_pos), f"  {item}", fill='#94a3b8')
        y_pos += 42

    draw.rectangle([10, height - 70, 210, height - 15], fill='#162f4d')
    draw.text((25, height - 60), "Group 20 Project", fill='#60a5fa')
    draw.text((25, height - 42), "Angular 19 + SQLite", fill='#94a3b8')

    # 3. Main Header Area
    draw.text((250, 80), title, fill='#0f2b48')
    draw.text((250, 110), subtitle, fill='#64748b')
    draw.line([250, 135, width - 40, 135], fill='#e2e8f0', width=1)

    # 4. Render Content Cards / Table
    content_blocks(draw, 250, 155, width - 290, height - 180)

    img.save(os.path.join('screenshots', filename), 'PNG')
    print(f"Generated: {filename}")

# Block 1: Customer Dashboard
def draw_customer_dash(draw, x, y, w, h):
    # Welcome banner
    draw.rectangle([x, y, x + w, y + 80], fill='#0f2b48')
    draw.text((x + 20, y + 15), "Welcome back, Shreyas Shinde (Customer ID: CUST-8891)", fill='#ffffff')
    draw.text((x + 20, y + 45), "Manage your active coverage portfolios and track claim reimbursements.", fill='#cbd5e1')
    
    # 4 Stat Cards
    card_w = (w - 45) // 4
    stats = [
        ("ACTIVE POLICIES", "2", "#eff6ff", "#1d4ed8"),
        ("TOTAL CLAIMS", "3", "#f5f3ff", "#7c3aed"),
        ("PENDING REVIEW", "1", "#fffbeb", "#d97706"),
        ("TOTAL DISBURSED", "₹1,75,000", "#ecfdf5", "#059669")
    ]
    for i, (lbl, val, bg, col) in enumerate(stats):
        cx = x + i * (card_w + 15)
        cy = y + 100
        draw.rectangle([cx, cy, cx + card_w, cy + 90], fill='#ffffff', outline='#e2e8f0', width=1)
        draw.rectangle([cx + 10, cy + 10, cx + 45, cy + 45], fill=bg)
        draw.text((cx + 55, cy + 15), lbl, fill='#64748b')
        draw.text((cx + 55, cy + 40), val, fill=col)

    # Recent Claims Table
    ty = y + 215
    draw.rectangle([x, ty, x + w, ty + 280], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.text((x + 20, ty + 15), "Recent Claims Activity & Live Status", fill='#0f2b48')
    draw.line([x, ty + 45, x + w, ty + 45], fill='#e2e8f0', width=1)

    headers = ["Claim Number", "Policy Name", "Incident Date", "Claim Amount", "Current Status", "Action"]
    hx = [x + 20, x + 160, x + 380, x + 510, x + 640, x + 790]
    for i, hname in enumerate(headers):
        draw.text((hx[i], ty + 55), hname, fill='#64748b')
    draw.line([x, ty + 80, x + w, ty + 80], fill='#e2e8f0', width=1)

    claims_sample = [
        ("CLM-2026-006", "CareShield Health Plan", "2026-10-12", "₹1,80,000", "SETTLED", "#0d9488"),
        ("CLM-2026-002", "DriveSafe Four-Wheeler", "2026-10-26", "₹32,000", "UNDER REVIEW", "#d97706"),
        ("CLM-2026-003", "CareShield Health Plan", "2026-10-22", "₹85,000", "DOCS REQUIRED", "#7c3aed"),
        ("CLM-2026-001", "CareShield Health Plan", "2026-10-29", "₹45,000", "SUBMITTED", "#0284c7"),
    ]
    ry = ty + 95
    for cno, pol, dt, amt, st, col in claims_sample:
        draw.text((hx[0], ry), cno, fill='#0f2b48')
        draw.text((hx[1], ry), pol, fill='#334155')
        draw.text((hx[2], ry), dt, fill='#64748b')
        draw.text((hx[3], ry), amt, fill='#0f2b48')
        draw.rectangle([hx[4] - 5, ry - 3, hx[4] + 110, ry + 18], fill=col)
        draw.text((hx[4], ry), st, fill='#ffffff')
        draw.rectangle([hx[5], ry - 3, hx[5] + 65, ry + 18], fill='#f1f5f9', outline='#cbd5e1')
        draw.text((hx[5] + 8, ry), "Inspect", fill='#0f2b48')
        ry += 42

# Block 2: Admin Dashboard & Charts
def draw_admin_dash(draw, x, y, w, h):
    # 6 Stats Cards
    card_w = (w - 40) // 4
    stats = [
        ("CUSTOMERS", "3", "#eff6ff", "#1d4ed8"),
        ("OFFICERS", "2", "#f5f3ff", "#7c3aed"),
        ("POLICIES", "8", "#fffbeb", "#d97706"),
        ("TOTAL CLAIMS", "6", "#fef2f2", "#e11d48")
    ]
    for i, (lbl, val, bg, col) in enumerate(stats):
        cx = x + i * (card_w + 13)
        draw.rectangle([cx, y, cx + card_w, y + 70], fill='#ffffff', outline='#e2e8f0', width=1)
        draw.text((cx + 15, y + 12), lbl, fill='#64748b')
        draw.text((cx + 15, y + 35), val, fill=col)

    # 2 Charts Visualizations Representation
    chart_y = y + 90
    half_w = (w - 20) // 2

    # Chart 1: Monthly Claims Trend
    draw.rectangle([x, chart_y, x + half_w, chart_y + 200], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.text((x + 15, chart_y + 12), "Monthly Claims Inflow (Trend Line)", fill='#0f2b48')
    # Draw sample chart axes & curve
    draw.line([x + 40, chart_y + 160, x + half_w - 20, chart_y + 160], fill='#cbd5e1', width=1)
    draw.line([x + 40, chart_y + 50, x + 40, chart_y + 160], fill='#cbd5e1', width=1)
    points = [(x + 60, chart_y + 140), (x + 130, chart_y + 120), (x + 200, chart_y + 130), 
              (x + 270, chart_y + 80), (x + 340, chart_y + 100), (x + 410, chart_y + 60)]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill='#1d4ed8', width=3)
        draw.ellipse([points[i][0]-4, points[i][1]-4, points[i][0]+4, points[i][1]+4], fill='#1d4ed8')
    draw.ellipse([points[-1][0]-4, points[-1][1]-4, points[-1][0]+4, points[-1][1]+4], fill='#1d4ed8')
    draw.text((x + 60, chart_y + 170), "Jun     Jul     Aug     Sep     Oct     Nov", fill='#94a3b8')

    # Chart 2: Status Breakdown (Donut)
    draw.rectangle([x + half_w + 20, chart_y, x + w, chart_y + 200], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.text((x + half_w + 35, chart_y + 12), "Claims Status Distribution", fill='#0f2b48')
    cx, cy = x + half_w + 120, chart_y + 115
    draw.ellipse([cx - 55, cy - 55, cx + 55, cy + 55], fill='#38bdf8', outline='#ffffff', width=2)
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill='#ffffff')
    draw.text((x + half_w + 220, chart_y + 60), "■ Submitted (1)", fill='#38bdf8')
    draw.text((x + half_w + 220, chart_y + 85), "■ Under Review (2)", fill='#f59e0b')
    draw.text((x + half_w + 220, chart_y + 110), "■ Approved (1)", fill='#10b981')
    draw.text((x + half_w + 220, chart_y + 135), "■ Settled (1)", fill='#0d9488')
    draw.text((x + half_w + 220, chart_y + 160), "■ Rejected (1)", fill='#ef4444')

    # Financial Summary Bar
    fy = chart_y + 215
    draw.rectangle([x, fy, x + w, fy + 80], fill='#0f2b48')
    draw.text((x + 20, fy + 15), "System Financials: Total Claimed Value vs Disbursed Settlements", fill='#ffffff')
    draw.text((x + 20, fy + 45), "Claimed: ₹5,80,000   |   Approved: ₹2,10,000   |   Settled via NEFT: ₹1,75,000", fill='#60a5fa')

# Block 3: Claim Dossier & Timeline
def draw_claim_detail(draw, x, y, w, h):
    # Top banner
    draw.rectangle([x, y, x + w, y + 70], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.rectangle([x + 15, y + 15, x + 130, y + 35], fill='#fef3c7')
    draw.text((x + 22, y + 18), "UNDER REVIEW", fill='#b45309')
    draw.text((x + 150, y + 18), "Claim CLM-2026-002 — Vehicle Damage Collision", fill='#0f2b48')
    draw.text((x + 15, y + 42), "Policy: DriveSafe Four-Wheeler (CP-VEH-2026-4412) | Max Cover: ₹8,00,000", fill='#64748b')
    draw.text((x + w - 160, y + 25), "₹32,000", fill='#1d4ed8')

    # Grid: Details + Timeline
    col1_w = int(w * 0.6)
    col2_w = w - col1_w - 20

    # Incident Narrative
    ny = y + 85
    draw.rectangle([x, ny, x + col1_w, ny + 150], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.text((x + 15, ny + 12), "Incident Narrative & Disclosures", fill='#0f2b48')
    draw.text((x + 15, ny + 40), "Incident Date: 2026-10-26 ( stationary rear bumper impact )", fill='#475569')
    draw.text((x + 15, ny + 65), "Description: Rear bumper and tail-light damage in authorized office basement.", fill='#64748b')
    draw.text((x + 15, ny + 90), "Workshop Estimate: ₹32,000 (Authorized Honda Service Centre).", fill='#64748b')
    draw.text((x + 15, ny + 115), "Officer Notes: Contacted repair manager to verify itemized part invoices.", fill='#b45309')

    # Supporting Docs
    dy = ny + 165
    draw.rectangle([x, dy, x + col1_w, dy + 140], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.text((x + 15, dy + 12), "Supporting Digital Evidence (Uploaded Documents)", fill='#0f2b48')
    draw.rectangle([x + 15, dy + 45, x + col1_w - 15, dy + 85], fill='#f8fafc', outline='#cbd5e1')
    draw.text((x + 30, dy + 55), "📄 HondaCity_RearBumper_Damage.jpg (982 KB)", fill='#0f2b48')
    draw.rectangle([x + col1_w - 120, dy + 52, x + col1_w - 30, dy + 78], fill='#1d4ed8')
    draw.text((x + col1_w - 105, dy + 57), "View File", fill='#ffffff')

    # Right Col: Audit Timeline
    ty = y + 85
    tx = x + col1_w + 20
    draw.rectangle([tx, ty, tx + col2_w, ty + 305], fill='#ffffff', outline='#e2e8f0', width=1)
    draw.text((tx + 15, ty + 12), "Chronological Audit Trail", fill='#0f2b48')
    draw.line([tx + 15, ty + 35, tx + col2_w - 15, ty + 35], fill='#e2e8f0')

    timeline = [
        ("SUBMITTED", "Customer Shreyas Shinde", "10:14 AM, Oct 26", "Initial submission with invoice."),
        ("UNDER REVIEW", "Officer Rajesh Sharma", "02:30 PM, Oct 27", "Technical estimate cross-check."),
        ("INSPECTION", "Officer Rajesh Sharma", "11:15 AM, Oct 28", "Workshop verification cleared.")
    ]
    t_step_y = ty + 50
    for st, who, tm, note in timeline:
        draw.ellipse([tx + 15, t_step_y, tx + 27, t_step_y + 12], fill='#1d4ed8')
        draw.text((tx + 35, t_step_y), f"{st} — {who}", fill='#0f2b48')
        draw.text((tx + 35, t_step_y + 18), tm, fill='#94a3b8')
        draw.text((tx + 35, t_step_y + 35), note, fill='#64748b')
        t_step_y += 70

# Block 4: Policy Catalog
def draw_policy_catalog(draw, x, y, w, h):
    # Filter Tabs
    tabs = ["All Plans", "Health (2)", "Life (2)", "Vehicle (2)", "Home (1)", "Travel (1)"]
    tx = x
    for i, t in enumerate(tabs):
        tw = 90 if i > 0 else 75
        fill = '#0f2b48' if i == 0 else '#ffffff'
        text_fill = '#ffffff' if i == 0 else '#475569'
        draw.rectangle([tx, y, tx + tw, y + 32], fill=fill, outline='#cbd5e1')
        draw.text((tx + 10, y + 8), t, fill=text_fill)
        tx += tw + 10

    # Policy Cards Grid (2x2)
    policies = [
        ("CareShield Comprehensive Health", "HEALTH", "₹5,00,000", "₹12,500/yr", "12 Mo", "Age 18-65. Cashless in 6,000+ network."),
        ("SecureFuture Term Life Plan", "LIFE", "₹50,00,000", "₹18,000/yr", "120 Mo", "Pure term life protection. Income >= ₹3 Lakhs."),
        ("DriveSafe Comprehensive Car", "VEHICLE", "₹8,00,000", "₹9,500/yr", "12 Mo", "Zero depreciation bumper-to-bumper cover."),
        ("HomeHaven Property Shield", "HOME", "₹40,00,000", "₹8,500/yr", "36 Mo", "Protection for residential structure & contents.")
    ]
    pw = (w - 20) // 2
    for i, (name, cat, cov, prem, dur, elig) in enumerate(policies):
        row = i // 2
        col = i % 2
        cx = x + col * (pw + 20)
        cy = y + 50 + row * 175
        draw.rectangle([cx, cy, cx + pw, cy + 160], fill='#ffffff', outline='#e2e8f0', width=1)
        draw.rectangle([cx + 15, cy + 12, cx + 75, cy + 30], fill='#eff6ff')
        draw.text((cx + 20, cy + 15), cat, fill='#1d4ed8')
        draw.text((cx + 15, cy + 40), name, fill='#0f2b48')
        draw.text((cx + 15, cy + 68), f"Coverage: {cov}   |   Premium: {prem}   |   {dur}", fill='#16a34a')
        draw.text((cx + 15, cy + 95), f"Eligibility: {elig}", fill='#64748b')
        draw.rectangle([cx + 15, cy + 122, cx + 110, cy + 148], fill='#f1f5f9', outline='#cbd5e1')
        draw.text((cx + 30, cy + 127), "View Plan", fill='#0f2b48')
        draw.rectangle([cx + 125, cy + 122, cx + 220, cy + 148], fill='#1d4ed8')
        draw.text((cx + 145, cy + 127), "Apply Now", fill='#ffffff')

# Generate Screenshots
create_ui_screen("01_customer_dashboard.png", "Customer Self-Service Portal", "Policyholder overview of active covers & claim lifecycles", "Customer", draw_customer_dash)
create_ui_screen("02_admin_dashboard.png", "Executive Administrative Analytics", "Real-time Chart.js visual aggregations and compliance metrics", "Administrator", draw_admin_dash)
create_ui_screen("03_claim_detail_workflow.png", "Claim Dossier & 6-Stage Timeline", "Supporting evidence verification and chronological audit trail", "Officer / Admin", draw_claim_detail)
create_ui_screen("04_policy_catalog.png", "Insurance Product Directory", "5 categories: Health, Life, Vehicle, Home, and Travel plans", "Customer", draw_policy_catalog)

print("All screenshots generated successfully.")


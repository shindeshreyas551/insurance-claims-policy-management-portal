import { PrismaClient, Role, PolicyCategory, ApplicationStatus, CustomerPolicyStatus, ClaimStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding (Demo Academic Data) ---');

  // Clean existing tables (in reverse foreign key order)
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.claimStatusHistory.deleteMany();
  await prisma.claimDocument.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.customerPolicy.deleteMany();
  await prisma.policyApplication.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('AdminPassword@123', saltRounds);
  const officerPasswordHash = await bcrypt.hash('Officer@123', saltRounds);
  const customerPasswordHash = await bcrypt.hash('Customer@123', saltRounds);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator (Demo)',
      email: 'admin@insurance.portal',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+91 98000 11111',
      address: 'Central Admin Operations, Mumbai Head Office',
      isActive: true,
    },
  });

  const officer1 = await prisma.user.create({
    data: {
      name: 'Officer Rajesh Sharma (Demo)',
      email: 'officer.rajesh@insurance.portal',
      passwordHash: officerPasswordHash,
      role: Role.OFFICER,
      phone: '+91 98111 22222',
      address: 'Claims Verification Wing, Pune Regional Branch',
      isActive: true,
    },
  });

  const officer2 = await prisma.user.create({
    data: {
      name: 'Officer Priya Patel (Demo)',
      email: 'officer.priya@insurance.portal',
      passwordHash: officerPasswordHash,
      role: Role.OFFICER,
      phone: '+91 98222 33333',
      address: 'Assessment Wing, Ahmedabad Regional Office',
      isActive: true,
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Shreyas Shinde (Demo)',
      email: 'customer.shreyas@insurance.portal',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '+91 98765 43210',
      address: 'A-102, Tech Park Enclave, Pune, Maharashtra 411057',
      isActive: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Anita Desai (Demo)',
      email: 'customer.anita@insurance.portal',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '+91 91234 56789',
      address: 'Flat 405, Green Valley Heights, Indiranagar, Bangalore 560038',
      isActive: true,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Vikram Malhotra (Demo)',
      email: 'customer.vikram@insurance.portal',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '+91 99887 76655',
      address: '12B, Lake View Road, Jubilee Hills, Hyderabad 500033',
      isActive: true,
    },
  });

  console.log('Seeded Users: 1 Admin, 2 Officers, 3 Customers');

  // 2. Create Policies for all 5 Categories
  const policies = await Promise.all([
    // Health
    prisma.policy.create({
      data: {
        policyNumber: 'POL-HLT-001',
        name: 'CareShield Comprehensive Health Plan',
        category: PolicyCategory.HEALTH,
        description: 'Complete family hospitalization, day-care treatments, pre and post hospitalization expenses coverage with cashless network across 6,000+ hospitals.',
        premiumAmount: 12500,
        coverageAmount: 500000,
        durationMonths: 12,
        eligibility: 'Age between 18 and 65 years. No prior history of undisclosed chronic illnesses.',
        termsAndConditions: 'Co-pay 10% for age > 60. Standard 30-day initial waiting period applies except for accidental emergencies.',
        isActive: true,
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-HLT-002',
        name: 'Family First Critical Illness Guard',
        category: PolicyCategory.HEALTH,
        description: 'Lump-sum payout upon diagnosis of 36 specified critical illnesses including cardiovascular disease, cancer, and kidney failure.',
        premiumAmount: 24000,
        coverageAmount: 1500000,
        durationMonths: 12,
        eligibility: 'Age between 21 and 55 years. Mandatory pre-medical screening for age over 45.',
        termsAndConditions: '90 days initial waiting period. 30 days survival period post diagnosis required.',
        isActive: true,
      },
    }),
    // Life
    prisma.policy.create({
      data: {
        policyNumber: 'POL-LIF-001',
        name: 'SecureFuture Term Life Protection',
        category: PolicyCategory.LIFE,
        description: 'High sum assured pure risk term life coverage securing family financial independence with terminal illness accelerated benefit.',
        premiumAmount: 18000,
        coverageAmount: 5000000,
        durationMonths: 120,
        eligibility: 'Indian resident, age 18 to 55 years, minimum annual income ₹3,00,000.',
        termsAndConditions: 'Grace period of 30 days for renewal. Suicide exclusion within first 12 months.',
        isActive: true,
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-LIF-002',
        name: 'SmartChild Education Endowment Cover',
        category: PolicyCategory.LIFE,
        description: 'Guaranteed maturity benefits with premium waiver benefit ensuring child educational goals remain untouched in any eventuality.',
        premiumAmount: 30000,
        coverageAmount: 2500000,
        durationMonths: 60,
        eligibility: 'Parents aged 21 to 50 with child aged 0 to 12 years.',
        termsAndConditions: 'Guaranteed additions accrued annually. Loan against policy available after 3 years.',
        isActive: true,
      },
    }),
    // Vehicle
    prisma.policy.create({
      data: {
        policyNumber: 'POL-VEH-001',
        name: 'DriveSafe Comprehensive Four-Wheeler Cover',
        category: PolicyCategory.VEHICLE,
        description: 'Zero depreciation bumper-to-bumper protection against accidents, theft, natural calamities, third-party liability, and engine protection.',
        premiumAmount: 9500,
        coverageAmount: 800000,
        durationMonths: 12,
        eligibility: 'Valid vehicle registration, private car under 7 years from manufacturing date.',
        termsAndConditions: 'Deductible of ₹1,000 per claim. Valid driving license mandatory at time of incident.',
        isActive: true,
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-VEH-002',
        name: 'Two-Wheeler EasyRide Protective Cover',
        category: PolicyCategory.VEHICLE,
        description: 'Comprehensive two-wheeler coverage including roadside assistance, towing, third-party legal liability, and accidental rider cover.',
        premiumAmount: 2200,
        coverageAmount: 150000,
        durationMonths: 12,
        eligibility: 'Two-wheelers up to 10 years of age with valid registration certificate (RC).',
        termsAndConditions: 'Compulsory personal accident cover for owner-driver up to ₹15 Lakhs included.',
        isActive: true,
      },
    }),
    // Home
    prisma.policy.create({
      data: {
        policyNumber: 'POL-HOM-001',
        name: 'HomeHaven Property & Structure Shield',
        category: PolicyCategory.HOME,
        description: 'Comprehensive protection for building structure and valuable contents against fire, earthquake, flood, explosion, burglary, and electrical breakdown.',
        premiumAmount: 8500,
        coverageAmount: 4000000,
        durationMonths: 36,
        eligibility: 'Freehold or leasehold residential property owned or occupied by the insured.',
        termsAndConditions: 'Reinstatement value basis evaluation. Terrorism cover included as standard add-on.',
        isActive: true,
      },
    }),
    // Travel
    prisma.policy.create({
      data: {
        policyNumber: 'POL-TRV-001',
        name: 'GlobeTrotter International Travel Elite',
        category: PolicyCategory.TRAVEL,
        description: 'Worldwide cashless medical hospitalization, trip cancellation, baggage delay/loss, passport loss assistance, and emergency evacuation.',
        premiumAmount: 4200,
        coverageAmount: 2000000,
        durationMonths: 3,
        eligibility: 'Indian passport holder undertaking international journey, age 6 months to 70 years.',
        termsAndConditions: 'Policy must be booked prior to departing Indian immigration. Deductible of $50 per medical claim.',
        isActive: true,
      },
    }),
  ]);

  console.log(`Seeded ${policies.length} Insurance Policies across 5 categories.`);

  // 3. Applications
  const app1 = await prisma.policyApplication.create({
    data: {
      applicationNumber: 'APP-2026-001',
      customerId: customer1.id,
      policyId: policies[0].id, // CareShield Health
      status: ApplicationStatus.APPROVED,
      nomineeName: 'Suman Shinde',
      nomineeRelation: 'Mother',
      annualIncome: 850000,
      existingConditions: 'None',
      remarks: 'All KYC verification documents verified successfully.',
      reviewedById: admin.id,
      reviewedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  });

  const app2 = await prisma.policyApplication.create({
    data: {
      applicationNumber: 'APP-2026-002',
      customerId: customer1.id,
      policyId: policies[4].id, // DriveSafe Four-Wheeler
      status: ApplicationStatus.APPROVED,
      nomineeName: 'Suman Shinde',
      nomineeRelation: 'Mother',
      annualIncome: 850000,
      existingConditions: 'MH12 AB 9988 Honda City 2022 model',
      remarks: 'RC copy and vehicle inspection cleared.',
      reviewedById: admin.id,
      reviewedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
  });

  const app3 = await prisma.policyApplication.create({
    data: {
      applicationNumber: 'APP-2026-003',
      customerId: customer2.id,
      policyId: policies[2].id, // SecureFuture Term Life
      status: ApplicationStatus.APPROVED,
      nomineeName: 'Rahul Desai',
      nomineeRelation: 'Spouse',
      annualIncome: 1200000,
      existingConditions: 'Non-smoker, good health history',
      remarks: 'Medical test report passed.',
      reviewedById: admin.id,
      reviewedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  });

  const app4 = await prisma.policyApplication.create({
    data: {
      applicationNumber: 'APP-2026-004',
      customerId: customer3.id,
      policyId: policies[7].id, // GlobeTrotter Travel
      status: ApplicationStatus.APPROVED,
      nomineeName: 'Meera Malhotra',
      nomineeRelation: 'Spouse',
      annualIncome: 1500000,
      existingConditions: 'Travel to Germany & UK',
      remarks: 'Visa and tickets verified.',
      reviewedById: admin.id,
      reviewedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  });

  const appPending = await prisma.policyApplication.create({
    data: {
      applicationNumber: 'APP-2026-005',
      customerId: customer2.id,
      policyId: policies[6].id, // HomeHaven
      status: ApplicationStatus.PENDING,
      nomineeName: 'Rahul Desai',
      nomineeRelation: 'Spouse',
      annualIncome: 1200000,
      existingConditions: '3BHK apartment in Bangalore',
      remarks: 'Awaiting admin property survey verification.',
    },
  });

  console.log('Seeded Policy Applications');

  // 4. Create Customer Active Policies
  const custPolicy1 = await prisma.customerPolicy.create({
    data: {
      policyNumber: 'CP-HLT-2026-8891',
      customerId: customer1.id,
      policyId: policies[0].id,
      applicationId: app1.id,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      premiumPaid: 12500,
      coverageAmount: 500000,
      status: CustomerPolicyStatus.ACTIVE,
    },
  });

  const custPolicy2 = await prisma.customerPolicy.create({
    data: {
      policyNumber: 'CP-VEH-2026-4412',
      customerId: customer1.id,
      policyId: policies[4].id,
      applicationId: app2.id,
      startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 340 * 24 * 60 * 60 * 1000),
      premiumPaid: 9500,
      coverageAmount: 800000,
      status: CustomerPolicyStatus.ACTIVE,
    },
  });

  const custPolicy3 = await prisma.customerPolicy.create({
    data: {
      policyNumber: 'CP-LIF-2026-1049',
      customerId: customer2.id,
      policyId: policies[2].id,
      applicationId: app3.id,
      startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3630 * 24 * 60 * 60 * 1000),
      premiumPaid: 18000,
      coverageAmount: 5000000,
      status: CustomerPolicyStatus.ACTIVE,
    },
  });

  const custPolicy4 = await prisma.customerPolicy.create({
    data: {
      policyNumber: 'CP-TRV-2026-3398',
      customerId: customer3.id,
      policyId: policies[7].id,
      applicationId: app4.id,
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
      premiumPaid: 4200,
      coverageAmount: 2000000,
      status: CustomerPolicyStatus.ACTIVE,
    },
  });

  console.log('Seeded Customer Active Policies');

  // 5. Seed Claims representing the complete workflow lifecycle
  // Claim 1: SUBMITTED (Customer 1, Health)
  const claim1 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-2026-001',
      customerId: customer1.id,
      customerPolicyId: custPolicy1.id,
      policyId: policies[0].id,
      incidentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      claimCategory: 'HEALTH',
      claimAmount: 45000,
      description: 'Acute viral gastroenteritis hospitalization at Ruby Hall Clinic for 3 days. Includes intravenous fluids, pathology tests, and room nursing.',
      status: ClaimStatus.SUBMITTED,
    },
  });
  await prisma.claimStatusHistory.create({
    data: {
      claimId: claim1.id,
      previousStatus: ClaimStatus.SUBMITTED,
      newStatus: ClaimStatus.SUBMITTED,
      changedById: customer1.id,
      remarks: 'Claim submitted online by customer with discharge summary.',
    },
  });

  // Claim 2: UNDER_REVIEW (Customer 1, Vehicle, assigned to Officer Rajesh)
  const claim2 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-2026-002',
      customerId: customer1.id,
      customerPolicyId: custPolicy2.id,
      policyId: policies[4].id,
      incidentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      claimCategory: 'VEHICLE',
      claimAmount: 32000,
      description: 'Rear bumper and tail-light damage due to stationary collision in parking lot. Authorized workshop estimate attached.',
      status: ClaimStatus.UNDER_REVIEW,
      assignedOfficerId: officer1.id,
      officerRemarks: 'Assigned to Officer Rajesh Sharma. Contacted authorized workshop for repair bill verification.',
    },
  });
  await prisma.claimStatusHistory.createMany({
    data: [
      {
        claimId: claim2.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.SUBMITTED,
        changedById: customer1.id,
        remarks: 'Claim registered with initial incident photos.',
      },
      {
        claimId: claim2.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: officer1.id,
        remarks: 'Claim assigned to officer. Under technical evaluation.',
      },
    ],
  });

  // Claim 3: ADDITIONAL_DOCS_REQUIRED (Customer 1, Health)
  const claim3 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-2026-003',
      customerId: customer1.id,
      customerPolicyId: custPolicy1.id,
      policyId: policies[0].id,
      incidentDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      claimCategory: 'HEALTH',
      claimAmount: 85000,
      description: 'Knee arthroscopy procedure and physiotherapy treatment expenses.',
      status: ClaimStatus.ADDITIONAL_DOCS_REQUIRED,
      assignedOfficerId: officer1.id,
      officerRemarks: 'Please upload original MRI radiology scan films and pharmacy itemized receipts with doctor prescription.',
    },
  });
  await prisma.claimStatusHistory.createMany({
    data: [
      {
        claimId: claim3.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.SUBMITTED,
        changedById: customer1.id,
        remarks: 'Claim filed.',
      },
      {
        claimId: claim3.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: officer1.id,
        remarks: 'Officer initiated document scrutiny.',
      },
      {
        claimId: claim3.id,
        previousStatus: ClaimStatus.UNDER_REVIEW,
        newStatus: ClaimStatus.ADDITIONAL_DOCS_REQUIRED,
        changedById: officer1.id,
        remarks: 'Itemized receipts and MRI reports requested.',
      },
    ],
  });

  // Claim 4: APPROVED (Customer 3, Travel, assigned to Officer Priya)
  const claim4 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-2026-004',
      customerId: customer3.id,
      customerPolicyId: custPolicy4.id,
      policyId: policies[7].id,
      incidentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      claimCategory: 'TRAVEL',
      claimAmount: 38000,
      approvedAmount: 35000,
      description: 'Checked baggage delayed over 36 hours at London Heathrow Airport, requiring purchase of essential emergency clothing and toiletries.',
      status: ClaimStatus.APPROVED,
      assignedOfficerId: officer2.id,
      officerRemarks: 'PIR report and airline declaration verified. Standard deductible of ₹3,000 applied. Approved sum: ₹35,000.',
    },
  });
  await prisma.claimStatusHistory.createMany({
    data: [
      {
        claimId: claim4.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.SUBMITTED,
        changedById: customer3.id,
        remarks: 'Baggage delay claim lodged.',
      },
      {
        claimId: claim4.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: officer2.id,
        remarks: 'Under review by Officer Priya Patel.',
      },
      {
        claimId: claim4.id,
        previousStatus: ClaimStatus.UNDER_REVIEW,
        newStatus: ClaimStatus.APPROVED,
        changedById: officer2.id,
        remarks: 'Claim approved for ₹35,000. Forwarded to finance for settlement.',
      },
    ],
  });

  // Claim 5: REJECTED (Customer 2, Life)
  const claim5 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-2026-005',
      customerId: customer2.id,
      customerPolicyId: custPolicy3.id,
      policyId: policies[2].id,
      incidentDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      claimCategory: 'LIFE',
      claimAmount: 200000,
      description: 'Outpatient consultations and diagnostic workups prior to planned preventive checkup.',
      status: ClaimStatus.REJECTED,
      assignedOfficerId: officer1.id,
      officerRemarks: 'Claim does not meet policy criteria.',
      rejectionReason: 'Routine outpatient health checks are not covered under Term Life Protection (POL-LIF-001). Policy only pays on death or verified terminal illness.',
    },
  });
  await prisma.claimStatusHistory.createMany({
    data: [
      {
        claimId: claim5.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.SUBMITTED,
        changedById: customer2.id,
        remarks: 'Claim submitted.',
      },
      {
        claimId: claim5.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: officer1.id,
        remarks: 'Scrutiny initiated.',
      },
      {
        claimId: claim5.id,
        previousStatus: ClaimStatus.UNDER_REVIEW,
        newStatus: ClaimStatus.REJECTED,
        changedById: officer1.id,
        remarks: 'Rejected: Routine OPD checkups not covered under Life Term Policy.',
      },
    ],
  });

  // Claim 6: SETTLED (Customer 1, Health)
  const claim6 = await prisma.claim.create({
    data: {
      claimNumber: 'CLM-2026-006',
      customerId: customer1.id,
      customerPolicyId: custPolicy1.id,
      policyId: policies[0].id,
      incidentDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      claimCategory: 'HEALTH',
      claimAmount: 180000,
      approvedAmount: 175000,
      description: 'Emergency appendectomy surgical treatment and 4 days ICU admission at Apollo Hospital.',
      status: ClaimStatus.SETTLED,
      assignedOfficerId: officer1.id,
      officerRemarks: 'All surgery bills and discharge summaries approved in full. Deductible of ₹5,000 adjusted.',
      settledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.claimStatusHistory.createMany({
    data: [
      {
        claimId: claim6.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.SUBMITTED,
        changedById: customer1.id,
        remarks: 'Hospitalization claim submitted with bills.',
      },
      {
        claimId: claim6.id,
        previousStatus: ClaimStatus.SUBMITTED,
        newStatus: ClaimStatus.UNDER_REVIEW,
        changedById: officer1.id,
        remarks: 'Under verification with hospital billing desk.',
      },
      {
        claimId: claim6.id,
        previousStatus: ClaimStatus.UNDER_REVIEW,
        newStatus: ClaimStatus.APPROVED,
        changedById: officer1.id,
        remarks: 'Approved for ₹1,75,000.',
      },
      {
        claimId: claim6.id,
        previousStatus: ClaimStatus.APPROVED,
        newStatus: ClaimStatus.SETTLED,
        changedById: admin.id,
        remarks: 'NEFT Transfer completed (Ref: NEFT-HDFC-20260301-998812). Funds credited to customer account.',
      },
    ],
  });

  // 6. Documents for claims
  await prisma.claimDocument.createMany({
    data: [
      {
        claimId: claim1.id,
        fileName: 'hospital_discharge_summary.pdf',
        originalName: 'RubyHall_Discharge_Summary_Signed.pdf',
        filePath: 'uploads/demo-sample-discharge.pdf',
        mimeType: 'application/pdf',
        fileSize: 452100,
        uploadedBy: customer1.id,
      },
      {
        claimId: claim2.id,
        fileName: 'car_damage_photo.jpg',
        originalName: 'HondaCity_RearBumper_Damage.jpg',
        filePath: 'uploads/demo-sample-cardamage.jpg',
        mimeType: 'image/jpeg',
        fileSize: 982300,
        uploadedBy: customer1.id,
      },
      {
        claimId: claim6.id,
        fileName: 'apollo_surgery_invoice.pdf',
        originalName: 'Apollo_Final_Bill_Receipt.pdf',
        filePath: 'uploads/demo-apollo-bill.pdf',
        mimeType: 'application/pdf',
        fileSize: 1245000,
        uploadedBy: customer1.id,
      },
    ],
  });

  console.log('Seeded Claims across all 6 status workflow stages');

  // 7. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        title: 'Claim Settlement Credited',
        message: 'Your claim CLM-2026-006 has been settled. ₹1,75,000 has been transferred to your registered bank account via NEFT.',
        type: NotificationType.SUCCESS,
        isRead: false,
        link: '/claims/CLM-2026-006',
      },
      {
        userId: customer1.id,
        title: 'Additional Documents Required',
        message: 'Officer Rajesh Sharma has requested itemized receipts and MRI scans for claim CLM-2026-003.',
        type: NotificationType.WARNING,
        isRead: false,
        link: '/claims/CLM-2026-003',
      },
      {
        userId: customer1.id,
        title: 'Policy Application Approved',
        message: 'Your application for CareShield Comprehensive Health Plan (POL-HLT-001) has been approved. Active Policy: CP-HLT-2026-8891.',
        type: NotificationType.SUCCESS,
        isRead: true,
        link: '/my-policies',
      },
      {
        userId: officer1.id,
        title: 'New Claim Assigned',
        message: 'Claim CLM-2026-002 (Four-Wheeler bumper damage) has been assigned to you for verification.',
        type: NotificationType.INFO,
        isRead: false,
        link: '/officer/claims/CLM-2026-002',
      },
      {
        userId: admin.id,
        title: 'Pending Policy Application',
        message: 'New application APP-2026-005 received for HomeHaven Property & Structure Shield from Anita Desai.',
        type: NotificationType.INFO,
        isRead: false,
        link: '/admin/applications',
      },
    ],
  });

  // 8. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: customer1.id,
        action: 'SUBMIT_CLAIM',
        entity: 'Claim',
        entityId: claim1.id,
        details: 'Submitted claim CLM-2026-001 for ₹45,000',
        ipAddress: '127.0.0.1',
      },
      {
        userId: officer1.id,
        action: 'UPDATE_STATUS',
        entity: 'Claim',
        entityId: claim3.id,
        details: 'Status changed from UNDER_REVIEW to ADDITIONAL_DOCS_REQUIRED',
        ipAddress: '127.0.0.1',
      },
      {
        userId: admin.id,
        action: 'SETTLE_CLAIM',
        entity: 'Claim',
        entityId: claim6.id,
        details: 'Settled claim CLM-2026-006 for ₹1,75,000 via NEFT',
        ipAddress: '127.0.0.1',
      },
      {
        userId: admin.id,
        action: 'APPROVE_APPLICATION',
        entity: 'PolicyApplication',
        entityId: app1.id,
        details: 'Approved application APP-2026-001 and issued policy CP-HLT-2026-8891',
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log('Seeded Notifications and Audit Logs');
  console.log('--- Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


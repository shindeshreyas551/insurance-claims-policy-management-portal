import { Response } from 'express';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';
import { logAuditEvent } from '../utils/auditLogger';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([Role.ADMIN, Role.OFFICER]),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { role, search } = req.query;

  const where: any = {};
  if (role && Object.values(Role).includes(role as Role)) {
    where.role = role as Role;
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    where.OR = [
      { name: { contains: search.trim() } },
      { email: { contains: search.trim() } },
      { phone: { contains: search.trim() } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          customerPolicies: true,
          claims: true,
          assignedClaims: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, count: users.length, users });
}

export async function getOfficers(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const officers = await prisma.user.findMany({
    where: { role: Role.OFFICER, isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      _count: {
        select: {
          assignedClaims: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json({ success: true, officers });
}

export async function toggleUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id as string;

  if (req.user?.userId === id) {
    res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, email: true, isActive: true, role: true },
  });

  await logAuditEvent(
    req.user?.userId || null,
    'TOGGLE_USER_STATUS',
    'User',
    id,
    `Toggled active status of user ${updated.email} to ${updated.isActive}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  res.json({
    success: true,
    message: `User account ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
    user: updated,
  });
}

export async function createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = createUserSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existing) {
    res.status(409).json({ success: false, message: 'User with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      phone: data.phone || null,
      address: data.address || null,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      isActive: true,
      createdAt: true,
    },
  });

  await logAuditEvent(
    req.user?.userId || null,
    'CREATE_USER',
    'User',
    newUser.id,
    `Created ${newUser.role} user: ${newUser.email}`,
    typeof req.ip === 'string' ? req.ip : undefined
  );

  res.status(201).json({
    success: true,
    message: `${data.role} user created successfully.`,
    user: newUser,
  });
}

export async function getAuditLogs(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  res.json({ success: true, count: logs.length, logs });
}

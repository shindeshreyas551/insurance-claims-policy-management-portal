import { Response } from 'express';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';
import { generateToken } from '../middleware/auth';
import { logAuditEvent } from '../utils/auditLogger';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existing) {
    res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: Role.CUSTOMER,
      phone: data.phone || null,
      address: data.address || null,
      isActive: true,
    },
  });

  await logAuditEvent(user.id, 'USER_REGISTER', 'User', user.id, `Customer registered: ${user.email}`, req.ip);

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  });
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact administrator.' });
    return;
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  await logAuditEvent(user.id, 'USER_LOGIN', 'User', user.id, `User logged in: ${user.email}`, req.ip);

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  });
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
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

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  res.json({ success: true, user });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const data = updateProfileSchema.parse(req.body);

  const updatedUser = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  await logAuditEvent(req.user.userId, 'USER_UPDATE_PROFILE', 'User', req.user.userId, 'Updated profile info', req.ip);

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: updatedUser,
  });
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const data = changePasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!isMatch) {
    res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    return;
  }

  const newHash = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.userId },
    data: { passwordHash: newHash },
  });

  await logAuditEvent(req.user.userId, 'CHANGE_PASSWORD', 'User', req.user.userId, 'Changed password', req.ip);

  res.json({ success: true, message: 'Password changed successfully.' });
}


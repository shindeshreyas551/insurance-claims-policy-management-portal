import { Response } from 'express';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

export async function getUserNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user.userId, isRead: false },
  });

  res.json({
    success: true,
    unreadCount,
    notifications,
  });
}

export async function markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;

  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== req.user.userId) {
    res.status(404).json({ success: false, message: 'Notification not found.' });
    return;
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  res.json({ success: true, message: 'Notification marked as read.' });
}

export async function markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  await prisma.notification.updateMany({
    where: { userId: req.user.userId, isRead: false },
    data: { isRead: true },
  });

  res.json({ success: true, message: 'All notifications marked as read.' });
}

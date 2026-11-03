import prisma from '../prisma';
import { NotificationType } from '@prisma/client';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = NotificationType.INFO,
  link?: string
) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link: link || null,
        isRead: false,
      },
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}


import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Role } from '@prisma/client';
import prisma from '../prisma';
import { AuthenticatedRequest } from '../types';

export async function getDocumentById(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;

  const doc = await prisma.claimDocument.findUnique({
    where: { id },
    include: {
      claim: {
        select: {
          id: true,
          customerId: true,
          assignedOfficerId: true,
        },
      },
    },
  });

  if (!doc) {
    res.status(404).json({ success: false, message: 'Document not found.' });
    return;
  }

  // Authorization check
  if (req.user.role === Role.CUSTOMER && doc.claim.customerId !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Forbidden. You do not have permission to view this document.' });
    return;
  }

  const filePath = path.resolve(doc.filePath);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: 'Physical file not found on storage server.' });
    return;
  }

  res.setHeader('Content-Type', doc.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${doc.originalName}"`);
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}

export async function downloadDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = req.params.id as string;

  const doc = await prisma.claimDocument.findUnique({
    where: { id },
    include: {
      claim: {
        select: {
          id: true,
          customerId: true,
        },
      },
    },
  });

  if (!doc) {
    res.status(404).json({ success: false, message: 'Document not found.' });
    return;
  }

  if (req.user.role === Role.CUSTOMER && doc.claim.customerId !== req.user.userId) {
    res.status(403).json({ success: false, message: 'Forbidden' });
    return;
  }

  const filePath = path.resolve(doc.filePath);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: 'Physical file not found on storage server.' });
    return;
  }

  res.download(filePath, doc.originalName);
}

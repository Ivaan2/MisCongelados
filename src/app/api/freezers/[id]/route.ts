import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth';
import { isValidFirestoreId } from '@/lib/validation';
import { ensureUserInitialized } from '@/lib/user-bootstrap';
import {
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { Timestamp } from 'firebase-admin/firestore';

type FreezerUpdateBody = {
  name?: unknown;
};

/**
 * PUT /api/freezers/[id]
 * Actualiza el nombre de un freezer específico
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId: string;
    try {
      userId = await verifyAuthToken(request);
    } catch (error) {
      return unauthorizedResponse(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }

    const { id } = await params;
    if (!isValidFirestoreId(id)) {
      return badRequestResponse('Invalid freezer ID format');
    }

    const body = (await request.json()) as FreezerUpdateBody;
    if (!body?.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return badRequestResponse('Freezer name is required');
    }

    await ensureUserInitialized(userId);
    const freezerDocRef = adminDb.collection('freezers').doc(userId);
    const doc = await freezerDocRef.get();

    if (!doc.exists) {
      return notFoundResponse('Freezer list not found for user');
    }

    const data = doc.data();
    const freezers = Array.isArray(data?.freezers) ? data.freezers : [];
    const freezerIndex = freezers.findIndex((freezer: { id: string }) => freezer.id === id);

    if (freezerIndex === -1) {
      return notFoundResponse('Freezer not found');
    }

    const updatedFreezers = freezers.map((freezer: { id: string; name: string }) =>
      freezer.id === id ? { ...freezer, name: body.name!.trim() } : freezer
    );

    await freezerDocRef.update({
      freezers: updatedFreezers,
      updatedAt: Timestamp.now(),
    });

    return successResponse({ id, name: body.name!.trim() }, 'Freezer updated');
  } catch (error) {
    console.error('PUT /api/freezers/[id] error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to update freezer'
    );
  }
}

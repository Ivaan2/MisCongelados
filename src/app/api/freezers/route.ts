import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth';
import {
  successResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';
import { ensureUserInitialized } from '@/lib/user-bootstrap';

/**
 * GET /api/freezers
 * Devuelve la lista de freezers del usuario
 */
export async function GET(request: NextRequest) {
  try {
    let userId: string;
    try {
      userId = await verifyAuthToken(request);
    } catch (error) {
      return unauthorizedResponse(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }

    await ensureUserInitialized(userId);

    const doc = await adminDb.collection('freezers').doc(userId).get();
    const data = doc.data();
    const freezers = Array.isArray(data?.freezers) ? data?.freezers : [];

    return successResponse(freezers, 'Freezers loaded');
  } catch (error) {
    console.error('GET /api/freezers error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to load freezers'
    );
  }
}

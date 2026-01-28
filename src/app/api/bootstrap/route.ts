import { NextRequest } from 'next/server';
import { ensureUserInitialized } from '@/lib/user-bootstrap';
import { verifyAuthToken } from '@/lib/auth';
import {
  successResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

/**
 * POST /api/bootstrap
 * Crea estructura de freezer e ítems de ejemplo si el usuario no existe
 */
export async function POST(request: NextRequest) {
  try {
    let userId: string;
    try {
      userId = await verifyAuthToken(request);
    } catch (error) {
      return unauthorizedResponse(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }

    const created = await ensureUserInitialized(userId);
    return successResponse({ created }, created ? 'User initialized' : 'User already initialized');
  } catch (error) {
    console.error('POST /api/bootstrap error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to initialize user'
    );
  }
}

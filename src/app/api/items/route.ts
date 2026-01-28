import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { validateFoodItem, isValidFirestoreId } from '@/lib/validation';
import { verifyAuthToken } from '@/lib/auth';
import {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/items
 * Crea un nuevo item en el congelador
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    let userId: string;
    try {
      userId = await verifyAuthToken(request);
    } catch (error) {
      return unauthorizedResponse(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }

    // Obtener datos del body
    const body = await request.json();

    // Validar datos
    let validatedData;
    try {
      validatedData = validateFoodItem(body);
    } catch (error) {
      return badRequestResponse(
        error instanceof Error ? error.message : 'Invalid input data'
      );
    }

    // Validar freezerId si viene en el request
    const freezerId = body.freezerId;
    if (!freezerId || !isValidFirestoreId(freezerId)) {
      return badRequestResponse('Valid freezerId is required');
    }

    // Crear documento en Firestore
    const now = Timestamp.now();
    const frozenDate = validatedData.frozenDate
      ? Timestamp.fromDate(validatedData.frozenDate)
      : now;

    const docRef = await adminDb.collection('foodItems').add({
      ...validatedData,
      userId,
      freezerId,
      frozenDate,
      createdAt: now,
      updatedAt: now,
    });

    return successResponse(
      {
        id: docRef.id,
        ...validatedData,
        userId,
        freezerId,
        frozenDate: frozenDate.toMillis(),
        createdAt: now.toMillis(),
        updatedAt: now.toMillis(),
      },
      'Item created successfully'
    );
  } catch (error) {
    console.error('POST /api/items error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to create item'
    );
  }
}

/**
 * GET /api/items
 * Obtiene todos los items del usuario (opcionalmente filtrados por freezerId)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    let userId: string;
    try {
      userId = await verifyAuthToken(request);
    } catch (error) {
      return unauthorizedResponse(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    }

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams;
    const freezerId = searchParams.get('freezerId');

    let query = adminDb.collection('foodItems').where('userId', '==', userId);

    // Filtrar por freezerId si se proporciona
    if (freezerId) {
      if (!isValidFirestoreId(freezerId)) {
        return badRequestResponse('Invalid freezerId format');
      }
      query = query.where('freezerId', '==', freezerId);
    }

    const snapshot = await query.get();

    // Si no hay documentos, retornar array vacío (esto NO es un error)
    if (snapshot.empty) {
      return successResponse([], 'No items found');
    }

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      const frozenDate = data.frozenDate;
      const createdAt = data.createdAt;
      const updatedAt = data.updatedAt;

      return {
        id: doc.id,
        ...data,
        frozenDate: typeof frozenDate?.toMillis === 'function' ? frozenDate.toMillis() : frozenDate,
        createdAt: typeof createdAt?.toMillis === 'function' ? createdAt.toMillis() : createdAt,
        updatedAt: typeof updatedAt?.toMillis === 'function' ? updatedAt.toMillis() : updatedAt,
      };
    });

    return successResponse(items, `Retrieved ${items.length} items`);
  } catch (error) {
    console.error('GET /api/items error:', error);

    // Proporcionar mensajes de error más específicos
    if (error instanceof Error) {
      if (error.message.includes('FIREBASE_PROJECT_ID')) {
        return internalErrorResponse('Firebase Admin SDK not configured. Please contact administrator.');
      }
    }

    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve items'
    );
  }
}

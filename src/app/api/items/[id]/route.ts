import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { validateFoodItemUpdate, isValidFirestoreId } from '@/lib/validation';
import { verifyAuthToken } from '@/lib/auth';
import {
  successResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/items/[id]
 * Obtiene un item específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Validar ID
    if (!isValidFirestoreId(id)) {
      return badRequestResponse('Invalid item ID format');
    }

    // Obtener documento
    const doc = await adminDb.collection('foodItems').doc(id).get();

    if (!doc.exists) {
      return notFoundResponse('Item not found');
    }

    const data = doc.data();

    // Verificar que el item pertenece al usuario
    if (data?.userId !== userId) {
      return unauthorizedResponse('You do not have access to this item');
    }

    const frozenDate = data?.frozenDate;
    const createdAt = data?.createdAt;
    const updatedAt = data?.updatedAt;

    return successResponse({
      id: doc.id,
      ...data,
      frozenDate: typeof frozenDate?.toMillis === 'function' ? frozenDate.toMillis() : frozenDate,
      createdAt: typeof createdAt?.toMillis === 'function' ? createdAt.toMillis() : createdAt,
      updatedAt: typeof updatedAt?.toMillis === 'function' ? updatedAt.toMillis() : updatedAt,
    });
  } catch (error) {
    console.error('GET /api/items/[id] error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to retrieve item'
    );
  }
}

/**
 * PUT /api/items/[id]
 * Actualiza un item específico
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Validar ID
    if (!isValidFirestoreId(id)) {
      return badRequestResponse('Invalid item ID format');
    }

    // Obtener datos del body
    const body = await request.json();

    // Validar datos (solo los campos proporcionados)
    let validatedData;
    try {
      validatedData = validateFoodItemUpdate(body);
    } catch (error) {
      return badRequestResponse(
        error instanceof Error ? error.message : 'Invalid input data'
      );
    }

    // Obtener documento actual para verificar propiedad
    const doc = await adminDb.collection('foodItems').doc(id).get();

    if (!doc.exists) {
      return notFoundResponse('Item not found');
    }

    const currentData = doc.data();
    if (currentData?.userId !== userId) {
      return unauthorizedResponse('You do not have access to this item');
    }

    // Actualizar documento
    await adminDb.collection('foodItems').doc(id).update({
      ...validatedData,
      updatedAt: Timestamp.now(),
    });

    // Retornar documento actualizado
    const updatedDoc = await adminDb.collection('foodItems').doc(id).get();
    const updatedData = updatedDoc.data();
    const frozenDate = updatedData?.frozenDate;
    const createdAt = updatedData?.createdAt;
    const updatedAt = updatedData?.updatedAt;

    return successResponse(
      {
        id: updatedDoc.id,
        ...updatedData,
        frozenDate: typeof frozenDate?.toMillis === 'function' ? frozenDate.toMillis() : frozenDate,
        createdAt: typeof createdAt?.toMillis === 'function' ? createdAt.toMillis() : createdAt,
        updatedAt: typeof updatedAt?.toMillis === 'function' ? updatedAt.toMillis() : updatedAt,
      },
      'Item updated successfully'
    );
  } catch (error) {
    console.error('PUT /api/items/[id] error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to update item'
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Elimina un item específico
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Validar ID
    if (!isValidFirestoreId(id)) {
      return badRequestResponse('Invalid item ID format');
    }

    // Obtener documento actual para verificar propiedad
    const doc = await adminDb.collection('foodItems').doc(id).get();

    if (!doc.exists) {
      return notFoundResponse('Item not found');
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      return unauthorizedResponse('You do not have access to this item');
    }

    // Eliminar documento
    await adminDb.collection('foodItems').doc(id).delete();

    return successResponse({ id }, 'Item deleted successfully');
  } catch (error) {
    console.error('DELETE /api/items/[id] error:', error);
    return internalErrorResponse(
      error instanceof Error ? error.message : 'Failed to delete item'
    );
  }
}

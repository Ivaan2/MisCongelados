import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';

/**
 * Verifica el token de autenticación de Firebase
 * @returns El UID del usuario si es válido
 * @throws Error si el token es inválido
 */
export async function verifyAuthToken(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}

/**
 * Extrae el token sin verificar (para debugging)
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

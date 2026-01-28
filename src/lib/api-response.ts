import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Respuesta de éxito
 */
export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: 200 }
  );
}

/**
 * Respuesta de error de validación (400)
 */
export function badRequestResponse(error: string) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: 400 }
  );
}

/**
 * Respuesta de no autorizado (401)
 */
export function unauthorizedResponse(error: string = 'Unauthorized') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: 401 }
  );
}

/**
 * Respuesta de no encontrado (404)
 */
export function notFoundResponse(error: string = 'Not found') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: 404 }
  );
}

/**
 * Respuesta de error interno (500)
 */
export function internalErrorResponse(error: string = 'Internal server error') {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: 500 }
  );
}

/**
 * Respuesta de conflicto (409)
 */
export function conflictResponse(error: string) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: 409 }
  );
}

import { auth } from '@/lib/firebase';
import { type FoodItem, type Freezer } from '@/lib/types';
import { isFoodType, type FoodType } from '@/lib/food-types';

/**
 * Tipo genérico para respuestas de API
 */
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type FoodItemApi = Omit<FoodItem, 'frozenDate' | 'createdAt' | 'updatedAt' | 'itemType'> & {
  frozenDate: number | string;
  createdAt?: number | string;
  updatedAt?: number | string;
  itemType?: FoodType | string;
};

function parseDate(value: unknown): Date | undefined {
  if (typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}

function normalizeFoodItem(item: FoodItemApi): FoodItem {
  const frozenDate = parseDate(item.frozenDate) ?? new Date(0);
  const createdAt = parseDate(item.createdAt);
  const updatedAt = parseDate(item.updatedAt);
  const itemType = isFoodType(item.itemType) ? item.itemType : 'otro';

  return {
    ...item,
    frozenDate,
    createdAt,
    updatedAt,
    itemType,
  };
}

/**
 * Obtiene el token de autenticación actual del usuario
 */
async function getAuthToken(): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('Usuario no autenticado');
  }
  return await auth.currentUser.getIdToken();
}

/**
 * Interfaz para opciones de fetch
 */
interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * Realiza una llamada HTTP autenticada a la API
 */
async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error de API: ${response.status} ${response.statusText}`;

    // Agregar información adicional según el código de estado
    if (response.status === 401) {
      throw new Error('Autenticación requerida. Inicia sesión.');
    } else if (response.status === 500) {
      throw new Error(errorMessage || 'Error del servidor. Inténtalo de nuevo más tarde.');
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Servicio para operaciones de items
 */
export const itemsApi = {
  /**
   * Crear un nuevo item
   */
  async createItem(data: {
    name: string;
    description: string;
    freezerBox?: string;
    itemType?: FoodType;
    freezerId: string;
    frozenDate?: string;
  }): Promise<ApiResponse<FoodItem>> {
    const response = await apiCall<ApiResponse<FoodItemApi>>('/api/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return { ...response, data: normalizeFoodItem(response.data) };
    }
    return response as ApiResponse<FoodItem>;
  },

  /**
   * Obtener todos los items del usuario (opcionalmente filtrados por freezerId)
   */
  async getItems(freezerId?: string): Promise<ApiResponse<FoodItem[]>> {
    const url = new URL('/api/items', window.location.origin);
    if (freezerId) {
      url.searchParams.append('freezerId', freezerId);
    }
    const response = await apiCall<ApiResponse<FoodItemApi[]>>(url.pathname + url.search);
    if (response.success && Array.isArray(response.data)) {
      return { ...response, data: response.data.map(normalizeFoodItem) };
    }
    return response as ApiResponse<FoodItem[]>;
  },

  /**
   * Obtener un item específico
   */
  async getItem(id: string): Promise<ApiResponse<FoodItem>> {
    const response = await apiCall<ApiResponse<FoodItemApi>>(`/api/items/${id}`);
    if (response.success && response.data) {
      return { ...response, data: normalizeFoodItem(response.data) };
    }
    return response as ApiResponse<FoodItem>;
  },

  /**
   * Actualizar un item
   */
  async updateItem(
    id: string,
    data: {
      name?: string;
      description?: string;
      freezerBox?: string;
      itemType?: FoodType;
    }
  ): Promise<ApiResponse<FoodItem>> {
    const response = await apiCall<ApiResponse<FoodItemApi>>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      return { ...response, data: normalizeFoodItem(response.data) };
    }
    return response as ApiResponse<FoodItem>;
  },

  /**
   * Eliminar un item
   */
  async deleteItem(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiCall(`/api/items/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Servicio para operaciones de freezers
 */
export const freezersApi = {
  /**
   * Obtener lista de freezers del usuario
   */
  async getFreezers(): Promise<ApiResponse<Freezer[]>> {
    return apiCall('/api/freezers');
  },

  /**
   * Actualizar nombre de un freezer
   */
  async updateFreezer(id: string, name: string): Promise<ApiResponse<Freezer>> {
    return apiCall(`/api/freezers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },
};

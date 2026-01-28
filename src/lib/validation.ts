/**
 * Validación robusta para items de congelador
 */

import { FOOD_TYPE_VALUES, type FoodType, isFoodType } from '@/lib/food-types';

export interface FoodItemInput {
  name?: unknown;
  description?: unknown;
  freezerBox?: unknown;
  itemType?: unknown;
  frozenDate?: unknown;
}

export interface ValidatedFoodItem {
  name: string;
  description: string;
  freezerBox?: string;
  itemType: FoodType;
  frozenDate?: Date;
}

/**
 * Valida que una cadena no sea nula, vacía o solo espacios
 */
function isValidString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.trim().length === 0) return false;
  return true;
}

/**
 * Valida un input de item de comida
 * @throws Error si la validación falla
 */
export function validateFoodItem(data: unknown): ValidatedFoodItem {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input: data must be an object');
  }

  const input = data as FoodItemInput;

  // Validar nombre
  if (!isValidString(input.name)) {
    throw new Error('Item name is required and cannot be empty');
  }

  // Validar descripción
  if (!isValidString(input.description)) {
    throw new Error('Description is required and cannot be empty');
  }

  let freezerBox: string | undefined;
  if (input.freezerBox !== undefined && input.freezerBox !== null && input.freezerBox !== '') {
    if (!isValidString(input.freezerBox)) {
      throw new Error('Freezer box location must be a non-empty string');
    }
    freezerBox = input.freezerBox.trim();
  }

  let itemType: FoodType = 'otro';
  if (input.itemType !== undefined && input.itemType !== null && input.itemType !== '') {
    if (!isFoodType(input.itemType)) {
      throw new Error(`Item type must be one of: ${FOOD_TYPE_VALUES.join(', ')}`);
    }
    itemType = input.itemType;
  }

  let frozenDate: Date | undefined;
  if (input.frozenDate !== undefined && input.frozenDate !== null && input.frozenDate !== '') {
    if (input.frozenDate instanceof Date) {
      if (Number.isNaN(input.frozenDate.getTime())) {
        throw new Error('Frozen date must be a valid date');
      }
      frozenDate = input.frozenDate;
    } else if (typeof input.frozenDate === 'string') {
      const parsed = new Date(input.frozenDate);
      if (Number.isNaN(parsed.getTime())) {
        throw new Error('Frozen date must be a valid date');
      }
      frozenDate = parsed;
    } else {
      throw new Error('Frozen date must be a date string');
    }
  }

  return {
    name: input.name.trim(),
    description: input.description.trim(),
    ...(freezerBox ? { freezerBox } : {}),
    itemType,
    ...(frozenDate ? { frozenDate } : {}),
  };
}

/**
 * Valida un input de item de comida para actualización parcial
 * @throws Error si la validación falla o no hay campos válidos
 */
export function validateFoodItemUpdate(data: unknown): Partial<ValidatedFoodItem> {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input: data must be an object');
  }

  const input = data as FoodItemInput;
  const output: Partial<ValidatedFoodItem> = {};

  if (input.name !== undefined) {
    if (!isValidString(input.name)) {
      throw new Error('Item name cannot be empty');
    }
    output.name = input.name.trim();
  }

  if (input.description !== undefined) {
    if (!isValidString(input.description)) {
      throw new Error('Description cannot be empty');
    }
    output.description = input.description.trim();
  }

  if (input.freezerBox !== undefined) {
    if (input.freezerBox === null || input.freezerBox === '') {
      // No actualizar si viene vacío
    } else if (!isValidString(input.freezerBox)) {
      throw new Error('Freezer box location must be a non-empty string');
    } else {
      output.freezerBox = input.freezerBox.trim();
    }
  }

  if (input.itemType !== undefined) {
    if (input.itemType === null || input.itemType === '') {
      output.itemType = 'otro';
    } else if (!isFoodType(input.itemType)) {
      throw new Error(`Item type must be one of: ${FOOD_TYPE_VALUES.join(', ')}`);
    } else {
      output.itemType = input.itemType;
    }
  }

  if (Object.keys(output).length === 0) {
    throw new Error('At least one field must be provided');
  }

  return output;
}

/**
 * Valida un ID de Firestore
 */
export function isValidFirestoreId(id: unknown): id is string {
  if (typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Valida un ID de usuario
 */
export function isValidUserId(userId: unknown): userId is string {
  if (typeof userId !== 'string') return false;
  return userId.trim().length > 0;
}

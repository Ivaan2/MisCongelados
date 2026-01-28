export const FOOD_TYPE_VALUES = [
  'pollo',
  'carne',
  'verdura',
  'pescado',
  'hielo',
  'bebida',
  'tupper',
  'pan',
  'otro',
] as const;

export type FoodType = typeof FOOD_TYPE_VALUES[number];

export function isFoodType(value: unknown): value is FoodType {
  return FOOD_TYPE_VALUES.includes(value as FoodType);
}

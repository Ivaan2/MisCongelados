import type { LucideIcon } from 'lucide-react';
import {
  Container,
  CupSoda,
  Drumstick,
  Fish,
  Salad,
  Sandwich,
  Snowflake,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import { FOOD_TYPE_VALUES, type FoodType } from '@/lib/food-types';

export type FoodCatalogItem = {
  value: FoodType;
  label: string;
  color: string;
  icon: LucideIcon;
};

export const FOOD_CATALOG: FoodCatalogItem[] = [
  { value: 'pollo', label: 'Pollo', color: '#f6c453', icon: Drumstick },
  { value: 'carne', label: 'Carne', color: '#f29c9c', icon: UtensilsCrossed },
  { value: 'verdura', label: 'Verdura', color: '#8ad08b', icon: Salad },
  { value: 'pescado', label: 'Pescado', color: '#7fc6d6', icon: Fish },
  { value: 'hielo', label: 'Hielo', color: '#b5d4f0', icon: Snowflake },
  { value: 'bebida', label: 'Bebida', color: '#c9b3f5', icon: CupSoda },
  { value: 'tupper', label: 'Tupper', color: '#f4b5d2', icon: Container },
  { value: 'pan', label: 'Pan', color: '#f1c27d', icon: Sandwich },
  { value: 'otro', label: 'Otro', color: '#b9c0c7', icon: Utensils },
];

export function getFoodMeta(value?: string): FoodCatalogItem {
  const fallback = FOOD_CATALOG.find((item) => item.value === 'otro') ?? FOOD_CATALOG[0];
  if (!value) return fallback;
  return FOOD_CATALOG.find((item) => item.value === value) ?? fallback;
}

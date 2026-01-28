import type { FoodType } from '@/lib/food-types';

export type FoodItem = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frozenDate: Date;
  freezerBox?: string;
  itemType: FoodType;
  freezerId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Freezer = {
  id: string;
  name: string;
};

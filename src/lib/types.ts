import type { Timestamp } from 'firebase/firestore';

export type FoodItem = {
  id: string;
  userId: string;
  name: string;
  description: string;
  frozenDate: Timestamp;
  freezerBox: string;
  photoUrl?: string;
  freezerId: string;
};

export type Freezer = {
  id: string;
  name: string;
};

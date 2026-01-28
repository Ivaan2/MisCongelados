import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export const DEFAULT_FREEZERS = [
  { id: 'freezer1', name: 'Congelador de cocina' },
  { id: 'freezer2', name: 'Congelador del garaje' },
];

const DEFAULT_ITEM = {
  name: 'Nombre alimento 1',
  description: 'Comida que sobro del fin de semana',
  freezerBox: 'Segundo cajon',
  itemType: 'tupper',
  frozenDate: new Date('2026-01-28T00:00:00Z'),
};

export async function ensureUserInitialized(userId: string): Promise<boolean> {
  const freezerDocRef = adminDb.collection('freezers').doc(userId);
  const existing = await freezerDocRef.get();

  if (existing.exists) {
    return false;
  }

  const now = Timestamp.now();
  const frozenDate = Timestamp.fromDate(DEFAULT_ITEM.frozenDate);

  const batch = adminDb.batch();
  batch.set(freezerDocRef, {
    userId,
    freezers: DEFAULT_FREEZERS,
    createdAt: now,
    updatedAt: now,
    seededAt: now,
  });

  DEFAULT_FREEZERS.forEach((freezer) => {
    const itemRef = adminDb.collection('foodItems').doc();
    batch.set(itemRef, {
      userId,
      freezerId: freezer.id,
      name: DEFAULT_ITEM.name,
      description: DEFAULT_ITEM.description,
      freezerBox: DEFAULT_ITEM.freezerBox,
      itemType: DEFAULT_ITEM.itemType,
      frozenDate,
      createdAt: now,
      updatedAt: now,
      isSeed: true,
    });
  });

  await batch.commit();

  return true;
}

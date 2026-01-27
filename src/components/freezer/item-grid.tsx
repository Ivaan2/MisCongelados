import { ItemCard } from './item-card';
import { type FoodItem } from '@/lib/types';

export function ItemGrid({ items, onItemDeleted }: { items: FoodItem[]; onItemDeleted: (id: string) => void; }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 group">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onItemDeleted={() => onItemDeleted(item.id)} />
      ))}
    </div>
  );
}

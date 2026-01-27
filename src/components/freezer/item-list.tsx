import { ItemRow } from './item-row';
import { type FoodItem } from '@/lib/types';
import { Card } from '../ui/card';

export function ItemList({ items, onItemDeleted }: { items: FoodItem[]; onItemDeleted: (id: string) => void; }) {
  return (
    <Card>
      <div className="divide-y divide-border group">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onItemDeleted={() => onItemDeleted(item.id)} />
        ))}
      </div>
    </Card>
  );
}

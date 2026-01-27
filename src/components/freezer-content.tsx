'use client';

import { useState, useMemo } from 'react';
import { ItemGrid } from '@/components/freezer/item-grid';
import { ItemList } from '@/components/freezer/item-list';
import { type FoodItem } from '@/lib/types';
import { AddItemDialog } from './freezer/add-item-dialog';
import { Refrigerator, SearchX } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

type FreezerContentProps = {
  isAddDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
  view: 'grid' | 'list';
  searchQuery: string;
  currentFreezerId: string;
};

// Mock data for development
const mockItems: FoodItem[] = [
  {
    id: '1',
    userId: 'mock-user',
    freezerId: 'freezer1',
    name: 'Grass-fed Ribeye Steak',
    description: '2-inch thick cut, vacuum sealed. From local farm.',
    freezerBox: 'Meat Drawer',
    frozenDate: new Timestamp(Math.floor(Date.now() / 1000) - 86400 * 5, 0), // 5 days ago
    photoUrl: 'https://images.unsplash.com/photo-1621758745802-6c16a087ca32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Zm9vZCUyMG1lYWx8ZW58MHx8fHwxNzY5NTIwMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    userId: 'mock-user',
    freezerId: 'freezer1',
    name: 'Organic Blueberries',
    description: 'Picked at peak ripeness. Great for smoothies.',
    freezerBox: 'Fruit Shelf',
    frozenDate: new Timestamp(Math.floor(Date.now() / 1000) - 86400 * 12, 0), // 12 days ago
  },
  {
    id: '3',
    userId: 'mock-user',
    freezerId: 'freezer2',
    name: 'Homemade Tomato Soup',
    description: 'Made with garden tomatoes. Just reheat and serve.',
    freezerBox: 'Leftovers',
    frozenDate: new Timestamp(Math.floor(Date.now() / 1000) - 86400 * 2, 0), // 2 days ago
    photoUrl: 'https://images.unsplash.com/photo-1575720197943-2c5f1107569a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx0b21hdG8lMjBzb3VwfGVufDB8fHx8MTc3MDA4MDQ1OHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    userId: 'mock-user',
    freezerId: 'freezer2',
    name: 'Sourdough Bread Loaf',
    description: 'Artisan bread, pre-sliced for convenience.',
    freezerBox: 'Side Door',
    frozenDate: new Timestamp(Math.floor(Date.now() / 1000) - 86400 * 20, 0), // 20 days ago
  },
];

export function FreezerContent({ isAddDialogOpen, onOpenChange, onItemAdded, view, searchQuery, currentFreezerId }: FreezerContentProps) {
  const [items, setItems] = useState<FoodItem[]>(mockItems);

  const handleItemDeleted = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };
  
  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.freezerId === currentFreezerId)
      .filter(item => {
        if (!searchQuery) return true;
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.description.toLowerCase().includes(searchQuery.toLowerCase())
      });
  }, [items, searchQuery, currentFreezerId]);
  
  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold font-headline">Your Items</h1>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-lg mt-8">
            {searchQuery ? (
              <>
                <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No Results Found</h2>
                <p className="text-muted-foreground mt-2">
                  No items matched your search for "{searchQuery}".
                </p>
              </>
            ) : (
              <>
                <Refrigerator className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">This freezer is empty!</h2>
                <p className="text-muted-foreground mt-2">Click the camera button to get started.</p>
              </>
            )}
          </div>
        ) : (
          view === 'grid' 
            ? <ItemGrid items={filteredItems} onItemDeleted={handleItemDeleted} /> 
            : <ItemList items={filteredItems} onItemDeleted={handleItemDeleted} />
        )}
      </div>
      <AddItemDialog 
        open={isAddDialogOpen} 
        onOpenChange={onOpenChange} 
        onItemAdded={onItemAdded}
        currentFreezerId={currentFreezerId}
      />
    </>
  );
}

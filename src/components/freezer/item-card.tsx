'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type FoodItem } from '@/lib/types';
import { ItemDetailsDialog } from './item-details-dialog';
import { Box } from 'lucide-react';
import { getFoodMeta } from '@/lib/food-catalog';

export function ItemCard({ item, onItemDeleted }: { item: FoodItem; onItemDeleted: () => void; }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const foodMeta = getFoodMeta(item.itemType);
  const Icon = foodMeta.icon;

  return (
    <>
      <Card
        className="flex flex-col h-full cursor-pointer hover:shadow-accent/20 hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsDetailsOpen(true)}
        aria-label={`Ver detalles de ${item.name}`}
      >
        <CardHeader>
          <CardTitle className="truncate font-headline">{item.name}</CardTitle>
          <CardDescription className="truncate h-5">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div
            className="aspect-video w-full rounded-md overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: `${foodMeta.color}22` }}
            aria-label={foodMeta.label}
          >
            <Icon className="h-16 w-16" style={{ color: foodMeta.color }} />
          </div>
        </CardContent>
        <CardFooter>
            <div className="flex items-center text-sm text-muted-foreground">
              <Box className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{item.freezerBox || 'Sin ubicación'}</span>
            </div>
        </CardFooter>
      </Card>
      <ItemDetailsDialog
        item={item}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onItemDeleted={onItemDeleted}
      />
    </>
  );
}

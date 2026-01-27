'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const defaultFoodImage = PlaceHolderImages.find(p => p.id === 'default-food');

export function ItemCard({ item, onItemDeleted }: { item: FoodItem; onItemDeleted: () => void; }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Card
        className="flex flex-col h-full cursor-pointer hover:shadow-accent/20 hover:shadow-lg transition-shadow duration-300"
        onClick={() => setIsDetailsOpen(true)}
        aria-label={`View details for ${item.name}`}
      >
        <CardHeader>
          <CardTitle className="truncate font-headline">{item.name}</CardTitle>
          <CardDescription className="truncate h-5">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-video relative w-full bg-muted rounded-md overflow-hidden">
            <Image
              src={item.photoUrl || defaultFoodImage?.imageUrl || ''}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={defaultFoodImage?.imageHint}
            />
          </div>
        </CardContent>
        <CardFooter>
            <div className="flex items-center text-sm text-muted-foreground">
              <Box className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{item.freezerBox}</span>
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

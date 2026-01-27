'use client';

import { useState } from 'react';
import Image from 'next/image';
import { type FoodItem } from '@/lib/types';
import { ItemDetailsDialog } from './item-details-dialog';
import { Box, Calendar, Trash2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const defaultFoodImage = PlaceHolderImages.find((p) => p.id === 'default-food');

export function ItemRow({ item, onItemDeleted }: { item: FoodItem; onItemDeleted: () => void }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const frozenDate = item.frozenDate.toDate();

  return (
    <>
      <div
        className="flex items-center p-4 hover:bg-muted/50 transition-colors"
        aria-label={`View details for ${item.name}`}
      >
        <div
          className="flex-grow flex items-center cursor-pointer"
          onClick={() => setIsDetailsOpen(true)}
        >
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage
              src={item.photoUrl || defaultFoodImage?.imageUrl || ''}
              alt={item.name}
              className="object-cover"
              data-ai-hint={defaultFoodImage?.imageHint}
            />
            <AvatarFallback className="rounded-md">{item.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-4 flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-2">
            <div className="md:col-span-2">
              <p className="font-semibold font-headline truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground mt-1 truncate">{item.description}</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4 md:mt-0">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {formatDistanceToNow(frozenDate, { addSuffix: true })}
              </div>
              <div className="flex items-center">
                <Box className="w-3.5 h-3.5 mr-1.5" /> {item.freezerBox}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-auto pl-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete "{item.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onItemDeleted}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <ItemDetailsDialog
        item={item}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onItemDeleted={onItemDeleted}
      />
    </>
  );
}

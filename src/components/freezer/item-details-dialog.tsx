'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type FoodItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Calendar, Box, Trash2 } from 'lucide-react';
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
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

const defaultFoodImage = PlaceHolderImages.find(p => p.id === 'default-food');

type ItemDetailsDialogProps = {
  item: FoodItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemDeleted?: () => void;
};

export function ItemDetailsDialog({ item, open, onOpenChange, onItemDeleted }: ItemDetailsDialogProps) {
  const frozenDate = item.frozenDate.toDate();
  
  const handleConfirmDelete = () => {
    if (onItemDeleted) {
      onItemDeleted();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="aspect-video relative w-full bg-muted rounded-lg overflow-hidden">
            <Image
              src={item.photoUrl || defaultFoodImage?.imageUrl || ''}
              alt={item.name}
              fill
              className="object-cover"
              data-ai-hint={defaultFoodImage?.imageHint}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Frozen Date</p>
                    <p className="text-muted-foreground">{format(frozenDate, 'PPP')}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Box className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Freezer Box</p>
                  <p className="text-muted-foreground">{item.freezerBox}</p>
              </div>
            </div>
          </div>
        </div>
        {onItemDeleted && (
          <DialogFooter className="pt-4 mt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete "{item.name}" from your freezer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

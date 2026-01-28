'use client';

import { useState } from 'react';
import { type FoodItem } from '@/lib/types';
import { ItemDetailsDialog } from './item-details-dialog';
import { Box, Calendar, Trash2 } from 'lucide-react';
import { getFoodMeta } from '@/lib/food-catalog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { differenceInCalendarDays } from 'date-fns';
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

export function ItemRow({ item, onItemDeleted }: { item: FoodItem; onItemDeleted: () => void }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const frozenDate = item.frozenDate;
  const foodMeta = getFoodMeta(item.itemType);
  const Icon = foodMeta.icon;
  const daysFrozen = Math.max(0, differenceInCalendarDays(new Date(), frozenDate));
  const daysLabel = daysFrozen === 1 ? 'día' : 'días';
  const frozenLabel = daysFrozen === 1 ? 'congelado' : 'congelados';

  return (
    <>
      <div
        className="flex items-center p-4 hover:bg-muted/50 transition-colors"
        aria-label={`Ver detalles de ${item.name}`}
      >
        <div
          className="flex-grow flex items-center cursor-pointer"
          onClick={() => setIsDetailsOpen(true)}
        >
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarFallback className="rounded-md" style={{ backgroundColor: `${foodMeta.color}22` }}>
              <Icon className="h-5 w-5" style={{ color: foodMeta.color }} />
            </AvatarFallback>
          </Avatar>

          <div className="ml-4 flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-2">
            <div className="md:col-span-2">
              <p className="font-semibold font-headline truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground mt-1 truncate">{item.description}</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4 md:mt-0">
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {daysFrozen} {daysLabel} {frozenLabel}
              </div>
              <div className="flex items-center">
                <Box className="w-3.5 h-3.5 mr-1.5" /> {item.freezerBox || 'Sin ubicación'}
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
                aria-label={`Eliminar ${item.name}`}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará definitivamente "{item.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onItemDeleted}>Eliminar</AlertDialogAction>
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

'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type FoodItem } from '@/lib/types';
import { getFoodMeta } from '@/lib/food-catalog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Box, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

type ItemDetailsDialogProps = {
  item: FoodItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemDeleted?: () => void;
};

export function ItemDetailsDialog({ item, open, onOpenChange, onItemDeleted }: ItemDetailsDialogProps) {
  const frozenDate = item.frozenDate;
  const foodMeta = getFoodMeta(item.itemType);
  const Icon = foodMeta.icon;
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmingDelete(false);
    }
  }, [open]);

  const handleConfirmDelete = () => {
    if (onItemDeleted) {
      onItemDeleted();
    }
    setConfirmingDelete(false);
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
          <div
            className="aspect-video w-full rounded-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: `${foodMeta.color}22` }}
            aria-label={foodMeta.label}
          >
            <Icon className="h-20 w-20" style={{ color: foodMeta.color }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                    <p className="font-semibold">Fecha de congelación</p>
                    <p className="text-muted-foreground">{format(frozenDate, 'PPP', { locale: es })}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Box className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Ubicación</p>
                  <p className="text-muted-foreground">{item.freezerBox || 'Sin ubicación'}</p>
              </div>
            </div>
          </div>
        </div>
        {onItemDeleted && (
          <DialogFooter className="pt-4 mt-4 border-t">
            {confirmingDelete ? (
              <>
                <div className="flex-1 text-sm text-muted-foreground">
                  Esta acción no se puede deshacer.
                </div>
                <Button variant="outline" onClick={() => setConfirmingDelete(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </>
            ) : (
              <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar alimento
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

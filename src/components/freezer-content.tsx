'use client';

import { useState, useMemo, useEffect } from 'react';
import { ItemGrid } from '@/components/freezer/item-grid';
import { ItemList } from '@/components/freezer/item-list';
import { type FoodItem } from '@/lib/types';
import AddItemDialog from './freezer/add-item-dialog';
import { Pencil, Refrigerator, SearchX } from 'lucide-react';
import { itemsApi } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type FreezerContentProps = {
  isAddDialogOpen: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onItemAddedAction: () => void;
  view: 'grid' | 'list';
  searchQuery: string;
  currentFreezerId: string;
  currentFreezerName: string;
  onRenameFreezer: (name: string) => Promise<void>;
};

export function FreezerContent({
  isAddDialogOpen,
  onOpenChangeAction,
  onItemAddedAction,
  view,
  searchQuery,
  currentFreezerId,
  currentFreezerName,
  onRenameFreezer,
}: FreezerContentProps) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFreezerName, setNewFreezerName] = useState(currentFreezerName);
  const [isSavingName, setIsSavingName] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setNewFreezerName(currentFreezerName);
  }, [currentFreezerName]);

  // Cargar items cuando cambia el freezerId o cuando se agrega un item
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await itemsApi.getItems(currentFreezerId);
        if (response && typeof response === 'object' && 'success' in response) {
          if (response.success && 'data' in response) {
            const data = response.data;
            if (Array.isArray(data)) {
              setItems(data as FoodItem[]);
            } else {
              // Si data no es un array, establecer array vacío
              setItems([]);
            }
          } else if (!response.success && 'error' in response) {
            // Si la respuesta indica un error
            console.error('API error:', response.error);
            setError(response.error);
            setItems([]);
          }
        } else {
          // Respuesta inesperada
          setItems([]);
        }
      } catch (err) {
        console.error('Error loading items:', err);
        const errorMessage = err instanceof Error ? err.message : 'No se pudieron cargar los alimentos';

        // Si el error es de autenticación, mostrar mensaje específico
        if (errorMessage.includes('not authenticated') || errorMessage.includes('401')) {
          setError('Inicia sesión para ver tus alimentos');
        } else {
          setError(errorMessage);
        }
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [currentFreezerId, isAddDialogOpen]);

  const handleItemDeleted = async (itemId: string) => {
    try {
      await itemsApi.deleteItem(itemId);
      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el alimento');
    }
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
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRenaming(true)}
              aria-label="Editar nombre del congelador"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold font-headline">Recuerda tus congelados</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Cargando alimentos...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-lg mt-8">
            {searchQuery ? (
              <>
                <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No se encontraron resultados</h2>
                <p className="text-muted-foreground mt-2">
                  No se encontraron alimentos que coincidan con "{searchQuery}".
                </p>
              </>
            ) : (
              <>
                <Refrigerator className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">¡Este congelador está vacío!</h2>
                <p className="text-muted-foreground mt-2">Haz clic en el botón de la esquina inferior derecha para comenzar.</p>
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
        onOpenChangeAction={onOpenChangeAction}
        onItemAddedAction={onItemAddedAction}
        currentFreezerId={currentFreezerId}
      />
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar nombre del congelador</DialogTitle>
            <DialogDescription>
              Actualiza el nombre de este congelador.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={newFreezerName}
              onChange={(event) => setNewFreezerName(event.target.value)}
              placeholder="Nombre del congelador"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenaming(false)}
              disabled={isSavingName}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                const trimmed = newFreezerName.trim();
                if (!trimmed) {
                  toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'El nombre del congelador no puede estar vacío.',
                  });
                  return;
                }
                try {
                  setIsSavingName(true);
                  await onRenameFreezer(trimmed);
                  setIsRenaming(false);
                  toast({
                    title: 'Actualizado',
                    description: 'El nombre del congelador se actualizó correctamente.',
                  });
                } catch (renameError) {
                  console.error('Failed to rename freezer:', renameError);
                  toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: renameError instanceof Error ? renameError.message : 'No se pudo actualizar el nombre del congelador.',
                  });
                } finally {
                  setIsSavingName(false);
                }
              }}
              disabled={isSavingName}
            >
              {isSavingName ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

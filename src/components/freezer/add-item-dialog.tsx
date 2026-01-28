'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { FOOD_CATALOG, getFoodMeta } from '@/lib/food-catalog';
import { FOOD_TYPE_VALUES } from '@/lib/food-types';

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del alimento es obligatorio.' }),
  description: z.string().min(1, { message: 'La descripción es obligatoria.' }),
  freezerBox: z.string().optional(),
  itemType: z.enum(FOOD_TYPE_VALUES as [string, ...string[]], { message: 'Selecciona una categoría.' }),
  frozenDate: z.string().optional(),
});

type AddItemDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onItemAddedAction: () => void;
  currentFreezerId: string;
};

function AddItemDialog({ open, onOpenChangeAction, onItemAddedAction, currentFreezerId }: AddItemDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      freezerBox: '',
      itemType: 'otro',
      frozenDate: '',
    },
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión.' });
      return;
    }
    
    const currentUser = auth.currentUser;

    startTransition(async () => {
      try {
        // Obtener token de autenticación
        const token = await currentUser.getIdToken();
        const frozenDate = values.frozenDate
          ? new Date(`${values.frozenDate}T00:00:00`).toISOString()
          : undefined;

        // Llamar a la API route
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            ...(values.freezerBox ? { freezerBox: values.freezerBox } : {}),
            ...(values.itemType ? { itemType: values.itemType } : {}),
            freezerId: currentFreezerId,
            ...(frozenDate ? { frozenDate } : {}),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'No se pudo añadir el alimento';
          throw new Error(errorMessage);
        }

        toast({ title: 'Éxito', description: `${values.name} se añadió al congelador.` });
        onItemAddedAction();
        form.reset();
      } catch (e) {
        console.error("Error adding item: ", e);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: e instanceof Error ? e.message : 'No se pudo añadir el alimento.'
        });
      }
    });
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isPending) {
        onOpenChangeAction(isOpen);
        if (!isOpen) {
            form.reset();
        }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir alimento</DialogTitle>
          <DialogDescription>
            Introduce los detalles del alimento y elige una categoría.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del alimento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Alitas de pollo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Adobadas con limón y hierbas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="freezerBox"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación en el congelador (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cajón superior" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frozenDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de congelación</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {FOOD_CATALOG.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="relative flex justify-center items-center w-full h-32 border-2 border-dashed rounded-lg bg-muted/30">
              {(() => {
                const foodMeta = getFoodMeta(form.watch('itemType'));
                const Icon = foodMeta.icon;
                return (
                  <div
                    className="w-full h-full flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${foodMeta.color}22` }}
                  >
                    <Icon className="h-12 w-12" style={{ color: foodMeta.color }} />
                  </div>
                );
              })()}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Añadiendo...' : 'Añadir'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemDialog

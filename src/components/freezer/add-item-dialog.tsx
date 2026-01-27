'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, storage, auth } from '@/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  freezerBox: z.string().min(1, { message: 'Freezer box location is required.' }),
  photo: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional()),
});

type AddItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
  currentFreezerId: string;
};

export function AddItemDialog({ open, onOpenChange, onItemAdded, currentFreezerId }: AddItemDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      freezerBox: '',
    },
  });
  const photoRef = form.register('photo');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    
    startTransition(async () => {
      try {
        let photoUrl: string | undefined = undefined;
        const photoFile = values.photo?.[0];

        if (photoFile) {
          const imageRef = ref(storage, `images/${auth.currentUser.uid}/${Date.now()}-${photoFile.name}`);
          const snapshot = await uploadBytes(imageRef, photoFile);
          photoUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, 'foodItems'), {
          userId: auth.currentUser.uid,
          freezerId: currentFreezerId,
          name: values.name,
          description: values.description,
          freezerBox: values.freezerBox,
          frozenDate: Timestamp.now(),
          photoUrl: photoUrl,
        });

        toast({ title: 'Success', description: `${values.name} added to your freezer.` });
        onItemAdded();
        form.reset();
        setPreview(null);
      } catch (e) {
        console.error("Error adding document: ", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add item.' });
      }
    });
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isPending) {
        onOpenChange(isOpen);
        if (!isOpen) {
            form.reset();
            setPreview(null);
        }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Enter the details of your new frozen item. Photo is optional.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chicken Breast" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Marinated with lemon and herbs" {...field} />
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
                  <FormLabel>Freezer Box</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Top Drawer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                    <div className="relative flex justify-center items-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                        {preview ? (
                            <Image src={preview} alt="Preview" fill style={{ objectFit: 'cover' }} className="rounded-lg" />
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <UploadCloud className="mx-auto h-8 w-8" />
                                <p className="text-sm">Click to upload</p>
                            </div>
                        )}
                        <Input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            {...photoRef}
                            onChange={handlePhotoChange}
                        />
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { FreezerContent } from '@/components/freezer-content';
import { BottomNavbar } from '@/components/bottom-navbar';
import type { Freezer } from '@/lib/types';
import { freezersApi } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // A key to force re-render/re-fetch of FreezerContent
  const [refreshKey, setRefreshKey] = useState(0); 
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [freezers, setFreezers] = useState<Freezer[]>([
    { id: 'freezer1', name: 'Congelador de cocina' },
    { id: 'freezer2', name: 'Congelador del garaje' },
  ]);
  const [currentFreezerId, setCurrentFreezerId] = useState('freezer1');

  const handleItemAdded = () => {
    setIsAddDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleRenameFreezer = async (name: string) => {
    const response = await freezersApi.updateFreezer(currentFreezerId, name);
    if (response.success) {
      setFreezers((prev) =>
        prev.map((freezer) =>
          freezer.id === currentFreezerId ? { ...freezer, name } : freezer
        )
      );
      return;
    }
    throw new Error(response.error || 'No se pudo actualizar el nombre del congelador');
  };

  useEffect(() => {
    if (!user) return;

    const loadFreezers = async () => {
      try {
        const response = await freezersApi.getFreezers();
        if (response.success && Array.isArray(response.data)) {
          setFreezers(response.data);
          setCurrentFreezerId((prev) =>
            response.data.find((freezer) => freezer.id === prev)?.id ?? response.data[0]?.id ?? prev
          );
        }
      } catch (error) {
        console.error('Failed to load freezers:', error);
      }
    };

    loadFreezers();
  }, [user]);
  
  const currentFreezerName = freezers.find(f => f.id === currentFreezerId)?.name || 'Congelador';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header freezerName={currentFreezerName} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24">
        <FreezerContent 
          key={refreshKey}
          isAddDialogOpen={isAddDialogOpen}
          onOpenChangeAction={setIsAddDialogOpen}
          onItemAddedAction={handleItemAdded}
          view={view}
          searchQuery={searchQuery}
          currentFreezerId={currentFreezerId}
          currentFreezerName={currentFreezerName}
          onRenameFreezer={handleRenameFreezer}
        />
      </main>
      <BottomNavbar 
        view={view}
        setView={setView}
        onAddClick={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        freezers={freezers}
        currentFreezerId={currentFreezerId}
        onFreezerChange={setCurrentFreezerId}
      />
    </div>
  );
}
